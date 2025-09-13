<?php

namespace App\Services;

use App\Models\PayoutAccount;
use App\Models\User;

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
        return PayoutAccount::where("user_id", auth()->user()->id)->where("bank_name", $check)->first();
    }

    public function createAccount(User $user, array $data): PayoutAccount
    {

        return $user->payoutAccount()->create($data);
    }

    public function updateAccount(array $data, $id)
    {
        return PayoutAccount::whereId($id)->update($data);
    }

    public function deleteAccount(PayoutAccount $account): bool
    {
        return $account->delete();
    }

    public function lockFunds(User $user, float $amount): array
    {
        if ($user->wallet_naira < $amount) {
            return ['success' => false, 'message' => 'Insufficient balance'];
        }

        $user->wallet_naira   -= $amount;
        $user->locked_balance += $amount;
        $user->save();

        return ['success' => true, 'message' => 'Funds locked', 'user' => $user];
    }

    public function releaseFunds(User $user, float $amount): array
    {
        if ($user->locked_balance < $amount) {
            return ['success' => false, 'message' => 'Not enough locked funds'];
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
}
