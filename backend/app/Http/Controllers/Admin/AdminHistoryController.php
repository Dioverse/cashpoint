<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\cryptoResource;
use App\Services\AirtimeService;
use App\Services\CableBillService;
use App\Services\cryptoService;
use App\Services\DataService;
use App\Services\GiftcardService;
use App\Services\WalletService;
use Illuminate\Http\Request;

class AdminHistoryController extends Controller
{
    //
    protected $airtimeService;
    protected $billService;
    protected $cableService;
    protected $cryptoService;
    protected $dataService;
    protected $giftcardService;
    protected $paymentService;

    public function __construct()
    {
        $this->airtimeService   = new AirtimeService;
        $this->billService      = new CableBillService;
        $this->cableService     = new CableBillService;
        $this->cryptoService    = new CryptoService;
        $this->dataService      = new DataService;
        $this->giftcardService  = new GiftcardService;
        $this->paymentService  = new WalletService;
    }

    // Airtime History ++++++++++++++++++++++++++++++++++++++++++++++++++++
    public function airtimeHistory()
    {
        $query = $this->airtimeService->allAirtimeHistory();

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'Data'  => $query,
            ],
        ], 201);
    }

    public function airtimeHistoryDetail($id)
    {
        $airtime = $this->airtimeService->readAirtimeHistory($id);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'history'  => $airtime,
            ],
        ], 201);
    }

    // Bill History +++++++++++++++++++++++++++++++++++++++++++++++++++++++
    public function billHistory()
    {
        $query = $this->billService->allBillHistory();

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'Data'  => $query,
            ],
        ], 201);
    }

    public function billHistoryDetail($id)
    {
        $bill = $this->billService->readBilllHistory($id);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'history'  => $bill,
            ],
        ], 201);
    }

    // Cable History ++++++++++++++++++++++++++++++++++++++++++++++++++++++
    public function cableHistory()
    {
        $query = $this->cableService->allCableHistory();

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'Data'  => $query,
            ],
        ], 201);
    }

    public function cableHistoryDetail($id)
    {
        $cable = $this->cableService->readCableHistory($id);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'history'  => $cable,
            ],
        ], 201);
    }

    // Crypto History +++++++++++++++++++++++++++++++++++++++++++++++++++++
    public function cryptoHistory()
    {
        $query = $this->cryptoService->allCryptoHistory();

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'Data'  => cryptoResource::collection($query),
            ],
        ], 201);
    }

    public function cryptoHistoryDetail($id)
    {
        $crypto = $this->cryptoService->getCryptoById($id);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'history'  => new cryptoResource($crypto),
            ],
        ], 201);
    }

    // Giftcard History ++++++++++++++++++++++++++++++++++++++++++++++++++
    public function giftcardHistory()
    {
        $query = $this->giftcardService->allGiftcardHistory();

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'Data'  => $query,
            ],
        ], 201);
    }

    public function giftcardHistoryDetail($id)
    {
        $giftcard = $this->giftcardService->findGiftcardHistory($id);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'history'  => $giftcard,
            ],
        ], 201);
    }

    // Data History ++++++++++++++++++++++++++++++++++++++++++++++++++++++
    public function dataHistory()
    {
        $query = $this->dataService->allDataHistory();

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'Data'  => $query,
            ],
        ], 201);
    }

    public function dataHistoryDetail($id)
    {
        $data = $this->dataService->readDataHistory($id);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'history'  => $data,
            ],
        ], 201);
    }

    // Fund History ++++++++++++++++++++++++++++++++++++++++++++++++++++++
    public function fundHistory()
    {
        $query = $this->paymentService->allWalletTransactions();

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'Data'  => $query,
            ],
        ], 201);
    }

    public function fundHistoryDetail($id)
    {
        $data = $this->paymentService->getWalletTransactionById($id);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'history'  => $data,
            ],
        ], 201);
    }


}
