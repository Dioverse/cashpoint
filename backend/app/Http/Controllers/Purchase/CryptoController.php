<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use App\Services\CryptoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CryptoController extends Controller
{
    //
    protected $cryptoService;

    public function __construct()
    {
        $this->cryptoService = new CryptoService;
    }

    public function sell(Request $request)
    {
        $validated = $request->validate([
            'crypto_id'     => 'required|exists:cryptos,id',
            'amount_crypto' => 'required|numeric|min:0.001',
        ]);

        $user = Auth::user();
        return $this->cryptoService->processSell($user, $validated);

    }

    public function buy(Request $request)
    {
        $validated = $request->validate([
            'crypto_id'     => 'required|exists:cryptos,id',
            'amount_usd'    => 'required|numeric|min:10',
            'wallet_address'=> 'required|string',
        ]);

        $user = Auth::user();
        return $this->cryptoService->processBuy($user, $validated);

    }

    public function generateWalletAddress(Request $request)
    {
        $validated = $request->validate([
            'coin'      => 'required|string|in:USDT,BTC,BNB',
            'amount_ngn'=> 'required|numeric|min:1',
        ]);

        $user = $request->user();
        return $this->cryptoService->createWalletAddress($user, $validated);
    }

    public function confirmPayment(Request $request)
    {
        $validated = $request->validate([
            'wallet_address'=> 'required|string',
            'tx_hash'       => 'required|string',
        ]);

        return $this->cryptoService->confirmCryptoPayment($validated);
    }

    public function getRates()
    {
        return response([
            'message'   => __('app.crypto_rates_retreived'),
            'status'    => true,
            'results'   => [
                'data'  => getCryptoRates()
            ]
        ]);
    }



}
