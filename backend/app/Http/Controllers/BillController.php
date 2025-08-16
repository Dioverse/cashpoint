<?php

namespace App\Http\Controllers;

use App\Services\CableBillService;
use Illuminate\Http\Request;

class BillController extends Controller
{
    protected $billService;

    public function __construct()
    {
        $this->billService = new CableBillService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $Data = $this->billService->bills();
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
            'amount' => 'required|numeric',
            'user_id' => 'required|exists:users,id',
        ]);

        $bill = $this->billService->createBill($request->all());
        return response()->json([
            'success' => true,
            'message' => __('app.bill_create_success'),
            'results' => [
                'data' => $bill
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
        $bill = $this->billService->getBill($id);
        if ($bill) {
            return response()->json([
                'success' => true,
                'message' => __('app.data_retrieved_successfully'),
                'results' => [
                    'data' => $bill
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
            'amount' => 'required|numeric',
            'user_id' => 'required|exists:users,id',
        ]);

        $bill = $this->billService->updateBill($id, $request->all());
        if ($bill) {
            return response()->json([
                'success' => true,
                'message' => __('app.data_updated_successfully'),
                'results' => [
                    'data' => $bill
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
        $bill = $this->billService->getBill($id);
        if ($bill) {
            $bill->delete();
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
