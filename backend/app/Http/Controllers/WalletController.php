<?php

namespace App\Http\Controllers;

use App\Services\WalletService;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    //
    protected $walletService;

    public function __construct()
    {
        $this->walletService = new WalletService();
    }

    public function getBalance(Request $request)
    {
        $user = $request->user();
        return $this->walletService->getUserBalance($user);
    }

    public function fund(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'type' => 'required|string|in:naira,usd'
        ]);

        $user = $request->user();
        return $this->walletService->fundWallet($user, $validated);
    }

    public function withdraw(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'type' => 'required|string|in:naira,usd'
        ]);

        $user = $request->user();
        return $this->walletService->withdrawFromWallet($user, $validated);
    }
}
