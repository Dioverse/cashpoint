<?php

namespace App\Http\Controllers;

use App\Services\NetworkService;
use Illuminate\Http\Request;

class NetworkController extends Controller
{
    protected $networkService;

    public function __construct()
    {
        $this->networkService = new NetworkService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $Data = $this->networkService->allNetworks();
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

        $network = $this->networkService->createNetwork($request->all());
        return response()->json([
            'success' => true,
            'message' => __('app.network_create_success'),
            'results' => [
                'data' => $network
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
        $network = $this->networkService->findNetworkById($id);
        if ($network) {
            return response()->json([
                'success' => true,
                'message' => __('app.network_found'),
                'results' => [
                    'data' => $network
                ],
            ]);
        }
        return response()->json([
            'success' => false,
            'message' => __('app.network_not_found'),
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

        $network = $this->networkService->updateNetwork($id, $request->all());
        if ($network) {
            return response()->json([
                'success' => true,
                'message' => __('app.network_update_success'),
                'results' => [
                    'data' => $network
                ],
            ]);
        }
        return response()->json([
            'success' => false,
            'message' => __('app.network_not_found'),
        ], 404);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $deleted = $this->networkService->deleteNetwork($id);
        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => __('app.network_delete_success'),
            ]);
        }
        return response()->json([
            'success' => false,
            'message' => __('app.network_not_found'),
        ], 404);
    }
}
