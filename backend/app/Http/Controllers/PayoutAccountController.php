<?php

namespace App\Http\Controllers;

use App\Models\PayoutAccount;
use App\Models\User;
use App\Services\PayoutService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PayoutAccountController extends Controller
{
    //
    protected $service;
    protected $user;

    public function __construct()
    {
        $this->service = new PayoutService;
        $this->user = new User;
    }

    public function create(Request $request, User $user)
    {
        $data = $request->validate([
            'bank_name' => 'required|string',
            'account_name' => 'required|string',
            'account_number' => 'required|numeric',
        ]);
        $payout = $this->service->checkPayout($request->bank_name);

        if ($payout)
        {
             return response([
                'success' => false, 
                'message' => 'Payout account already exists', 
            ]);
        }

        $account = $this->service->createAccount(Auth::user(), $data);

        return response([
            'success' => true, 
            'message' => 'Payout account created successfully', 
            'result' => [
                'account' => $account
            ]
        ]);
    }

    public function update(Request $request, PayoutAccount $account)
    {
        $data = $request->only(['bank_name', 'account_name', 'account_number']);

        $account = $this->service->updateAccount($data, $request->route('id'));

        return response([
            'success' => true,
            'message' => 'Payout account updated successfully',
            'result' => [
                'account' => $account
            ]
        ]);
    }

    public function delete(PayoutAccount $account)
    {
        $this->service->deleteAccount($account);

        return response([
            'success' => true,
            'message' => 'Payout account deleted'
        ]);
    }


    public function lock(Request $request, User $user)
    {
        $request->validate(['amount' => 'required|numeric|min:1']);

        $result = $this->service->lockFunds($user, $request->amount);

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

        $result = $this->service->releaseFunds($user, $request->amount);

        return response()->json($result);
    }

    public function withdraw(Request $request, User $user)
    {
        $request->validate(['amount' => 'required|numeric|min:1']);

        $result = $this->service->withdrawLocked($user, $request->amount);

        return response()->json($result);
    }

}
