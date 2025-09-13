<?php

namespace App\Http\Controllers;

use App\Models\PayoutAccount;
use App\Models\User;
use App\Services\PayoutService;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PayoutAccountController extends Controller
{
    //
    protected $walletService;
    protected $service;
    protected $user;
    protected $auth;

    public function __construct()
    {
        $this->walletService = new WalletService;
        $this->service = new PayoutService;
        $this->user = new User;
        $this->auth = Auth::user();
    }

    public function create(Request $request, User $user)
    {
        try {
            DB::beginTransaction();
            $data = $request->validate([
                'bank_name' => 'required|string',
                'bank_code' => 'required|string',
                'account_name' => 'required|string',
                'account_number' => 'required|string',
            ]);

            // Create receipt on paystack
            $recipient = $this->service->createPaystackRecipient([
                'type'          => 'nuban',
                'name'          => $data['account_name'],
                'account_number'=> $data['account_number'],
                'bank_code'     => $data['bank_code'],
                'currency'      => 'NGN'
            ]);

            if (!$recipient['success']) {
                return response([
                    'success' => false,
                    'message' => 'Failed to create recipient on Paystack',
                ]);
            }

            $payout = $this->service->checkPayout($request->account_number);

            if ($payout)
            {
                return response([
                    'success' => false,
                    'message' => 'Payout account already exists',
                    'data'    => $recipient
                ]);
            }

            $account = $this->service->createAccount(Auth::user(), [
                'bank_name'      => $data['bank_name'],
                'bank_code'      => $data['bank_code'],
                'account_name'   => $data['account_name'],
                'account_number' => $data['account_number'],
                'recipient_code' => $recipient['data']['recipient_code'],
            ]);

            DB::commit();
            return response([
                'success' => true,
                'message' => 'Payout account created successfully',
                'result' => [
                    'account' => $account,
                    'recipient' => $payout
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response([
                'success' => false,
                'message' => 'Error creating payout account: ' . $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, PayoutAccount $account)
    {
        $data = $request->only(['bank_name', 'bank_code', 'account_name', 'account_number']);

        $this->service->updateAccount($data, $request->route('id'));

        return response([
            'success' => true,
            'message' => 'Payout account updated successfully',
        ]);
    }

    public function delete(PayoutAccount $account)
    {
        $delete = $this->service->deleteAccount($account, $this->auth);
        if (!$delete)
        {
            return response([
                'success' => false,
                'message' => 'Error deleting payout account',
            ]);
        }

        // delete from paystack recipients too
        $this->service->deletePaystackRecipient($account->recipient_code);
        return response([
            'success' => $delete,
            'message' => $delete ? 'Payout account deleted' : 'Unauthorized'
        ]);
    }


    public function lock(Request $request, User $user)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'date'   => 'nullable|date'
        ]);

        $result = $this->service->lockFunds($this->auth, $request->amount, $request->date ?? null);

        return response([
            'success'=> true,
            'message'=> 'Account Successfully Locked',
            'result'=> [
                'data'=> $result
            ]
        ]);
    }

    public function paymentLock(Request $request, User $user)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'date'   => 'nullable|date'
        ]);

        $result = $this->service->lockFunds($this->auth, $request->amount, $request->date ?? null);

        return response([
            'success'=> true,
            'message'=> 'Account Successfully Locked',
            'result'=> [
                'data'=> $result
            ]
        ]);
    }

    public function release(Request $request, User $user)
    {
        $request->validate(['amount' => 'required|numeric|min:1']);

        $result = $this->service->releaseFunds($this->auth, $request->amount);

        return response()->json($result);
    }


    public function requestWithdraw(Request $request, User $user)
    {
        try
        {
            DB::beginTransaction();
            // validate request
            $request->validate([
                'amount'            => 'required|numeric|min:1',
                'recipient_code'    => 'required|string',
            ]);
            $result = $this->service->initiateTransfer([
                'source'            => 'balance',
                'amount'            => $request->amount * 100, // convert to kobo
                'recipient'         => $request->recipient_code,
                'reference'         => 'WD_'.uniqid(),
                'reason'            => 'User Withdrawal'
            ]);

            if (!$result['success']) {
                return response([
                    'success' => false,
                    'message' => 'Error initiating withdrawal: ' . $result['message'],
                ]);
            }

            // if paystack transfer is successful, deduct from user wallet
            $this->auth->wallet_naira -= $request->amount;
            $this->auth->save();

            // Record the withdrawal
            $this->walletService->create([
                'user_id'    => $this->auth->id,
                'channel'    => 'Bank Transfer',
                'amount'     => $request->amount,
                'currency'   => 'NGN',
                'bank'       => $request->recipient_code,
                'status'     => $result['data']['status'] === 'success' ? 'completed' : 'pending',
                'reference'  => $result['data']['reference'],
                'description'=> 'Withdrawal to bank account'
            ]);

            DB::commit();
            return response([
                'success' => $result['success'],
                'message' => $result['message'],
                'result'  => $result['data'] ?? null
            ]);
        } catch (\Exception $e) {
            return response([
                'success' => false,
                'message' => 'Error initiating withdrawal: ' . $e->getMessage(),
            ]);
        }

    }

    // Need to be removed later
    public function withdraw(Request $request, User $user)
    {
        $request->validate(['amount' => 'required|numeric|min:1']);

        $result = $this->service->withdrawLocked($user, $request->amount);

        return response([
            'success' => true,
            'message' => 'Bank list retrieved successfully',
            'result' => [$result]
        ]);
    }

    public function bankList()
    {
        // $banks = [
        //     "Access Bank",
        //     "Citibank",
        //     "Diamond Bank",
        //     "Ecobank Nigeria",
        //     "Fidelity Bank Nigeria",
        //     "First Bank of Nigeria",
        //     "First City Monument Bank",
        //     "Guaranty Trust Bank",
        //     "Heritage Bank Plc",
        //     "Jaiz Bank",
        //     "Keystone Bank Limited",
        //     "Providus Bank Plc",
        //     "Polaris Bank",
        //     "Stanbic IBTC Bank Nigeria Limited",
        //     "Standard Chartered Bank",
        //     "Sterling Bank",
        //     "Suntrust Bank Nigeria Limited",
        //     "Union Bank of Nigeria",
        //     "United Bank for Africa",
        //     "Unity Bank Plc",
        //     "Wema Bank",
        //     "Zenith Bank"
        // ];

        $banks = $this->service->getBankList();

        return response([
            'success' => true,
            'message' => 'Bank list retrieved successfully',
            'result' => [
                'banks' => $banks
            ]
        ]);
    }

    public function validateAccount(Request $request)
    {
        $request->validate([
            'account_number' => 'required|string',
            'bank_code'      => 'required|string'
        ]);

        $result = $this->service->validateAccount($request->account_number, $request->bank_code);

        return response([
            'success' => true,
            'message' => 'Account validated successfully',
            'result' => [$result]
        ]);
    }

    public function getRecipients()
    {
        $recipients = $this->service->listRecipients();

        return response([
            'success' => true,
            'message' => 'Payout recipients retrieved successfully',
            'result' => [
                'recipients' => $recipients
            ]
        ]);
    }

    // create virtual account for user
    public function createVirtualAccount(Request $request)
    {
        try {
            DB::beginTransaction();
            $User = $this->auth;
            $request = $this->service->createVirtualAccount([
                "email"             => $User->email,
                "first_name"        => $User->firstName,
                "middle_name"       => $User->username,
                "last_name"         => $User->lastName,
                "phone"             => $User->phone,
                "preferred_bank"    => "test-bank",
                "country"           => "NG"
            ]);

            if (!$request['success']) {
                return response([
                    'success' => false,
                    'message' => 'Error creating virtual account: ' . ($request['message'] ?? 'Unknown error'),
                ]);
            }

            // update user with virtual account details as json
            $User->virtual_accounts = json_encode($request['data']);
            $User->save();

            return response([
                'success' => true,
                'message' => 'Virtual account created successfully',
                'result' => $request
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response([
                'success' => false,
                'message' => 'Error creating virtual account: ' . $e->getMessage(),
            ]);
        }
    }

    // create virtual account for user through customer creation
    public function createVirtualAccountThroughCustomer(Request $request)
    {
        try {
            DB::beginTransaction();
            $User = $this->auth;
            $request = $this->service->createPaystackCustomer([
                "email"             => $User->email,
                "first_name"        => $User->firstName,
                "last_name"         => $User->lastName,
                "phone"             => $User->phone,
            ]);


            if (!$request['success']) {
                return response([
                    'success' => false,
                    'message' => 'Error creating customer account: ' . ($request['message'] ?? 'Unknown error'),
                ]);
            }

            $vaccount = $this->service->createVirtualAccountForCustomer([
                "customer"       => $request['data']['id'],
                "preferred_bank" => "wema-bank"
            ]);

            return response([
                'success' => true,
                'message' => 'Virtual account created successfully',
                'result' => $vaccount
            ]);

            if (!$vaccount['success']) {
                return response([
                    'success' => false,
                    'message' => 'Error creating virtual account: ' . ($vaccount['message'] ?? 'Unknown error'),
                ]);
            }

            // update user with virtual account details as json
            $User->virtual_accounts = json_encode($vaccount['data']);
            $User->save();

            return response([
                'success' => true,
                'message' => 'Virtual account created successfully',
                'result' => $request
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response([
                'success' => false,
                'message' => 'Error creating virtual account: ' . $e->getMessage(),
            ]);
        }
    }

    // finalize withdraw with otp
    public function finalizeWithdraw(Request $request)
    {
        try{
            $request->validate([
                'otp'           => 'required|string',
                'transfer_code' => 'required|string',
            ]);

            $result = $this->service->finalizeTransfer($request->transfer_code, $request->otp);
            return response([
                'success' => $result['success'],
                'message' => $result['message'],
                'result' => $result['data'] ?? null
            ]);

        } catch (\Exception $e) {
            return response([
                'success' => false,
                'message' => 'Error finalizing withdrawal: ' . $e->getMessage(),
            ]);
        }

    }

}
