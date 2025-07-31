<?php

namespace App\Services;

use App\Models\Crypto;
use Illuminate\Support\Facades\Http;

class NowNodeService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.nownode.api_key');
        $this->baseUrl = config('services.nownode.base_url');
    }

    public function sendToWallet(Crypto $crypto, string $toWallet, float $amount)
    {
        // $client = new \GuzzleHttp\Client();
        // Ensure the crypto is active and has a valid chain
        if (!$crypto->is_active || !$crypto->chain) {
            return response([
                'message' => 'Invalid crypto configuration',
                'status' => false,
            ], 400);
        }

        $response = Http::post("{$this->baseUrl}/{$crypto->chain}/sendtx", [
            'headers' => [
                'api-key' => $this->apiKey,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'to' => $toWallet,
                'value' => $amount,
                // 'from' => $your_wallet_address, // from app owner
                // 'privateKey' => 'your-private-key', // keep safe
            ]
        ]);

        $data = json_decode($response->getBody(), true);
        return $data['txid'] ?? null;
    }
}
