<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\AuthServices;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class AdminAuthController extends Controller
{
    //
    protected $authService;
    public function __construct()
    {
        $this->authService = new AuthServices();
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'     => 'required|email',
            'password'  => 'required|string'
        ]);

        $user = $this->authService->adminLogin($request);

        if (!$user) {
            return response([
                'message'   =>  __('auth.admin_login_failed'),
                'status'    => false,
            ], 401);
        }

        $token = $user->createToken('admin-token')->plainTextToken;
        return response([
            'message'   => $user->email_verified_at ? __('auth.admin_login_success') : __('app.login_success_verify'),
            'status'    => true,
            'results'   => [
                'user'  => new UserResource($user),
                'token' => $token,
            ],
        ]);
    }

    public function register(Request $request)
    : Response
    {
        // Handle registration logic
        $request->validate([
            'first_name'    => 'required|string|max:255',
            'last_name'     => 'required|string|max:255',
            'middle_name'   => 'nullable|string|max:255',
            'username'      => 'required|string|max:255',
            'email'         => 'required|string|email|max:255|unique:users,email',
            'phone'         => 'numeric|digits:11|string|unique:users,phone',
        ]);

        $user = $this->authService->addAdmin($request);

        return response([
            'message'   => __('app.registration_success_verify'),
            'status'    => true,
            'results'   => [
                'user'  => new UserResource($user),
            ],
        ], 201);


    }

    public function toggleAdminStatus(Request $request)
    : Response
    {
        $request->validate([
            'uuid' => 'required|exists:users,uuid',
        ]);
        $user = $this->authService->findByUuid($request->uuid);
        $user = $this->authService->toggleAdminStatus($user);

        return response([
            'message'   => __('app.registration_success_verify'),
            'status'    => true,
            'results'   => [
                'user'  => new UserResource($user),
            ],
        ], 201);


    }

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();

         return response([
                'message'   =>  __('auth.logout'),
                'status'    => false,
            ], 401);
    }

}
