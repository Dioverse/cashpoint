<?php

namespace App\Services;

use App\Models\Giftcard;
use App\Models\GiftcardHistory;
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
            $reference      = Str::random(10);
            $nairaEquivalent = $this->convertToNaira($data['card_type'], $data['amount']);
            $nairaEquivalent = round($nairaEquivalent, 2);
            $trade = GiftcardHistory::create([
                'user_id'           => $user->id,
                'reference'         => $reference,
                'type'              => 'sell',
                'card_type'         => $data['card_type'],
                'category'          => $data['category'],
                'amount'            => $data['amount'],
                'naira_equivalent'  => $nairaEquivalent,
                'status'            => 'pending',
                'images'            => json_encode($imagePaths),
            ]);

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => __('app.giftcard_sell_success'),
                'results' => [
                    'data' => $trade,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e);
            return response()->json(['success' => false, 'message' => __('app.giftcard_process_failed')], 500);
        }
    }

    public function processBuy($user, $data)
    {
        DB::beginTransaction();
        try {
            $reference       = Str::random(10);
            $totalAmount     = $data['quantity'] * $this->getGiftcardRate($data['card_type']);
            $nairaEquivalent = $this->convertToNaira($data['card_type'], $totalAmount);
            $nairaEquivalent = round($nairaEquivalent, 2);

            // Assume wallet deduction logic here
            GiftcardHistory::create([
                'user_id'       => $user->id,
                'reference'     => $reference,
                'type'          => 'buy',
                'card_type'     => $data['card_type'],
                'category'      => $data['category'],
                'quantity'      => $data['quantity'],
                'amount'        => $totalAmount,
                'naira_equivalent' => $nairaEquivalent,
                'images'        => json_encode([]), // No images for buy
                'status'        => 'pending',
            ]);

            DB::commit();
            // Return success response
            return response()->json([
                'success' => true,
                'message' => __('app.giftcard_buy_success'),
                'results' => [
                    'data' => [
                        'card_type' => $data['card_type'],
                        'quantity' => $data['quantity'],
                        'amount' => $totalAmount,
                        'naira_equivalent' => $nairaEquivalent,
                    ]
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e);
            return response()->json(['success' => false, 'message' => __('app.giftcard_process_failed')], 500);
        }
    }

    public function getGiftcardRates()
    {
        $Giftcards = Giftcard::all();
        $rates = [];
        foreach ($Giftcards as $card) {
            $rates[$card->name] = $card->rate;
        }
        return $rates;
    }

    public function getGiftcardRate($type)
    {
        $giftcard = Giftcard::where('name', $type)->first();
        if (!$giftcard) {
            throw new \Exception("Giftcard rate for $type not found.");
        }
        return $giftcard->rate;
    }

    /**
     * Convert USD amount to Naira based on giftcard type and current exchange rate.
     *
     * @param string $type
     * @param float $usdAmount
     * @return float
     */


    protected function convertToNaira($type, $usdAmount)
    {
        $giftcard = Giftcard::where('name', $type)->first();
        $setting = new SettingService();
        if (!$giftcard) {
            throw new \Exception("Giftcard rate for $type not found.");
        }
        $exchangeRate = $setting->getExchangeRate() ?? 1000;
        $convertedAmount = $usdAmount * $exchangeRate;
        // $convertedAmount = $usdAmount * $giftcard->rate * $exchangeRate;
        return $convertedAmount;
    }

    public function allGiftcardHistory()
    {
        return GiftcardHistory::with('user')->paginate(10);
    }

    public function findGiftcardHistory($id)
    {
        return GiftcardHistory::with('user')->find($id);
    }

    public function getUserGiftcardHistories($user)
    {
        return GiftcardHistory::where('user_id', $user->id)->get();
    }

    // protected function convertToNaira($type, $category, $usdAmount)
    // {
    //     $rates = [
    //         'Amazon-USA' => 900,
    //         'iTunes-USA' => 850,
    //         'Steam-UK' => 780,
    //     ];
    //     $key = "$type-$category";
    //     $rate = $rates[$key] ?? 800;
    //     return $usdAmount * $rate;
    // }

    // Gift Card related methods .............................
    public function createGiftcard($data)
    {
        return Giftcard::create($data);
    }

    public function allGiftcards()
    {
        return Giftcard::get();
    }

    public function activeGiftcards()
    {
        return Giftcard::where('is_active', true)->get();
    }

    public function getGiftcardById($id)
    {
        return Giftcard::findOrFail($id);
    }

    public function updateGiftcard($id, $data)
    {
        $giftcard = Giftcard::findOrFail($id);
        $giftcard->update($data);
        return $giftcard;
    }

    public function deleteGiftcard($id)
    {
        $giftcard = Giftcard::findOrFail($id);
        return $giftcard->delete();

    }
}
