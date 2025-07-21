<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use App\Services\GiftcardService;
use Illuminate\Http\Request;
 use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class GiftcardController extends Controller
{
    //
    protected $giftcardService;
    public function __construct()
    {
        // Ensure the user is authenticated
        // $this->middleware('auth:sanctum');
        $this->giftcardService = new GiftcardService();
    }

    public function sell(Request $request)
    {
        $validated = $request->validate([
            'card_type'     => 'required|string',
            'category'      => 'required|string',
            'amount'        => 'required|numeric|min:1',
            'images'        => 'required|array|min:1',
            'images.*'      => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();
        return $this->giftcardService->processSell($user, $validated);
    }

    public function buy(Request $request)
    {
        $validated = $request->validate([
            'card_type'     => 'required|string',
            'category'      => 'required|string',
            'quantity'      => 'required|numeric|min:1',
        ]);

        $user = $request->user();
        return $this->giftcardService->processBuy($user, $validated);
    }

    public function getTypes()
    {
        return response([
            'message' => __('app.giftcard_retrieved'),
            'success' => true,
            'results' => [
                'data' => $this->giftcardService->activeGiftcards(),
            ],
        ]);
    }

    public function getRates()
    {
        return response([
            'message' => __('app.giftcard_rates_retrieved'),
            'success' => true,
            'results' => [
                'data' => $this->giftcardService->getGiftcardRates(),
            ],
        ]);

    }

    public function getMyGiftcardHistories(Request $request)
    {
        $user = Auth::user();
        return response([
            'message' => __('app.giftcard_history_retrieved'),
            'success' => true,
            'results' => [
                'data' => $this->giftcardService->getUserGiftcardHistories($user),
            ],
        ]);
    }



    public function giftcardDetails($id)
    {
        $user = Auth::user();
        if (!$user) {
            return response([
                'message'   => __('auth.unauthorized'),
                'status'    => false,
            ], 401);
        }
        $giftcard = $this->giftcardService->getGiftcardById($id);
        if (!$giftcard) {

            return response([
                'message'   => __('app.giftcard_not_found'),
                'status'    => true,
            ], 404);
        }
        return response(['success' => true, 'message' => __('app.giftcard_detail_retrieved'), 'result' => ['data' => $giftcard]]);
    }
    // public function getCategories()
    // {
    //     return response()->json([
    //         'categories' => [
    //             'Amazon',
    //             'iTunes',
    //             'Steam',
    //             'Google Play',
    //             'Apple Store',
    //             'PlayStation',
    //             'Xbox',
    //             'Netflix',
    //             'Spotify',
    //         ]
    //     ]);
    // }

    // CRUD operations for giftcards can be added here if needed
    public function create(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'country'   => 'nullable|string|max:100',
            'rate'      => 'required|numeric|min:0',
            'logo'      => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'description'=> 'nullable|string',
            'is_active'  => 'boolean',
        ]);

        return $this->giftcardService->createGiftcard($validated);
    }

    public function index()
    {
        return $this->giftcardService->allGiftcards();
    }

    public function show($id)
    {
        return $this->giftcardService->getGiftcardById($id);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'country'    => 'nullable|string|max:100',
            'rate'       => 'required|numeric|min:0',
            'logo'       => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'description'=> 'nullable|string',
            'is_active'  => 'boolean',
        ]);

        return $this->giftcardService->updateGiftcard($id, $validated);
    }

    public function destroy($id)
    {
        return $this->giftcardService->deleteGiftcard($id);
    }
}
