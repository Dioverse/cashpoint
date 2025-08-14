<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BillPricingResources;
use App\Services\BillService;
use Illuminate\Http\Request;

class BillPricingController extends Controller
{
    //
    protected $BillService;

    public function __construct()
    {
        $this->BillService = new BillService;
    }
    public function index()
    {
        $query = $this->BillService->getBillPercentages();

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
        $Bill = $this->BillService->findPrice($id);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'Bill'  => new BillPricingResources($Bill),
            ],
        ], 201);
    }

    public function store(Request $request)
    {
        $Bill = $request->validate([
            'network_id'        => 'required|string|exists:networks,id',
            'buy_price'         => 'required|numeric',
            'percentage'        => 'required|numeric'
        ]);

        $pricing = $this->BillService->createPercentage($Bill);

        return response([
            'message'   => __('app.record_created'),
            'status'    => true,
            'results'   => [
                'Bill'  => new BillPricingResources($pricing),
            ],
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $pricing = $this->BillService->findPrice($id);

        $Bill = $request->validate([
            'network_id'        => 'required|string|exists:networks,id',
            'buy_price'         => 'required|numeric',
            'percentage'        => 'required|numeric'
        ]);

        $pricing->update($Bill);

        return response([
            'message'   => __('app.record_updated'),
            'status'    => true,
            'results'   => [
                'Bill'  => new BillPricingResources($pricing),
            ],
        ], 201);
    }

    public function toggleStatus($id)
    {
        $Bill = $this->BillService->findPrice($id);
        $Bill->is_active = !$Bill->is_active;
        $Bill->save();

        return response([
            'message'   => __('app.record_updated'),
            'status'    => true,
            'results'   => [
                'Bill'  => new BillPricingResources($Bill),
            ],
        ], 201);
    }

    public function destroy($id)
    {
        $Bill = $this->BillService->findPrice($id);

        if ($Bill) {
            $Bill->delete();
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
