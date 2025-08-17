<?php

namespace App\Http\Controllers;

use App\Helpers\NotificationHelper;
use App\Models\CryptoHistory;
use Illuminate\Support\Facades\DB;
use App\Services\CoinbaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CoinbaseController extends Controller
{
    //
    protected $coinbase;

    public function __construct()
    {
        $this->coinbase = new CoinbaseService();
    }

    public function buyBTC(Request $request)
    {
        DB::beginTransaction();
        $request->validate([
            'amount_usd' => 'required|numeric|min:1',
        ]);

        $response = $this->coinbase->buyBTC($request->amount_usd);
        NotificationHelper::notifyUser(
            Auth::id(),
            'Your Buy Trade is Processing',
            'We have received your Buy trade and are processing it.',
            $response->json('id')
        );

        $trade = CryptoHistory::create([
            'user_id'       => Auth::id(),
            'type'          => 'buy',
            'currency'      => 'BTC',
            'amount'        => $request->amount_usd,
            'status'        => $response->successful() ? 'completed' : 'failed',
            'api_response'  => $response->json(),
        ]);

        DB::commit();
        return response([
            'message'   => __('app.crypto_trade_submitted'),
            'status'    => true,
            'results'   => [
                'data'  => $trade
            ]
        ]);
    }

    public function sellBTC(Request $request)
    {
        $request->validate([
            'amount_btc' => 'required|numeric|min:0.0001',
        ]);

        $response = $this->coinbase->sellBTCtoUSDT($request->amount_btc);

        return CryptoHistory::create([
            'user_id'           => Auth::id(),
            'type'              => 'sell',
            'currency'          => 'BTC',
            'amount'            => $request->amount_btc,
            'status'            => $response->successful() ? 'completed' : 'failed',
            'coinbase_response' => $response->json(),
        ]);
    }
}
