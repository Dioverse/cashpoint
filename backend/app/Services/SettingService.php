<?php

namespace App\Services;


use Illuminate\Support\Facades\Mail;
use App\Models\WalletTransaction;
use Illuminate\Support\Str;
use App\Mail\OtpMail;
use App\Models\User;
use App\Models\Otp;
use App\Models\Setting;
use Carbon\Carbon;
use PHPUnit\Runner\DeprecationCollector\Collector;

class SettingService
{

    public function all()
    {
        return Setting::all();
    }

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

    public function updateExchangeRate(float $rate): bool
    {
        // Assuming you have a Setting model to store exchange rates
        $setting = Setting::setValue('exchange_rate', $rate);
        return $setting;
    }

    public function getExchangeRate(): float
    {
        // Assuming you have a Setting model to retrieve exchange rates
        $setting = Setting::getValue('exchange_rate');
        return (float) $setting;
    }

    public function find(int $id): ?Setting
    {
        return Setting::find($id);
        // Setting::findOrFail($id);
    }

    public function delete(Setting $setting): bool
    {
        return $setting->delete();
    }
}
