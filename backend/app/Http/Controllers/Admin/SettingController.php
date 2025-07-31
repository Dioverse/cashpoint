<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\SettingService;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $settingService;
    public function __construct()
    {
        $this->settingService = new SettingService();
    }
    public function index()
    {
        return response([
            'status'    => true,
            'results'   => [
                'data'  => $this->settingService->all(),
            ],
        ], 201);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
     public function store(Request $request)
    {
        $request->validate([
            'key' => 'required|string|unique:settings,key',
            'value' => 'nullable'
        ]);

        $setting = Setting::create($request->only('key', 'value'));

        return response()->json(['message' => __('app.setting_created'), 'data' => $setting]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function update(Request $request, $id)
    {
        $setting = $this->settingService->find($id);
        $request->validate(['value' => 'nullable']);
        $setting->update(['value' => $request->value]);

        return response()->json(['message' => __('app.setting_updated'), 'data' => $setting]);
    }


    public function updateExchangeRate(Request $request)
    {
        $request->validate([
            'exchange_rate' => 'required|numeric|min:1',
        ]);

        $this->settingService->updateExchangeRate($request->exchange_rate);

        return response()->json([
            'message' => __('app.setting_updated'),
            'rate' => $request->exchange_rate
        ]);
    }


    public function getExchangeRate()
    {
        return response()->json([
            'exchange_rate' => (float) $this->settingService->getExchangeRate()
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $setting = Setting::findOrFail($id);
        $setting->delete();

        return response()->json(['message' => 'Setting deleted.']);
    }
}
