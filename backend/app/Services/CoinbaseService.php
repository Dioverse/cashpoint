<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class CoinbaseService
{
    protected $apiKey;
    protected $baseUrl;
    protected $secretKey;

    public function __construct()
    {
        $this->apiKey = config('services.coinbase.api_key');
        $this->baseUrl = config('services.coinbase.base_url');
        $this->secretKey = config('services.coinbase.secret_key');
    }

    private function signRequest($timestamp, $method, $path, $body = '')
    {
        $message = $timestamp . $method . $path . $body;
        return hash_hmac('sha256', $message, $this->secretKey);
    }

    private function request($method, $endpoint, $body = [])
    {
        $timestamp = time();
        $bodyString = $body ? json_encode($body) : '';
        $signature = $this->signRequest($timestamp, $method, $endpoint, $bodyString);

        return Http::withHeaders([
            'CB-ACCESS-KEY' => $this->apiKey,
            'CB-ACCESS-SIGN' => $signature,
            'CB-ACCESS-TIMESTAMP' => $timestamp,
            'Content-Type' => 'application/json',
        ])->$method($this->baseUrl . $endpoint, $body);
    }

    public function buyBTC($amountUSD)
    {
        return $this->request('post', '/api/v3/brokerage/orders', [
            "side" => "BUY",
            "product_id" => "BTC-USD",
            "order_configuration" => [
                "market_market_ioc" => [
                    "quote_size" => (string)$amountUSD
                ]
            ]
        ]);
    }

    public function sellBTCtoUSDT($amountBTC)
    {
        return $this->request('post', '/api/v3/brokerage/orders', [
            "side" => "SELL",
            "product_id" => "BTC-USDT",
            "order_configuration" => [
                "market_market_ioc" => [
                    "base_size" => (string)$amountBTC
                ]
            ]
        ]);
    }

    public function getCurrency()
    {
        $response = $this->request('get', '/currencies');
        return $response->json();
    }


    public function buyCrypto($user, $data)
    {
        $signature = $this->generateSignature($data);
        $timestamp = time();
        $response = Http::post("{$this->baseUrl}/brokerage/orders", [
            'headers' => [
                'CB-ACCESS-KEY'         => $this->apiKey,
                'CB-ACCESS-SIGN'        => $signature,
                'CB-ACCESS-TIMESTAMP'   => $timestamp,
                'Content-Type'          => 'application/json',
            ],
            'json' => [
                "side" => "BUY",
                "product_id" => "BTC-USD",
                "order_configuration" => [
                    "market_market_ioc" => [
                        "quote_size" => "100"  // amount in USD
                    ]
                ]
            ]
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'error' => 'Failed to buy crypto',
            'details' => $response->json()
        ];

    }

    public function sellCrypto()
    {
        $signature = $this->generateSignature($data);
        $timestamp = time();
        $response = Http::withHeaders([
                        'CB-ACCESS-KEY' => env('COINBASE_API_KEY'),
                        'CB-ACCESS-SIGN' => $signature,
                        'CB-ACCESS-TIMESTAMP' => $timestamp,
                        'Content-Type' => 'application/json',
                    ])->post('https://api.coinbase.com/api/v3/brokerage/orders', [
                        'json' => [
                            "side" => "SELL",
                            "product_id" => "BTC-USDT",
                            "order_configuration" => [
                                "market_market_ioc" => [
                                    "base_size" => "0.01"  // amount in BTC
                                ]
                            ]
                        ]
                    ]);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'error' => 'Failed to sell crypto',
            'details' => $response->json()
        ];
    }

    protected function generateSignature($data)
    {
        $timestamp = time();
        $body = json_encode($data);
        $signature = hash_hmac('sha256', "{$timestamp}{$body}", $this->secretKey);
        return $signature;
    }
}
