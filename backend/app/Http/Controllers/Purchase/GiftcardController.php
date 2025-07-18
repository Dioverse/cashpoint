<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GiftcardController extends Controller
{
    //
    protected $giftcardService;
    public function __construct()
    {
        // Ensure the user is authenticated
        // $this->middleware('auth:sanctum');
        $this->giftcardService = new \App\Services\GiftcardService();
    }

    public function sell(Request $request)
    {
        $validated = $request->validate([
            'card_type' => 'required|string',
            'category' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();
        return $this->giftcardService->processSell($user, $validated);
    }

    public function buy(Request $request)
    {
        $validated = $request->validate([
            'card_type' => 'required|string',
            'country' => 'required|string',
            'unit' => 'required|string',
            'quantity' => 'required|numeric|min:1',
        ]);

        $user = $request->user();
        return $this->giftcardService->processBuy($user, $validated);
    }

    public function getTypes()
    {
        return $this->giftcardService->getGiftcardTypes();
    }

    public function getRates()
    {
        return $this->giftcardService->getGiftcardRates();
    }
}
