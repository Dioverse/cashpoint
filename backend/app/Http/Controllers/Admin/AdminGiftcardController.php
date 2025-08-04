<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\GiftcardResource;
use App\Services\giftCardService;
use Illuminate\Http\Request;

class AdminGiftcardController extends Controller
{
    //
    protected $giftCardService;

    public function __construct()
    {
        $this->giftCardService = new giftCardService;
    }
    public function index()
    {
        $query = $this->giftCardService->allGiftcards();

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
        $giftCard = $this->giftCardService->getGiftcardById($id);

        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'results'   => [
                'giftCard'  => new GiftcardResource($giftCard),
            ],
        ], 201);
    }

    public function store(Request $request)
    {
        $giftCard = $request->validate([
            'name'      => 'required|string|unique:giftcards,name',
            'country'   => 'required|string',
            'rate'      => 'required|numeric',
            'logo'      => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description'=> 'nullable|string',
        ]);

        $pricing = $this->giftCardService->createGiftcard([
            'name'        => $giftCard['name'],
            'country'     => $giftCard['country'],
            'rate'        => $giftCard['rate'],
            'logo'        => $giftCard['logo']->store('giftcard_logos', 'public'),
            'description' => $giftCard['description'] ?? null,
        ]);

        return response([
            'message'   => __('app.record_created'),
            'status'    => true,
            'results'   => [
                'giftCard'  => new GiftcardResource($pricing),
            ],
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $pricing = $this->giftCardService->getGiftcardById($id);

        $giftCard = $request->validate([
            'name'      => 'required|string|unique:giftcards,name',
            'country'   => 'required|string',
            'rate'      => 'required|numeric',
            'logo'      => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description'=> 'nullable|string',
        ]);

        $pricing->update([
            'name'        => $giftCard['name'],
            'country'     => $giftCard['country'],
            'rate'        => $giftCard['rate'],
            'logo'        => $giftCard['logo']->store('giftcard_logos', 'public'),
            'description' => $giftCard['description'] ?? null,
        ]);

        return response([
            'message'   => __('app.record_updated'),
            'status'    => true,
            'results'   => [
                'giftCard'  => new GiftcardResource($pricing),
            ],
        ], 201);
    }

    public function toggleStatus($id)
    {
        $giftCard = $this->giftCardService->getGiftcardById($id);

        if ($giftCard) {
            $giftCard->is_active = !$giftCard->is_active;
            $giftCard->save();

            return response([
                'message'   => __('app.record_updated'),
                'status'    => true,
                'results'   => [
                    'giftCard'  => new GiftcardResource($giftCard),
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
        $giftCard = $this->giftCardService->getGiftcardById($id);

        if ($giftCard) {
            $giftCard->delete();
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
