<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CryptoApiService
{
    protected $baseUrl;
    protected $apiPublicKey;
    protected $apiSecretKey;
    protected $vaultId;
    protected $signKey;
    protected $passPhrase;


    public function __construct()
    {
        $this->baseUrl          = config('cryptoapis.base_url');
        $this->apiPublicKey     = config('cryptoapis.api_public_key');
        $this->apiSecretKey     = config('cryptoapis.api_secret_key');
        $this->vaultId          = config('cryptoapis.vault_id');
        $this->passPhrase       = config('cryptoapis.pass_phrase');
        $this->signKey          = time() . 'POST';
    }

    private function headers($path, $body = '')
    {
        $timestamp = time();//(int) round(microtime(true) * 1000);

        // Ensure body is JSON string, not array
        if (is_array($body)) {
            $body = json_encode($body, JSON_UNESCAPED_SLASHES);
        }

        $message = $timestamp . 'POST' . $path . $body;

        $decodedSecret = base64_decode($this->apiSecretKey);
        $signature     = hash_hmac('sha256', $message, $decodedSecret, true);
        $signatureB64  = base64_encode($signature);

        Log::info('Vaultody Headers', [
            'timestamp' => $timestamp,
            'message'   => $message,
            'signature' => $signatureB64,
        ]);

        return [
            'x-api-key'        => $this->apiPublicKey,
            'x-api-sign'       => $signatureB64,
            'x-api-timestamp'  => $timestamp,
            'x-api-passphrase' => $this->passPhrase,
            'Content-Type'     => 'application/json',
        ];
    }


    private function signRequest($method, $path, $body = '', $query = '')
    {
        // $timestamp      = time();
        $timestamp      = time();//(int) round(microtime(true) * 1000);
        $message        = $timestamp . strtoupper($method) . $path . $body . $query;
        $decodedSecret  = base64_decode($this->apiSecretKey);
        $signature      = hash_hmac('sha256', $message, $decodedSecret, true);
        $signatureB64   = base64_encode($signature);

        // signature = hmac.new(decoded_secret, message.encode('utf-8'), hashlib.sha256).digest()
        Log::info('Vaultody Headers', [
            'timestamp' => $timestamp,
            'message'   => $message,
            'signature' => $signatureB64,
        ]);
        return [
            'x-api-key'       => $this->apiPublicKey,
            'x-api-sign'      => $signatureB64,
            'x-api-timestamp' => $timestamp,
            'x-api-passphrase'=> $this->passPhrase,
            'Content-Type'    => 'application/json',
        ];
    }

    public function generateDepositAddress(string $blockchain, string $label = null)
    {
        $vaultId        = $this->vaultId;
        $exampleString  = Str::random(32);
        $label          = Auth::user()->email;
        $endpoint       = "/vaults/{$vaultId}/{$blockchain}/testnet/addresses";//?context={$exampleString}";
        $path           = "/vaults/deposit{\"currency\":\"BTC\",\"amount\":\"0.5\"}";

        $payload  = [
            'data' => [
                'item' => [
                    'label' => $label ?? 'Deposit Address'
                ]
            ]
        ];

        $body = json_encode($payload, JSON_UNESCAPED_SLASHES);
        // $timestamp      = Carbon::now()->timestamp;
        // $message        = $timestamp . strtoupper('POST') . '/' . $body . '';
        // $decodedSecret  = base64_decode($this->apiSecretKey);
        // $signature      = hash_hmac('sha256', $message, $decodedSecret, true);
        // $signatureB64   = base64_encode($signature);

        // $response = Http::withHeaders([
        //     'x-api-key'       => $this->apiPublicKey,
        //     'x-api-sign'      => $signatureB64,
        //     'x-api-timestamp' => $timestamp,
        //     'x-api-passphrase'=> $this->passPhrase,
        //     'Content-Type'    => 'application/json',
        // ])->post(
        //     $endpoint,
        //     $payload
        // );

        // $response = Http::withHeaders(
        //     $this->signRequest('POST', $path, $body, "?context={$exampleString}")
        // )->post($endpoint, $payload);

        $response = Http::withHeaders(
            $this->headers($endpoint, $body)
        )->post($this->baseUrl . $endpoint, $payload);

        if ($response->successful()) {
            return $response->json('data.item');
        }

        throw new \Exception('Vaultody deposit failed: ' . $response->body());
    }


     /**
     * Create fungible transaction request.
     */
    public function createFungibleTransaction(string $blockchain, array $item)
    {
        $endpoint = "/transactions/fungible-transaction-request-from-address-without-fee-priority";

        $payload  = [
            'data' => [
                'item' => $item
            ]
        ];

        $body = json_encode($payload);

        $response = Http::withHeaders(
                        $this->headers('POST', $endpoint, $body)
                    )->post(
                        $this->baseUrl . $endpoint, $payload
                    );

        if ($response->successful())
        {
            return $response->json('data.item');
        }

        throw new \Exception('Vaultody transaction request failed: ' . $response->body());
    }

    /** Get Exchange Rate */
//     public function getExchangeRate($fromSymbol, $toSymbol)
//     {
//         return $this->request('get', "/exchange-rates/by-symbols/{$fromSymbol}/{$toSymbol}");
//     }
}
