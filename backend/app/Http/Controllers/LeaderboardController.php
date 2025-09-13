<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\GiftcardHistory;
use App\Models\CryptoHistory;
use Illuminate\Http\Request;
use App\Models\User;


class LeaderboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        try{
            
            $giftcards = GiftcardHistory::where('status', 'success')
                ->select('user_id', DB::raw('SUM(amount) as total'))
                ->groupBy('user_id');


            $cryptos = CryptoHistory::where('status', 'approved')
                ->select('user_id', DB::raw('SUM(amount) as total'))
                ->groupBy('user_id');

            $combined = $giftcards->unionAll($cryptos);


            $leaderboard = DB::table(DB::raw("({$combined->toSql()}) as t"))
                ->mergeBindings($combined->getQuery())
                ->select('user_id', DB::raw('SUM(total) as total_volume'))
                ->groupBy('user_id')
                ->orderByDesc('total_volume')
                ->take(20)
                ->get();

            $leaderboard = $leaderboard->map(function ($row, $index) {
                $user = User::find($row->user_id);

                return [
                    'rank'   => $index + 1,
                    'user'   => [
                        'id'     => $user->id,
                        'name'   => $user->lastName . ' ' . $user->firstName,
                        'avatar' => $user->passport ?? null,
                    ],
                    'total_volume' => $row->total_volume,
                ];
            });

            return response()->json([
                'success'   => true,
                'message'   => 'Leaderboard retrieved successfully',
                'result'    => [
                    'leaderboard' => $leaderboard,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success'   => false,
                'message'   => 'Error retrieving leaderboard',
                'error'     => $e->getMessage(),
            ], 500);
        }
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
        //
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
