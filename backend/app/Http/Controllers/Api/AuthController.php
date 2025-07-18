<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuthServices;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    protected $authService;
    public function __construct()
    {
        $this->authService = new AuthServices();
    }
    /**
     * Handle user login
     *
     * @param Request $request
     * @return Response
     */
    //
    public function login(Request $request)
    {
        // Handle login logic
        $request->validate([
            'email'     => 'required|email|max:255',
            'password'  => 'required|string|min:6|max:255',
        ]);

        $user = $this->authService->login($request);

        if (!$user) {
            return response([
                'message'   => __('auth.failed'),
                'status'    => false,
            ], 401);
        }
        // Create a token for the user
        $token = $user->createToken('auth_token')->plainTextToken;
        return response([
            'message'   => $user->email_verified_at ? __('app.login_success') : __('app.login_success_verify'),
            'status'    => true,
            'results'   => [
                'user'  => new UserResource($user),
                'token' => $token,
            ],
        ]);
    }
    /**
     * Handle user logout
     *
     * @param Request $request
     * @return Response
     */
    public function logout(Request $request)
    {
        // Handle logout logic
        $request->user()->currentAccessToken()->delete();
        return response([
            'message'   => __('app.logout_success'),
            'status'    => true,
        ]);
    }

    /**
     * Handle user registration
     *
     * @param Request $request
     * @return Response
     */
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
            'phone'         => 'numeric|string|unique:users,phone',
            'password'      => 'required|string|min:6|max:255',
        ]);

        $user = $this->authService->register($request);
        // Create a token for the user
        $token = $user->createToken('auth_token')->plainTextToken;
        return response([
            'message'   => __('app.registration_success_verify'),
            'status'    => true,
            'results'   => [
                'user'  => new UserResource($user),
                'token' => $token,
            ],
        ], 201);
    }

    /**
     * Handle user OTP verification
     *
     * @param Request $request
     * @return Response
     */
    public function otp(Request $request)
    : Response
    {
        // Handle OTP verification logic
        $user = auth()->user();

        // generate OTP
        $otp = $this->authService->otp($user);


        return response([
            'message'   => __('app.otp_mail_sent'),
            'status'    => true,
        ]);
    }
    /**
     * Handle user OTP resend
     *
     * @param Request $request
     * @return Response
     */
    public function resend(Request $request)
    {
        // Handle OTP resend logic
        $request->validate([
            'email' => 'required|string|email|max:255',
        ]);

        $user = User::where('email', $request->email)->first();
        if ($user) {
            $user->otp = Str::random(6);
            $user->save();

            return response([
                'message'   => __('app.otp_resend'),
                'status'    => true,
            ]);
        }

        return response([
            'message'   => __('app.user_not_found'),
            'status'    => false,
        ], 404);
    }
    /**
     * Handle user verification
     *
     * @param Request $request
     * @return Response
     */
    public function verify(Request $request)
    {
        // Handle user verification logic
        $request->validate([
            'otp'   => 'required|numeric|digits:6',
        ]);

        $user = auth()->user();

        $user = $this->authService->verify($user, $request);

        return response([
            'message'   => __('app.otp_mail_verify_success'),
            'status'    => true,
            'results'   => [
                'user'  => new UserResource($user),
            ],
        ]);
    }

    /**
     * Handle password reset OTP
     *
     * @param Request $request
     * @return Response
     */
    public function resetOtp(Request $request)
    : Response
    {
        $request->validate([
            'email' => 'required|string|email|max:255|exists:users,email',
        ]);

        $user = $this->authService->getUserByEmail($request->email);

        $otp = $this->authService->otp($user, 'password-reset');

        // return message
        return response([
            'message'   => __('app.otp_mail_sent'),
            'status'    => true,
        ]);

    }

    /**
     * Handle password reset
     *
     * @param Request $request
     * @return Response
     */
    public function resetPassword(Request $request)
    {

        $request->validate([
            'email'     => 'required|string|email|max:255|exists:users,email',
            'otp'       => 'required|numeric|digits:6',
            'password'  => 'required|string|min:6|max:255|confirmed',
            'password_confirmation'  => 'required|string|min:6|max:255',
        ]);

        $user = $this->authService->getUserByEmail($request->email);

        $ousertp = $this->authService->resetPassword($user, $request);

        // return message
        return response([
            'message'   => __('app.password_reset_success'),
            'status'    => true,
        ]);
    }

    /**
     * Reset pin for user
     *
     * @param Request $request
     * @return Response
     */
    public function createPin(Request $request)
    : Response
    {
       $request->validate([
            'email'             => 'required|string|email|max:255|exists:users,email',
            'otp'               => 'required|numeric|digits:6',
            'pin'               => 'required|numeric|digits:4|confirmed',
            'pin_confirmation'  => 'required|numeric|digits:4',
        ]);

        $user = $this->authService->getUserByEmail($request->email);
        $ousertp = $this->authService->resetPassword($user, $request);

        // return message
        return response([
            'message'   => __('auth.pin_created'),
            'status'    => true,
        ]);
    }

    /**
     * Reset pin for user
     *
     * @param Request $request
     * @return Response
     */
    public function generateWallet(Request $request)
    : Response
    {
       $request->validate([
            'type'  => 'required|in:BTC,ETH,USDT'
        ]);

        $user = auth()->user();
        $user->generateWallet($request->type);

        // return message
        return response([
            'message'   => __('auth.wallet_address_generated'),
            'status'    => true,
            'results'   => [
                'address'  => $user->wallet_address,
                'type'     => $user->wallet_type,
            ],
        ]);
    }



    /**
     * Create pin for user
     *
     * @param Request $request
     * @return Response
     */
    public function resetPin(Request $request)
    : Response
    {
        // Validate the request
        $request->validate([
            'pin' => 'required|numeric|digits:4',
        ]);

        // Get the authenticated user
        $user = auth()->user();

        // Generate a new PIN
        $pin = $request->pin;

        // Save the PIN to the user's record
        $user->pin = $pin;
        $user->save();

        return response([
            'message'   => __('auth.pin_created'),
            'status'    => true,
            'results'   => [
                'user'  => new UserResource($user),
            ],
        ]);
    }


    /**
     * Get authenticated user
     *
     * @param Request $request
     * @return Response
     */


    public function user(Request $request)
    {
        // Return authenticated user
        return response()->json($request->user());
    }
}
