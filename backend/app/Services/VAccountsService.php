<?php

namespace App\Services;

use App\Mail\OtpMail;
use App\Models\Otp;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;

class VAccountsService
{
    protected $baseUrl;
    protected $secretKey;
    protected $publicKey;

    public function __construct()
    {
        // Ensure the user is authenticated
        // $this->middleware('auth.sanctum');
        $this->baseUrl = config('services.paystack.base_url', 'https://api.paystack.co');
        $this->secretKey = config('services.paystack.secret_key');
        $this->publicKey = config('services.paystack.public_key');
    }



    public function createVirtualAccount(string $firstName, string $lastName, string $customerEmail, string $phone)
    {
        $response = Http::withToken($this->secretKey)
            ->post("{$this->baseUrl}/dedicated_account/assign", [
                //  "subaccount": "", // Optional, if you have a subaccount code
                "country"               => "NG",
                "preferred_bank"        => "test-bank",//"wema-bank",
                "phone"                 => $phone,
                "first_name"            => $firstName,
                "last_name"             => $lastName,
                "middle_name"           => $firstName,
                "email"                 => $customerEmail
            ]);

        if ($response->successful()) {
            return $response;
        }

        throw new \Exception("Failed to create virtual account: " . $response->body());
    }



}
