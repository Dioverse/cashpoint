<?php
namespace App\Services;

use App\Helpers\NotificationHelper;
use App\Models\Crypto;
use Illuminate\Support\Facades\Log;
use App\Models\CryptoHistory;
use App\Models\Giftcard;
use App\Models\WalletAddress;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class CryptoService
{
    public function processSell($user, $data)
    {
        DB::beginTransaction();
        $crypto = Crypto::findOrFail($data['crypto_id']);
        $rate = app(SettingService::class)->getExchangeRate();
        $usd = $data['amount_crypto'] * $this->getRate($crypto->symbol);
        $naira = $usd * $rate;

        $trade = CryptoHistory::create([
            'user_id'           => $user->id,
            'crypto_id'         => $data['crypto_id'],
            'type'              => 'sell',
            'amount'            => $usd,
            'amount_crypto'     => $data['amount_crypto'],
            'naira_equivalent'  => $naira,
            'status'            => 'pending',
        ]);

        $tradeType = ($data['crypto_id'] == '1') ? 'BTC' : 'USDT';

        // Notify Admin for manual approval or webhook-based NowNode checking can be added
        NotificationHelper::notifyAdmin(
            'New Crypto Trade',
            'User ' . $user->username . ' initiated a ' . $tradeType . ' trade.',
            ['trade_id' => $trade->id]
        );

        NotificationHelper::notifyUser(
            $user->id,
            'Your '. $tradeType .' Trade is Processing',
            'We have received your '. $tradeType .' trade and are processing it.',
            $trade->id
            // ['trade_id' => $trade->id]
        );

        DB::commit();
        return response([
            'message'   => __('app.crypto_trade_submitted'),
            'status'    => true,
            'results'   => [
                'data'  => $trade
            ]
        ]);
        // $rate = $this->getRate($data['coin']);
        // $nairaEquivalent = $data['amount'] * $rate;

        // $trade = CryptoHistory::create([
        //     'user_id' => $user->id,
        //     'coin' => $data['coin'],
        //     'usd_amount' => $data['amount'],
        //     'naira_equivalent' => $nairaEquivalent,
        //     'status' => 'pending',
        // ]);

        // return response()->json(['success' => true, 'message' => 'Trade submitted.', 'data' => $trade]);
    }

    public function processBuy($user, $data) {
        DB::beginTransaction();

        $crypto = Crypto::findOrFail($data['crypto_id']);
        $rate   = app(SettingService::class)->getExchangeRate(); // USD to NGN

        // Naira value
        $naira = $data['amount_usd'] * $rate;

        // Simulate conversion rate
        $amountCrypto = $data['amount_usd'] / $this->getRate($crypto->symbol);

        $trade = CryptoHistory::create([
            'user_id'           => $user->id,
            'crypto_id'         => $data['crypto_id'],
            'type'              => 'buy',
            'amount'            => $data['amount_usd'],
            'amount_crypto'     => $amountCrypto,
            'naira_equivalent'  => $naira,
            'wallet_address'    => $data['wallet_address'],
            'status'            => 'pending',
        ]);

        // Trigger sending from NowNode using your client API key (See NowNodeService below)
        $hash = app(NowNodeService::class)->sendToWallet($crypto, $data['wallet_address'], $amountCrypto);

        NotificationHelper::notifyAdmin(
            'New Crypto Trade',
            'User ' . $user->username . ' initiated a ' . $crypto->name . ' trade.',
            ['trade_id' => $trade->id]
        );

        NotificationHelper::notifyUser(
            $user->id,
            'Your '. $crypto->name .' Trade is Processing',
            'We have received your '. $crypto->name .' trade and are processing it.',
            $trade->id
            // ['trade_id' => $trade->id]
        );

        $trade->update([
            'transaction_hash' => $hash,
            'status' => 'completed',
        ]);
        DB::commit();

        return response()->json(['message' => __('app.crypto_sent'), 'trade' => $trade]);
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
            'message'   => __('app.wallet_address_created'),
            'success'   => true,
            'results'   => [
                'usd_equivalent'  => $usdValue,
                'wallet' => $wallet,
            ]
        ]);
    }

    public function confirmCryptoPayment($data)
    {
        // Pseudo-confirmation logic
        $wallet = WalletAddress::where('address', $data['wallet_address'])->first();
        if (! $wallet) {
            return response([
                'success' => false,
                'message' => __('app.invalid_wallet_address')
            ], 404);
        }

        // Here you'd integrate with NowNodes or similar to confirm tx_hash
        // For now, we'll simulate success
        $txHash = $data['tx_hash'];
        $coin   = strtolower($wallet->coin);
        $chain  = strtolower($wallet->chain ?? 'btn');

        $nownodeEndpoints = [
            'btc' => 'btc',
            'trc20' => 'trx'
        ];

        $endpoint   = $nownodeEndpoints[$chain] ?? 'btc';
        $url        = "https://{$endpoint}.nownodes.io/api/v1/tx/{$txHash}";

        $response   = Http::withHeaders([
            'api-key' => config('services.nownode.api_key'),
        ])->get($url);

        if ($response->failed()) {
            return response([
                'success' => false,
                'message' => __('app.unable_to_verify_transaction')
            ], 500);
        }

        $txData     = $response->json();
        $confirmed  = $txData['confirmations'] > 0;

        if (! $confirmed) {
            return response([
                'success' => false,
                'message' => __('app.transaction_not_confirmed_yet')
            ], 202); // Accepted, but not confirmed yet
        }

        return response([
            'success' => true,
            'message' => __('app.transaction_confirmed'),
            'results' => [
                'data' => $txData
            ]
        ]);
    }


    private function getRate($symbol)
    {
        return getCryptoRate($symbol);
    }

    public function getUserCryptoHistories($user)
    {
        return CryptoHistory::where('user_id', $user->id)->get();
    }
    public function getCryptoById($id)
    {
        return CryptoHistory::findOrFail($id);
    }


    // private function getRate($symbol)
    // {
    //     $crypto = Crypto::where('symbol', strtoupper($symbol))->first();

    //     return $crypto?->usd_rate ?? 5000;
    // }


    // private function getRate($symbol)
    // {
    //     return match(strtoupper($symbol)) {
    //         'BTC' => 60000,
    //         'ETH' => 3500,
    //         'USDT' => 1,
    //         default => 5000,
    //     };
    // }

    private $chainMap = [
        'BTC' => 'btc',
        'USDT' => 'trx', // or 'eth' if using ERC20
    ];



}
