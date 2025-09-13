<?php

namespace App\Services;

use App\Models\PayoutAccount;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class PayoutService
{
    public function get()
    {
        return PayoutAccount::all();
    }

    public function getPayout($id): PayoutAccount
    {
        return PayoutAccount::whereId($id)->firstOrFail();
    }

    public function getUserPayouts()
    {
        return PayoutAccount::where("user_id", auth()->user()->id)->get();
    }

    public function checkPayout($check)
    {
        return PayoutAccount::where("user_id", auth()->user()->id)->where("account_number", $check)->first();
    }

    public function createAccount(User $user, array $data): PayoutAccount
    {

        return $user->payoutAccount()->create($data);
    }

    public function updateAccount(array $data, $id)
    {
        return PayoutAccount::whereId($id)->update($data);
    }

    public function deleteAccount(PayoutAccount $account, User $user): bool
    {
        if ($account->user_id !== $user->id) {
            return false; // Unauthorized
        }

        return $account->delete();
    }

    public function lockFunds(User $user, float $amount, ?string $date): array
    {
        if ($user->wallet_naira < $amount) {
            return ['success' => false, 'message' => 'Insufficient balance'];
        }

        $user->wallet_naira   -= $amount;
        $user->locked_balance += $amount;
        $user->locked_date     = $date ? \Carbon\Carbon::parse($date) : null;
        $user->save();

        return ['success' => true, 'message' => 'Funds locked', 'user' => $user];
    }

    public function releaseFunds(User $user, float $amount): array
    {
        if ($user->locked_balance < $amount) {
            return ['success' => false, 'message' => 'Not enough locked funds', 'locked balance' => $user->locked_balance];
        }

        if ($user->locked_date && \Carbon\Carbon::now()->lt(\Carbon\Carbon::parse($user->locked_date))) {
            return ['success' => false, 'message' => 'Funds are still locked until ' . $user->locked_date];
        }

        $user->locked_balance -= $amount;
        $user->wallet_naira   += $amount;
        $user->save();

        return ['success' => true, 'message' => 'Funds released', 'user' => $user];
    }

    public function withdrawLocked(User $user, float $amount): array
    {
        if ($user->locked_balance < $amount) {
            return ['success' => false, 'message' => 'Not enough locked funds'];
        }

        $user->locked_balance -= $amount;
        $user->save();

        // TODO: trigger payout through bank API here

        return ['success' => true, 'message' => 'Withdrawal initiated', 'user' => $user];
    }

    // Paysatck Integration Methods ........................................

    // Get list of banks from paystack
    public function getBankList(): array
    {
        // consume paystack API to get bank list
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.paystack.secret_key'),
        ])->get('https://api.paystack.co/bank');

        if ($response->successful()) {
            return $response->json()['data'];
        }

        return [];
    }

    // Validate account number and bank code
    public function validateAccount(string $accountNumber, string $bankCode): array
    {
        // consume paystack API to validate account
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.paystack.secret_key'),
        ])->get('https://api.paystack.co/bank/resolve', [
            'account_number' => $accountNumber,
            'bank_code'     => $bankCode,
        ]);

        if ($response->successful()) {
            return ['success' => true, 'data' => $response->json()['data']];
        }

        return ['success' => false, 'message' => $response->json()['message'] ?? 'Validation failed'];
    }

    // Create a recipient on paystack
    public function createPaystackRecipient(array $data): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.paystack.secret_key'),
        ])->post('https://api.paystack.co/transferrecipient', $data);

        if ($response->successful()) {
            return ['success' => true, 'data' => $response->json()['data']];
        }
        return ['success' => false, 'message' => $response->json()['message'] ?? 'Recipient creation failed'];
    }

    // list recipients on paystack
    public function listRecipients()
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.paystack.secret_key'),
            'Accept' => 'application/json'
        ])->get('https://api.paystack.co/transferrecipient');

        return response()->json($response->json());
    }

    // Initiate transfer on paystack
    public function initiateTransfer(array $data): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.paystack.secret_key'),
            'Accept' => 'application/json'
        ])->post('https://api.paystack.co/transfer', $data);

        if ($response->successful()) {
            return ['success' => true, 'data' => $response->json()['data']];
        }

        return ['success' => false, 'message' => $response->json()['message'] ?? 'Transfer initiation failed'];
    }

    // Finalize transfer on paystack
    public function finalizeTransfer(string $otp, string $transferCode): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.paystack.secret_key'),
            'Accept' => 'application/json'
        ])->post('https://api.paystack.co/transfer/finalize', [
            'otp' => $otp,
            'transfer_code' => $transferCode
        ]);

        if ($response->successful()) {
            return ['success' => true, 'data' => $response->json()['data']];
        }

        return ['success' => false, 'message' => $response->json()['message'] ?? 'Transfer finalization failed'];
    }

    // Delete recipient on paystack
    public function deletePaystackRecipient(string $recipientCode): bool
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.paystack.secret_key'),
            'Accept' => 'application/json'
        ])->delete('https://api.paystack.co/transferrecipient/' . $recipientCode);

        return $response->successful();
    }

    // Create customer on paystack
    public function createPaystackCustomer(array $data): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.paystack.secret_key'),
            'Accept' => 'application/json'
        ])->post('https://api.paystack.co/customer', $data);

        if ($response->successful()) {
            return ['success' => true, 'data' => $response->json()['data']];
        }
        return ['success' => false, 'message' => $response->json()['message'] ?? 'Customer creation failed'];
    }

    // Create virtual account on paystack through customer
    public function createVirtualAccountForCustomer(array $data): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.paystack.secret_key'),
            'Accept' => 'application/json'
        ])->post('https://api.paystack.co/dedicated_account', $data);

        if ($response->successful()) {
            return ['success' => true, 'data' => $response->json()['data']];
        }
        return ['success' => false, 'message' => $response->json()['message'] ?? 'Virtual account creation failed'];
    }

    // Create virtual account on paystack
    public function createVirtualAccount(array $data): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.paystack.secret_key'),
            'Accept' => 'application/json'
        ])->post('https://api.paystack.co/dedicated_account', $data);

        if ($response->successful()) {
            return ['success' => true, 'data' => $response->json()['data']];
        }
        return ['success' => false, 'message' => $response->json()['message'] ?? 'Virtual account creation failed'];
    }

}
