<?php

namespace App\Http\Controllers;


use App\Http\Resources\UserResource;
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
    public function store()
    {
        //
        
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

            // Update the user details ........................
            $User->update([
                'virtual_accounts' => $virtualAccount->json(),
            ]);

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
