<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use App\Services\CryptoApiService;
use App\Models\CryptoHistory;
use App\Models\WalletAddress;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CryptoServiceController extends Controller
{
    //
    protected $crypto;

    public function __construct()
    {
        $this->crypto = new CryptoApiService();
    }

    // Get exchange rate
    public function rate($from, $to)
    {
        return response($this->crypto->getExchangeRate($from, $to));
    }

    // Deposit crypto assets
    public function getDepositAddress(Request $request)
    {
        try {
            $request->validate([
                'blockchain' => 'required|string|in:bitcoin,ethereum',
                // 'network'    => 'required|string|in:mainnet,testnet',
            ]);

            // return response([
            //     'date' => Carbon::now()->timestamp
            // ]);

            $item = $this->crypto->generateDepositAddress(
                $request->blockchain,
                'User Deposit for ' . $request->blockchain
            );

            return response([
                'address' => $item['address'],
                'created_at' => $item['createdTimestamp'],
                'label' => $item['label'],
            ]);

            // Handle success or error
        } catch (\Exception $e) {
            return response(['error' => $e->getMessage()], 400);
        }
    }

    // Transfer/ sell crypto asset
    public function sellCrypto(Request $request)
    {
        try {
            $request->validate([
                // 'vaultId'    => 'required|string',
                'blockchain' => 'required|string|in:bitcoin,ethereum',
                'amount'     => 'required|numeric|min:0.0001',
                'toAddress'  => 'required|string',
                'userUsdRate'=> 'required|numeric',
            ]);

            $txItem = [
                // 'vaultId'          => $request->vaultId,
                'blockchain'       => $request->blockchain,
                'amount'           => $request->amount,
                'toAddress'        => $request->toAddress,
            ];

            $item = $this->crypto->createFungibleTransaction(
                // $request->vaultId,
                $request->blockchain,
                $txItem
            );

            $usd = $request->amount * $request->userUsdRate;
            WalletAddress::credit($request->user()->id, 'USD', $usd);

            return CryptoHistory::create([
                'user_id'   => $request->user()->id,
                'type'      => 'sell',
                'currency'  => strtoupper($request->blockchain),
                'amount'    => $request->amount,
                'status'    => 'completed',
                'provider_response' => $item,
            ]);

        } catch (\Exception $e) {
            return response(['error' => $e->getMessage()], 400);
        }
    }

    // Buy crypto
    public function buy(Request $request)
    {
        $request->validate([
            'from'      => 'required|string', // e.g. USD
            'to'        => 'required|string',   // e.g. BTC
            'amount'    => 'required|numeric',
        ]);

        $trade = $this->crypto->createExchangeTransaction(
            $request->from,
            $request->to,
            $request->amount
        );

        // TODO: Credit user wallet_usd instantly in DB
        // Wallet::where('user_id', auth()->id())->increment('balance_usd', $request->amount);

        return response([
            'message' => 'Buy transaction completed successfully',
            'data' => $trade
        ]);
    }

    // Sell crypto
    public function sell(Request $request)
    {
        $request->validate([
            'from'  => 'required|string', // e.g. BTC
            'to'    => 'required|string',   // e.g. USD
            'amount'=> 'required|numeric',
        ]);

        $trade = $this->crypto->createExchangeTransaction(
            $request->from,
            $request->to,
            $request->amount
        );

        // TODO: Credit user wallet_usd instantly in DB
        // Wallet::where('user_id', auth()->id())->increment('balance_usd', $trade['data']['amountConverted']);

        return response([
            'message' => 'Sell transaction completed successfully',
            'data' => $trade
        ]);
    }
}
