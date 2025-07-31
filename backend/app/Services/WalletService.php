<?php

namespace App\Services;


use Illuminate\Support\Facades\Mail;
use App\Models\WalletTransaction;
use Illuminate\Support\Str;
use App\Mail\OtpMail;
use App\Models\User;
use App\Models\Otp;
use Carbon\Carbon;


class WalletService
{

    public function create(array $data): WalletTransaction
    {
        return WalletTransaction::create($data);
    }

    public function getUserWalletTransactions(User $user)
    {
        return $user->walletTransactions()->latest()->get();
    }

    public function getWalletTransactionById(int $id): ?WalletTransaction
    {
        return WalletTransaction::find($id);
    }

    public function updateWalletTransaction(WalletTransaction $transaction, array $data): WalletTransaction
    {
        $transaction->update($data);
        return $transaction;
    }

    public function deleteWalletTransaction(WalletTransaction $transaction): bool
    {
        return $transaction->delete();
    }
}
