<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AirtimePricingResources;
use App\Services\AirtimeService;
use Illuminate\Http\Request;

class AirtimePricingController extends Controller
{
    //
    protected $AirtimeService;

    public function __construct()
    {
        $this->AirtimeService = new AirtimeService;
    }
    public function index()
    {
        $query = $this->AirtimeService->getAirtimePercentages();

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
        $Airtime = $this->AirtimeService->findPrice($id);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'Airtime'  => new AirtimePricingResources($Airtime),
            ],
        ], 201);
    }

    public function store(Request $request)
    {
        $Airtime = $request->validate([
            'network_id'        => 'required|string|exists:networks,id',
            'buy_price'         => 'required|numeric',
            'percentage'        => 'required|numeric'
        ]);

        $pricing = $this->AirtimeService->createPercentage($Airtime);

        return response([
            'message'   => __('app.record_created'),
            'status'    => true,
            'results'   => [
                'Airtime'  => new AirtimePricingResources($pricing),
            ],
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $pricing = $this->AirtimeService->findPrice($id);

        $Airtime = $request->validate([
            'network_id'        => 'required|string|exists:networks,id',
            'buy_price'         => 'required|numeric',
            'percentage'        => 'required|numeric'
        ]);

        $pricing->update($Airtime);

        return response([
            'message'   => __('app.record_updated'),
            'status'    => true,
            'results'   => [
                'Airtime'  => new AirtimePricingResources($pricing),
            ],
        ], 201);
    }

    public function toggleStatus($id)
    {
        $Airtime = $this->AirtimeService->findPrice($id);
        $Airtime->is_active = !$Airtime->is_active;
        $Airtime->save();

        return response([
            'message'   => __('app.record_updated'),
            'status'    => true,
            'results'   => [
                'Airtime'  => new AirtimePricingResources($Airtime),
            ],
        ], 201);
    }

    public function destroy($id)
    {
        $Airtime = $this->AirtimeService->findPrice($id);

        if ($Airtime) {
            $Airtime->delete();
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
