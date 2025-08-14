<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class VTPassService
{
    protected $requestID;
    protected $username;
    protected $password;
     protected $baseUrl;
    protected $apiKey;
    protected $publicKey;
    protected $secreteKey;

    public function __construct()
    {
        date_default_timezone_set("Africa/Lagos");
        $this->requestID= date('YmdHi').rand(99, 9999999);
        $this->baseUrl  = config('services.vtpass.url');
        $this->username = config('services.vtpass.username');
        $this->password = config('services.vtpass.password');
        $this->apiKey   = config('services.vtpass.api_key');
        $this->publicKey= config('services.vtpass.public_key');
        $this->secreteKey= config('services.vtpass.secrete_key');
    }

    protected function makeRequest($payload)
    {
        return Http::withBasicAuth($this->username, $this->password)
                    ->post($this->baseUrl . '/pay', $payload)->json();
        // return Http::withHeaders([
        //     'api-key'    => $this->apiKey,
        //     'public-key' => $this->publicKey,
        //     'secret-key' => $this->secreteKey,
        // ])->post($this->baseUrl . '/pay', $payload)->json();
    }

    public function payCable($serviceID, $billersCode, $amount, $variationCode, $phone)
    {
        return json_encode(
                $this->makeRequest([
                    'request_id'    => $this->requestID,
                    'serviceID'     => "$serviceID",
                    'billersCode'   => "$billersCode",
                    'variation_code'=> "$variationCode",
                    'amount'        => $amount,
                    'phone'         => $phone,
                    'subscription_type' => 'change',
                    'quantity'      => 1
                ])
            );

    }

    public function payBill($serviceID, $billersCode, $amount, $variationCode, $phone)
    {
        return json_encode(
                $this->makeRequest([
                    'request_id'    => $this->requestID,
                    'serviceID'     => "$serviceID",
                    'billersCode'   => "$billersCode",
                    'variation_code'=> "$variationCode", //prepaid or postpaid
                    'amount'        => $amount,
                    'phone'         => $phone,
                    'subscription_type' => 'change'
                ])
            );
    }

    // VTPass Service to validate payment ++++++++++++++++++++++++++++++
    public function validate(array $Details)
    {
        $response = Http::withBasicAuth($this->username, $this->password)
                        ->post(
                            $this->baseUrl . '/merchant-verify',
                            $Details
                        );
        return $response->json();

    }
}
