<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Services\CryptoWalletService;
use Illuminate\Http\Response;
use App\Models\WalletAddress;
use App\Models\CryptoHistory;
use Illuminate\Http\Request;
use App\Models\Crypto;



class CryptoWalletController extends Controller
{
    //
    //
    public function createWallet(Request $request)
    : Response
    {
        $request->validate([
            'coin' => 'required|string',
        ]);

        try {
            DB::beginTransaction();
            $coin = strtoupper($request->coin);
            $service = new CryptoWalletService($coin);
            $addressData = $service->createAddress();
            
            // return response()->json($addressData);
            $wallet = WalletAddress::updateOrCreate(
                ['user_id' => auth()->user()->id, 'coin' => $coin, 'expires_at' => now()->addDays(30)],
                ['address' => $addressData['data']['address'], 'balance' => 0]
            );

            DB::commit();
            return response([
                'message'   => __('app.crypto_trade_submitted'),
                'status'    => true,
                'results'   => [
                    'data'  => $walle
                ]
            ]);

        } catch (\Exception $e) {
            return response(['error' => 'Failed to create wallet: ' . $e->getMessage()], 500);
        }
    
    }

    public function deposit(Request $request)
    : Response
    {
        $coin = strtoupper($request->coin ?? 'BTC');
        $wallet = WalletAddress::where('user_id', auth()->user()->id)->where('coin', $coin)->first();

        if (! $wallet) {
            return response()->json(['error' => 'Wallet not found'], 404);
        }

        return response([
            'message'   => "Send $coin to this address",
            'status'    => true,
            'results'   => [
                'address'  => $wallet->address
            ]
        ]);
    }

    public function withdraw(Request $request)
    // : Response
    {
        $request->validate([
            'coin'       => 'required|string',
            'to_address' => 'required|string',
            'amount'     => 'required|numeric|min:0.0001',
        ]);
        try {
            DB::beginTransaction();
            $coin   = strtoupper($request->coin);
            $userId = auth()->user()->id;
            $wallet = WalletAddress::where('user_id', $userId)->where('coin', $coin)->first();
            $crypto = Crypto::where('symbol', $coin)->first();

            if (! $wallet || $wallet->balance < $request->amount) {
                return response()->json(['error' => 'Insufficient balance or wallet not found'], 400);
            }

            $service = new CryptoWalletService($coin);
            $result = $service->send($request->to_address, $request->amount);

            CryptoHistory::create([
                'user_id'           => $userId,
                'crypto_id'         => $crypto->id ?? null,
                'type'              => 'withdraw',
                'currency'          => $coin,
                'api_response'      => json_encode($result),
                'amount'            => $request->amount,
                'amount_crypto'     => $request->amount,
                'naira_equivalent'  => 0,
                'transaction_hash'  => $result['id'] ?? null,
                'status'            => $result['flag'] ?? 'pending',
            ]);

            DB::commit();
            return response([
                'message'   => "Send $coin to this address",
                'status'    => true,
                'results'   => [
                    'data'  => $result
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response([
                'success' => false,
                'message' => 'Withdrawal failed:',
                'error'   => $e->getMessage()
            ], 500);
        }
        
    }

    public function transactions()
    : Response
    {
        $wallets = WalletAddress::with('transactions')->where('user_id', auth()->user()->id)->get();
        return response()->json($wallets);
    }

    public function handleCallback(Request $request)
    : Response
    {
        $tx = CryptoHistory::where('transaction_hash', $request->txid)->first();

        if ($request->status === 'confirmed' && $tx) {
            $tx->update(['status' => 'confirmed']);
            $tx->wallet->increment('balance', $tx->amount);
        }

        return response()->json(['success' => true]);
    }
}
