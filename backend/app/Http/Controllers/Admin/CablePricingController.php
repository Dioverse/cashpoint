<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CablePricingResources;
use App\Services\CableBillService;
use Illuminate\Http\Request;

class CablePricingController extends Controller
{
    //
    protected $CableService;

    public function __construct()
    {
        $this->CableService = new CableBillService;
    }
    public function index()
    {
        $query = $this->CableService->cablePlans();

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
        $Cable = $this->CableService->getCablePlan($id);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'Cable'  => new CablePricingResources($Cable),
            ],
        ], 201);
    }

    public function store(Request $request)
    {
        $Cable = $request->validate([
            'cable_id'  => 'required|string|exists:cables,id',
            'name'      => 'required|string',
            'code'      => 'required|string|unique:cable_plans,code',
            'buy_price' => 'required|numeric',
            'amount'    => 'required|numeric',
        ]);

        $pricing = $this->CableService->createCablePlan($Cable);

        return response([
            'message'   => __('app.record_created'),
            'status'    => true,
            'results'   => [
                'Cable'  => new CablePricingResources($pricing),
            ],
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $pricing = $this->CableService->getCablePlan($id);

        $Cable = $request->validate([
            'cable_id'  => 'required|string|exists:cables,id',
            'name'      => 'required|string',
            'code'      => 'required|string|unique:cable_plans,code',
            'buy_price' => 'required|numeric',
            'amount'    => 'required|numeric',
        ]);

        $pricing->update($Cable);

        return response([
            'message'   => __('app.record_updated'),
            'status'    => true,
            'results'   => [
                'Cable'  => new CablePricingResources($pricing),
            ],
        ], 201);
    }

    public function toggleStatus($id)
    {
        $Cable = $this->CableService->getCablePlan($id);

        if ($Cable) {
            $Cable->is_active = !$Cable->is_active;
            $Cable->save();

            return response([
                'message'   => __('app.record_updated'),
                'status'    => true,
                'results'   => [
                    'Cable'  => new CablePricingResources($Cable),
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
        $Cable = $this->CableService->getCablePlan($id);

        if ($Cable) {
            $Cable->delete();
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
