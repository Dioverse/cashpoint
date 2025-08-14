<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class SmeplugService
{
    protected $baseUrl;
    protected $apiKey;

    public function __construct()
    {
        $this->baseUrl = 'https://smeplug.ng/api/v1/';
        $this->apiKey = config('services.smeplug.key');
    }

    public function purchaseData($networkId, $planId, $phone, $ref)
    {
        return Http::withHeaders([
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type'  => 'application/json'
                ])->post("{$this->baseUrl}data/purchase", [
                    'network_id'       => $networkId,
                    'plan_id'          => $planId,
                    'phone'            => $phone,
                    'customer_reference'=> $ref
                ]);
    }

    public function purchaseAirtime($network, $phone, $amount, $ref)
    {
        return Http::withHeaders([
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type'  => 'application/json'
                ])->post("{$this->baseUrl}airtime/purchase", [
                    'network_id'        => $network,
                    'phone'             => $phone,
                    'amount'            => $amount,
                    'customer_reference'=> $ref
                ]);
    }

    public function transaction($ref)
    {
        return Http::withHeaders([
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type'  => 'application/json'
                ])->get("{$this->baseUrl}transactions/{$ref}");
    }


}
