<?php

namespace App\Http\Controllers;


use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Log;
use App\Services\VAccountsService;
use App\Services\AuthServices;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VirtualAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $paystackService;
    protected $userService;

    public function __construct()
    {
        // Ensure the user is authenticated
        // $this->middleware('auth:sanctum');
        $this->userService = new AuthServices();
        $this->paystackService = new VAccountsService();
    }


    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        $secret     = config('services.paystack.secret_key');
        $payload    = $request->getContent();
        $signature  = $request->header('x-paystack-signature');

        // Verify webhook signature
        if (hash_hmac('sha512', $payload, $secret) !== $signature) {
            Log::warning('Paystack Webhook: Invalid Signature');
            return response('Invalid signature', 401);
        }

        $event = $request->input('event');

        if ($event === 'charge.success') {
            $data = $request->input('data');

            // Only handle virtual account bank deposits
            if ($data['channel'] === 'bank' && isset($data['customer']['email'])) {
                $email      = $data['customer']['email'];
                $amount     = $data['amount'] / 100;
                $reference  = $data['reference'];
                $bank       = $data['authorization']['bank'] ?? 'Unknown Bank';

                // Find user by email
                $user = $this->userService->getUserByEmail($email);

                if ($user) {
                    // Update the user details ........................
                    $user->update([
                        'virtual_accounts' => $bank,
                    ]);

                    Log::info("Wallet funded: {$user->email} - ₦{$amount}");
                } else {
                    Log::warning("Webhook received for unknown user: {$email}");
                }
            }
        }

        return response('Webhook received', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function create(Request $request)
    : Response
    {

        $user = auth()->user();
        $ref = 'VA_' . Str::uuid();
        // Logic to create a virtual account for the user

        try {
            $paystack = $this->paystackService;
            $User = $this->userService;
            $virtualAccount = $paystack->createVirtualAccount(
                $user->firstName,
                $user->lastName,
                $user->email,
                $user->phone
            );



            return response([
                'message'   => __('app.virtual_account_created'),
                'status'    => true,
                'results'   => [
                    'user'  => new UserResource($user),
                    'data' => $virtualAccount,
                ],
            ], 201);

        } catch (\Exception $e) {
            return response([
                'message'   => __('app.virtual_account_error'),
                'status'    => false,
                'error'     => $e->getMessage(),
            ], 201);
        }

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
    public function withdrawToUSD(Request $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function withdrawToNGN(Request $request)
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
