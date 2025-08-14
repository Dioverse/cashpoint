<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\AuthServices;
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
}
