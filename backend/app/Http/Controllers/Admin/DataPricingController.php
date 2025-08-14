<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\DataPricingResources;
use App\Models\DataPrice;
use App\Services\DataService;
use Illuminate\Http\Request;

class DataPricingController extends Controller
{
    //
    protected $dataService;

    public function __construct()
    {
        $this->dataService = new DataService;
    }
    public function index()
    {
        $query = $this->dataService->query();
        $query->where('is_active', true)->orWhere('is_active', false);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'data'  => $query->latest()->paginate(20),
            ],
        ], 201);
    }


    public function read($id)
    {
        $data = $this->dataService->findDataPlan($id);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'data'  => new DataPricingResources($data),
            ],
        ], 201);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'network_id'        => 'required|string|exists:networks,id',
            'plan_name'         => 'required|string',
            'smeplug_plan_id'   => 'required|string',
            'buy_price'         => 'required|numeric',
            'price'             => 'required|numeric',
            'size'              => 'required|string',
            'size_in_mb'        => 'required|string',
            'validity'          => 'required|string',
        ]);

        $pricing = $this->dataService->createPlan($data);

        return response([
            'message'   => __('app.record_created'),
            'status'    => true,
            'results'   => [
                'data'  => new DataPricingResources($pricing),
            ],
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $pricing = $this->dataService->findDataPlan($id);

        $data = $request->validate([
            'network_id'        => 'required|string|exists:networks,id',
            'plan_name'         => 'required|string',
            'smeplug_plan_id'   => 'required|string',
            'buy_price'         => 'required|numeric',
            'price'             => 'required|numeric',
            'size'              => 'required|string',
            'size_in_mb'        => 'required|string',
            'validity'          => 'required|string'
        ]);

        $pricing->update($data);

        return response([
            'message'   => __('app.record_updated'),
            'status'    => true,
            'results'   => [
                'data'  => new DataPricingResources($pricing),
            ],
        ], 201);
    }

    public function toggleStatus($id)
    {
        $data = $this->dataService->findDataPlan($id);
        $data->is_active = !$data->is_active;
        $data->save();

        return response([
            'message'   => __('app.record_updated'),
            'status'    => true,
            'results'   => [
                'data'  => new DataPricingResources($data),
            ],
        ], 201);
    }

    public function destroy($id)
    {
        $data = $this->dataService->findDataPlan($id);

        if ($data) {
            $this->dataService->findDataPlan($id)->delete();
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
