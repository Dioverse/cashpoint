<?php

namespace App\Services;


use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\GiftcardTrade;
use Illuminate\Support\Str;

class GiftcardService
{
    public function processSell($user, $data)
    {
        DB::beginTransaction();
        try {
            $imagePaths = [];
            foreach ($data['images'] as $image) {
                $imagePaths[] = $image->store('giftcard_proofs', 'public');
            }

            $nairaEquivalent = $this->convertToNaira($data['card_type'], $data['category'], $data['amount']);

            $trade = GiftcardTrade::create([
                'user_id' => $user->id,
                'card_type' => $data['card_type'],
                'category' => $data['category'],
                'amount' => $data['amount'],
                'naira_equivalent' => $nairaEquivalent,
                'status' => 'pending',
                'images' => json_encode($imagePaths),
            ]);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Giftcard submitted for review.', 'data' => $trade]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e);
            return response()->json(['success' => false, 'message' => 'Unable to process giftcard.'], 500);
        }
    }

    public function processBuy($user, $data)
    {
        // Pseudo logic (replace with inventory check, balance deduction etc)
        $totalAmount = $data['quantity'] * 10000; // example rate

        // Assume wallet deduction logic here

        return response()->json(['success' => true, 'message' => 'Giftcard purchase request submitted.', 'amount' => $totalAmount]);
    }

    public function getGiftcardTypes()
    {
        return response()->json(['types' => ['Amazon', 'iTunes', 'Steam', 'Google Play']]);
    }

    public function getGiftcardRates()
    {
        return response()->json([
            'Amazon-USA' => 900,
            'iTunes-USA' => 850,
            'Steam-UK' => 780,
        ]);
    }

    protected function convertToNaira($type, $category, $usdAmount)
    {
        $rates = [
            'Amazon-USA' => 900,
            'iTunes-USA' => 850,
            'Steam-UK' => 780,
        ];
        $key = "$type-$category";
        $rate = $rates[$key] ?? 800;
        return $usdAmount * $rate;
    }
}
