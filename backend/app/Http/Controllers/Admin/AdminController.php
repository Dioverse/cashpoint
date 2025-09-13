<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\AirtimeHistory;
use App\Models\CryptoHistory;
use App\Models\DataHistory;
use App\Models\GiftcardHistory;
use App\Models\WalletTransaction;
use App\Services\AuthServices;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    protected $userService;

    public function __construct()
    {
        $this->userService = new AuthServices();
    }
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = $this->userService->allUsers();
        return response([
            'message'   => __('app.data_retrieved_successfully'),
            'status'    => true,
            'users'     => $users
        ]);
    }

    /**
     * Block user from login attempt.
     */
    public function block($id)
    {
        $users = $this->userService->block($id);
        return response([
            'message'   => __('app.account_blocked'),
            'status'    => true,
            'users'     => $users
        ]);
    }

    /**
     * Unblock user from login attempt.
     */
    public function unblock($id)
    {
        $users = $this->userService->unblock($id);
        return response([
            'message'   => __('app.account_unblocked'),
            'status'    => true,
            'users'     => $users
        ]);
    }

    /**
     * Unblock user from login attempt.
     */
    public function admin(Request $request)
    {
        $request->validate([
            'first_name'    => 'required|string|max:255',
            'last_name'     => 'required|string|max:255',
            'middle_name'   => 'required|string|max:255',
            'username'      => 'required|string|max:255',
            'email'         => 'required|string|max:255',
            'phone'         => 'required|string|max:255',
        ]);
        $user = $this->userService->addAdmin($request);
        return response([
            'message'   => __('app.registration_success'),
            'status'    => true,
            'results'   => [
                'user'  => new UserResource($user),
            ],
        ]);
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
        $users = $this->userService->delete($id);
        return response([
            'message'   => __('app.account_destroyed'),
            'status'    => true,
            'users'     => $users
        ]);
    }

    /**
     * Dashboard statistics
     */

    public function dashboard(Request $request)
    {
        $giftcardTotal = GiftcardHistory::sum('amount');
        $cryptoTotal   = CryptoHistory::sum('amount');
        $airtimeTotal  = AirtimeHistory::sum('amount');
        $dataTotal     = DataHistory::sum('amount');
        $walletTotal   = WalletTransaction::sum('amount');

        $inflow  = WalletTransaction::where('channel', 'virtual_account')->sum('amount');
        $outflow = WalletTransaction::where('channel', 'debit')->sum('amount');
        $profit  = $inflow - $outflow;

        $recent = WalletTransaction::latest()->take(5)->get();

        return response()->json([
            'status'         => true,
            'message'        => __('app.data_retrieved_successfully'),
            'airtime_total'  => $airtimeTotal,
            'data_total'     => $dataTotal,
            'giftcard_total' => $giftcardTotal,
            'crypto_total'   => $cryptoTotal,
            'wallet_total'   => $walletTotal,
            'profit'         => $profit,
            'recent'         => $recent,
        ]);

    }

    /**
     * Accounting overview
     */
    public function accounting(Request $request)
    {
        $start = $request->start_date ? Carbon::parse($request->start_date) : Carbon::now()->startOfMonth();
        $end   = $request->end_date ? Carbon::parse($request->end_date) : Carbon::now();

        // Giftcard
        $giftcardSales = GiftcardHistory::whereBetween('created_at', [$start, $end])
                        ->where('status', 'success')
                        ->sum('amount');

        // Crypto
        $cryptoSales = CryptoHistory::whereBetween('created_at', [$start, $end])
                            ->where('status', 'success')
                            ->sum('amount');

        // Airtime
        $airtimeSales = AirtimeHistory::whereBetween('created_at', [$start, $end])
                        ->where('status', 'success')
                        ->sum('amount');

        // Data
        $dataSales = DataHistory::whereBetween('created_at', [$start, $end])
                        ->where('status', 'success')
                        ->sum('amount');

        // Total Sales
        $sales = $giftcardSales + $cryptoSales + $airtimeSales + $dataSales;

        // Payments (expenses / debit from wallet if you log them)
        $payments = WalletTransaction::where('channel', 'virtual_account')
                        ->whereBetween('created_at', [$start, $end])
                        ->sum('amount');

        // Profit = Sales - Payments
        $profit = $sales - $payments;

        return response()->json([
            'status'        => true,
            'message'       => __('app.data_retrieved_successfully'),
            'date_range'    => [$start->toDateString(), $end->toDateString()],
            'giftcard_sales'=> $giftcardSales,
            'crypto_sales'  => $cryptoSales,
            'airtime_sales' => $airtimeSales,
            'data_sales'    => $dataSales,
            'total_sales'   => $sales,
            'payments'      => $payments,
            'profit'        => $profit,
        ]);

    }



}
