<?php

namespace App\Http\Controllers;

use App\Services\AuthServices;
use App\Services\VAccountsService;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentWebhook extends Controller
{
    //
    protected $paystackService;
    protected $walletService;
    protected $userService;

    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->userService = new AuthServices();
        $this->walletService = new WalletService();
        $this->paystackService = new VAccountsService();
    }

    public function handleWebhook(Request $request)
    {
        $secret     = config('services.paystack.secret_key');
        $payload    = $request->getContent();
        $signature  = $request->header('x-paystack-signature');

        // Verify webhook signature
        if (hash_hmac('sha512', $payload, $secret) !== $signature) {
            Log::warning('Paystack Webhook: Invalid Signature');
            return response('Invalid signature', 401);
        }

        $event = $request->input('event');

        if ($event === 'charge.success') {
            $data = $request->input('data');

            // Only handle virtual account bank deposits
            if ($data['channel'] === 'bank' && isset($data['customer']['email'])) {
                $email      = $data['customer']['email'];
                $amount     = $data['amount'] / 100;
                $reference  = $data['reference'];
                $bank       = $data['authorization']['bank'] ?? 'Unknown Bank';

                // Find user by email
                $user = $this->userService->getUserByEmail($email);

                if ($user) {
                    // Log or record transaction
                    $this->walletService->create([
                        'user_id'       => $user->id,
                        'reference'     => $reference,
                        'amount'        => $amount,
                        'channel'       => 'virtual_account',
                        'status'        => 'successful',
                        'bank'          => $bank,
                    ]);

                    // Optional: update wallet balance
                    $user->wallet_naira += $amount;
                    $user->save();

                    Log::info("Wallet funded: {$user->email} - ₦{$amount}");
                } else {
                    Log::warning("Webhook received for unknown user: {$email}");
                }
            }
        }

        return response('Webhook received', 200);
    }
}
