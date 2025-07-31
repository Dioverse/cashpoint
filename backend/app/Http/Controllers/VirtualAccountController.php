<?php

namespace App\Http\Controllers;


use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Log;
use App\Services\VAccountsService;
use App\Services\AuthServices;
use App\Services\SettingService;
use App\Services\WalletService;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VirtualAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $paystackService;
    protected $settingService;
    protected $walletService;
    protected $userService;

    public function __construct()
    {
        // Ensure the user is authenticated
        // $this->middleware('auth:sanctum');
        $this->userService = new AuthServices;
        $this->walletService = new WalletService;
        $this->settingService = new SettingService;
        $this->paystackService = new VAccountsService;
    }


    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        $secret     = config('services.paystack.secret_key');
        $payload    = $request->getContent();
        $signature  = $request->header('x-paystack-signature');

        // Verify webhook signature
        if (hash_hmac('sha512', $payload, $secret) !== $signature) {
            Log::warning('Paystack Webhook: Invalid Signature');
            return response('Invalid signature', 401);
        }

        $event = $request->input('event');

        if ($event === 'charge.success') {
            $data = $request->input('data');

            // Only handle virtual account bank deposits
            if ($data['channel'] === 'bank' && isset($data['customer']['email'])) {
                $email      = $data['customer']['email'];
                $amount     = $data['amount'] / 100;
                $reference  = $data['reference'];
                $bank       = $data['authorization']['bank'] ?? 'Unknown Bank';

                // Find user by email
                $user = $this->userService->getUserByEmail($email);

                if ($user) {
                    // Update the user details ........................
                    $user->update([
                        'virtual_accounts' => $bank,
                    ]);

                    Log::info("Wallet funded: {$user->email} - ₦{$amount}");
                } else {
                    Log::warning("Webhook received for unknown user: {$email}");
                }
            }
        }

        return response('Webhook received', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function create(Request $request)
    : Response
    {

        $user = auth()->user();
        $ref = 'VA_' . Str::uuid();
        // Logic to create a virtual account for the user

        try {
            $paystack = $this->paystackService;
            $User = $this->userService;
            $virtualAccount = $paystack->createVirtualAccount(
                $user->firstName,
                $user->lastName,
                $user->email,
                $user->phone
            );



            return response([
                'message'   => __('app.virtual_account_created'),
                'status'    => true,
                'results'   => [
                    'user'  => new UserResource($user),
                    'data' => $virtualAccount,
                ],
            ], 201);

        } catch (\Exception $e) {
            return response([
                'message'   => __('app.virtual_account_error'),
                'status'    => false,
                'error'     => $e->getMessage(),
            ], 201);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Withdraw funds from the user's wallet to another wallet or account.
     */
    public function withdraw(Request $request)
    {
        // account can be either 'usd' or 'ngn'
        $request->validate([
            'account'   => 'required|in:usd,ngn',
        ]);
        $user       = auth()->user();
        $amount     = $request->amount;
        $account    = $request->account;
        $reference  = 'RN' . random_int(100000, 999999) . date('Ym');

        // Check conversion rate .....................
        $conversionrate = $this->settingService->getExchangeRate();

        if ($account === 'usd')
        {
            $request->validate([
                'amount'    => 'required|numeric|min:1',
            ]);
            // Convert Naira to USD, the amount is in Naira and will be converted to USD
            $amountInUSD    = $amount / $conversionrate;

            // Check if the user has sufficient balance
            if ($user->wallet_naira < $amount) {
                return response([
                    'message' => __('app.insufficient_balance'),
                    'status' => false,
                ], 400);
            }

            $user->wallet_usd   += $amountInUSD;
            $user->wallet_naira -= $amount;
            $user->save();

            // Save the withdrawal transaction
            $this->walletService->create([
                'user_id'       => $user->id,
                'reference'     => $reference,
                'amount'        => $amountInUSD,
                'channel'       => 'virtual_account',
                'currency'      => 'USD',
                'status'        => 'successful',
                'bank'          => 'Naira Account',
                'description'   => 'Withdrawal Naira to USD account',
            ]);

            return response([
                'message' => __('app.withdrawal_success'),
                'status' => true,
            ], 201);

        }
        else
        {
            if ($request->amount < 1) {
                return response([
                    'message' => __('app.invalid_amount'),
                    'status' => false,
                ], 400);
            }

            $amountInNaira    = $amount * $conversionrate;

            // Check if the user has sufficient balance
            if ($user->wallet_usd < $amount) {
                return response([
                    'message' => __('app.insufficient_balance'),
                    'status' => false,
                ], 400);
            }

            $user->wallet_usd   -= $amount;
            $user->wallet_naira += $amountInNaira;
            $user->save();

            // Save the withdrawal transaction
            $this->walletService->create([
                'user_id'       => $user->id,
                'reference'     => $reference,
                'amount'        => $amountInNaira,
                'channel'       => 'virtual_account',
                'currency'      => 'NGN',
                'status'        => 'successful',
                'bank'          => 'USD Account',
                'description'   => 'Withdrawal USD to Naira account',
            ]);

            return response([
                'message' => __('app.withdrawal_success'),
                'status' => true,
            ], 201);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


}
