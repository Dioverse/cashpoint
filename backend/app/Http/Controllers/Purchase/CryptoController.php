<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CryptoController extends Controller
{
    //
    protected $cryptoService;

    public function __construct(CryptoService $cryptoService)
    {
        $this->cryptoService = $cryptoService;
    }

    public function sell(Request $request)
    {
        $validated = $request->validate([
            'coin' => 'required|string|in:USDT,BTC,BNB,PI',
            'amount' => 'required|numeric|min:1',
        ]);

        $user = $request->user();
        return $this->cryptoService->processSell($user, $validated);
    }

    public function generateWalletAddress(Request $request)
    {
        $validated = $request->validate([
            'coin' => 'required|string|in:USDT,BTC,BNB',
            'amount_ngn' => 'required|numeric|min:1',
        ]);

        $user = $request->user();
        return $this->cryptoService->createWalletAddress($user, $validated);
    }

    public function confirmPayment(Request $request)
    {
        $validated = $request->validate([
            'wallet_address' => 'required|string',
            'tx_hash' => 'required|string',
        ]);

        return $this->cryptoService->confirmCryptoPayment($validated);
    }

    public function getRates()
    {
        return $this->cryptoService->getCryptoRates();
    }
}
