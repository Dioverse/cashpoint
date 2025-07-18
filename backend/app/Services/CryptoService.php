<?php
namespace App\Services;


use Illuminate\Support\Facades\Log;
use App\Models\CryptoHistory;
use App\Models\WalletAddress;
use Illuminate\Support\Str;
use Carbon\Carbon;

class CryptoService
{
    public function processSell($user, $data)
    {
        $rate = $this->getRate($data['coin']);
        $nairaEquivalent = $data['amount'] * $rate;

        $trade = CryptoHistory::create([
            'user_id' => $user->id,
            'coin' => $data['coin'],
            'usd_amount' => $data['amount'],
            'naira_equivalent' => $nairaEquivalent,
            'status' => 'pending',
        ]);

        return response()->json(['success' => true, 'message' => 'Trade submitted.', 'data' => $trade]);
    }

    public function createWalletAddress($user, $data)
    {
        $rate = $this->getRate($data['coin']);
        $usdValue = $data['amount_ngn'] / $rate;

        $wallet = WalletAddress::create([
            'user_id' => $user->id,
            'coin' => $data['coin'],
            'address' => 'wallet_' . Str::random(16), // Simulated
            'expires_at' => Carbon::now()->addMinutes(15),
        ]);

        return response()->json([
            'success' => true,
            'usd_equivalent' => $usdValue,
            'wallet' => $wallet,
        ]);
    }

    public function confirmCryptoPayment($data)
    {
        // Pseudo-confirmation logic
        $wallet = WalletAddress::where('address', $data['wallet_address'])->first();
        if (! $wallet) {
            return response()->json(['success' => false, 'message' => 'Invalid wallet address'], 404);
        }

        // Here you'd integrate with NowNodes or similar to confirm tx_hash
        // For now, we'll simulate success

        return response()->json(['success' => true, 'message' => 'Transaction confirmed']);
    }

    public function getCryptoRates()
    {
        return response()->json([
            'USDT' => 1000,
            'BTC' => 62000000,
            'BNB' => 430000,
        ]);
    }

    protected function getRate($coin)
    {
        $rates = [
            'USDT' => 1000,
            'BTC' => 62000000,
            'BNB' => 430000,
        ];

        return $rates[$coin] ?? 1000;
    }
}
