<?php

namespace App\Http\Controllers;

use App\Services\CableBillService;
use Illuminate\Http\Request;

class CableController extends Controller
{
    protected $cableService;

    public function __construct()
    {
        $this->cableService = new CableBillService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $Data = $this->cableService->cables();
        return response()->json([
            'success' => true,
            'message' => __('app.data_retrieved_successfully'),
            'results' => [
                'data' => $Data
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
        ]);

        $cable = $this->cableService->createCable($request->all());
        return response()->json([
            'success' => true,
            'message' => __('app.cable_create_success'),
            'results' => [
                'data' => $cable
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $cable = $this->cableService->getCable($id);
        if ($cable) {
            return response()->json([
                'success' => true,
                'message' => __('app.data_retrieved_successfully'),
                'results' => [
                    'data' => $cable
                ],
            ]);
        }
        return response()->json([
            'success' => false,
            'message' => __('app.data_not_found'),
        ], 404);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
        ]);

        $cable = $this->cableService->updateCable($id, $request->all());
        if ($cable) {
            return response()->json([
                'success' => true,
                'message' => __('app.data_updated_successfully'),
                'results' => [
                    'data' => $cable
                ],
            ]);
        }
        return response()->json([
            'success' => false,
            'message' => __('app.data_not_found'),
        ], 404);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $cable = $this->cableService->getCable($id);
        if ($cable) {
            $cable->delete();
            return response()->json([
                'success' => true,
                'message' => __('app.data_deleted_successfully'),
            ]);
        }
        return response()->json([
            'success' => false,
            'message' => __('app.data_not_found'),
        ], 404);
    }
}
