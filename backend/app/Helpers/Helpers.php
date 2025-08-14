<?php

use App\Http\Resources\CryptoResource;
use App\Models\Crypto;
use Illuminate\Support\Facades\Cache;

if (!function_exists('getCryptoRate')) {
    function getCryptoRate(string $symbol): float
    {
        return Cache::remember("crypto_rate_" . strtoupper($symbol), 300, function () use ($symbol) {
            return Crypto::where('symbol', strtoupper($symbol))->value('usd_rate') ?? 5000;
        });
    }
}


if (!function_exists('getCryptoRates')) {
    function getCryptoRates()
    {
        // get crypto rate in symbols => usd_rat format
        return Crypto::get()->mapWithKeys(function ($crypto) {
            return [$crypto->symbol => $crypto->usd_rate];
        });
    }
}


if (!function_exists('checkWalletBalance')) {
    function checkWalletBalance($user, $amount) {
        return $user->wallet_naira >= $amount;
    }
}



