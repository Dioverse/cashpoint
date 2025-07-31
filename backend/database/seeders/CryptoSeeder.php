<?php

namespace Database\Seeders;

use App\Models\Crypto;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class CryptoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $cryptos = [
            [
                'name' => 'Bitcoin',
                'symbol' => 'BTC',
                'chain' => 'Bitcoin',
                'nownode_ticker' => 'btc',
                'coingecko_id' => 'bitcoin',
                'logo' => 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
            ],
            [
                'name' => 'Tether',
                'symbol' => 'USDT',
                'chain' => 'TRON',
                'nownode_ticker' => 'trx/usdttrc20',
                'coingecko_id' => 'tether',
                'logo' => 'https://assets.coingecko.com/coins/images/325/large/Tether.png'
            ]
        ];

        foreach ($cryptos as $cryptoData) {
            // Fetch USD rate from CoinGecko
            $rateResponse = Http::get("https://api.coingecko.com/api/v3/simple/price", [
                'ids' => $cryptoData['coingecko_id'],
                'vs_currencies' => 'usd',
            ]);
            $usdRate = $rateResponse->json()[$cryptoData['coingecko_id']]['usd'] ?? null;

            Crypto::updateOrCreate(
                ['symbol' => $cryptoData['symbol']],
                [
                    'name' => $cryptoData['name'],
                    'chain' => $cryptoData['chain'],
                    'nownode_ticker' => $cryptoData['nownode_ticker'],
                    'usd_rate' => $usdRate,
                    'logo' => $cryptoData['logo'],
                ]
            );
        }

    }
}
