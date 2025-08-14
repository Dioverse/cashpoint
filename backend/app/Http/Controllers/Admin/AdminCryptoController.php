<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\cryptoResource;
use App\Services\cryptoService;
use Illuminate\Http\Request;

class AdminCryptoController extends Controller
{
    //
    protected $cryptoService;

    public function __construct()
    {
        $this->cryptoService = new cryptoService;
    }
    public function index()
    {
        $query = $this->cryptoService->cryptos();

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'Data'  => $query,
            ],
        ], 201);
    }


    public function read($id)
    {
        $crypto = $this->cryptoService->findCrypto($id);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'crypto'  => new cryptoResource($crypto),
            ],
        ], 201);
    }

    public function store(Request $request)
    {
        $crypto = $request->validate([
            'name'          => 'required|string|unique:cryptos,name',
            'symbol'        => 'required|string',
            'usd_rate'      => 'required|numeric',
            'logo'          => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'chain'         => 'required|string',
            'nownode_ticker'=> 'required|string',
        ]);

        $pricing = $this->cryptoService->createcrypto([
            'name'          => $crypto['name'],
            'symbol'        => $crypto['symbol'],
            'usd_rate'      => $crypto['usd_rate'],
            'logo'          => $crypto['logo']->store('crypto_logos', 'public'),
            'chain'         => $crypto['chain'],
            'nownode_ticker'=> $crypto['nownode_ticker'],
        ]);

        return response([
            'message'   => __('app.record_created'),
            'status'    => true,
            'results'   => [
                'crypto'  => new cryptoResource($pricing),
            ],
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $pricing = $this->cryptoService->findCrypto($id);

        $crypto = $request->validate([
            'name'          => 'required|string|unique:cryptos,name',
            'symbol'        => 'required|string',
            'usd_rate'      => 'required|numeric',
            'logo'          => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'chain'         => 'required|string',
            'nownode_ticker'=> 'required|string',
        ]);

        $pricing->update([
            'name'          => $crypto['name'],
            'symbol'        => $crypto['symbol'],
            'usd_rate'      => $crypto['usd_rate'],
            'logo'          => $crypto['logo']->store('crypto_logos', 'public'),
            'chain'         => $crypto['chain'],
            'nownode_ticker'=> $crypto['nownode_ticker'],
        ]);

        return response([
            'message'   => __('app.record_updated'),
            'status'    => true,
            'results'   => [
                'crypto'  => new cryptoResource($pricing),
            ],
        ], 201);
    }

    public function toggleStatus($id)
    {
        $crypto = $this->cryptoService->findCrypto($id);

        if ($crypto) {
            $crypto->is_active = !$crypto->is_active;
            $crypto->save();

            return response([
                'message'   => __('app.record_updated'),
                'status'    => true,
                'results'   => [
                    'crypto'  => new cryptoResource($crypto),
                ],
            ], 201);
        }

        return response([
            'message'   => __('app.data_retrieved_failed'),
            'status'    => true,
        ], 201);

    }

    public function destroy($id)
    {
        $crypto = $this->cryptoService->findCrypto($id);

        if ($crypto) {
            $crypto->delete();
            return response([
                'message'   => __('app.record_deleted'),
                'status'    => true,
            ], 201);
        }

        return response([
                'message'   => __('app.data_retrieved_failed'),
                'status'    => true,
            ], 201);

    }
}
