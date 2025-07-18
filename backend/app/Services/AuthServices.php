<?php

namespace App\Services;

use App\Mail\OtpMail;
use App\Models\Otp;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthServices
{
    public function getUserByEmail(string $email): ?User
    {
        //
        return User::where('email', $email)->first();
    }

    public function findByUuid(string $uuid): ?User
    {
        return User::where('uuid', $uuid)->first();
    }

    public function register(object $request): User
    {
        $user = User::create([
            'uuid'      => Str::uuid(),
            'firstName' => $request->first_name,
            'lastName'  => $request->last_name,
            'middleName'=> $request->middle_name,
            'username'  => $request->username,
            'email'     => $request->email,
            'phone'     => $request->phone,
            'password'  => bcrypt($request->password),
        ]);

        // Send verification email
        $this->otp($user);

        return $user;
    }

    public function addAdmin(object $request): User
    {
        $tempPassword = random_int(100000, 999999);
        $user = User::create([
            'uuid'      => Str::uuid(),
            'firstName' => $request->first_name,
            'lastName'  => $request->last_name,
            'middleName'=> $request->middle_name,
            'username'  => $request->username,
            'email'     => $request->email,
            'phone'     => $request->phone,
            'password'  => bcrypt($tempPassword),
        ]);

        // Send verification email
        $this->sendPassword($user);

        return $user;
    }

    public function update($data): User
    {
        $user = auth()->user();
        $user->update($data);
        return $user;
    }

    public function login(object $request): ?User
    {
        $user = User::where('email', $request->email)->first();
        if ($user && Hash::check($request->password, $user->password)) {

            return $user;

        }

        return null;
    }

    public function adminLogin(object $request): ?User
    {

        $user = User::where('email', $request->email)->first();
        if ($user && (in_array($user->role, ['admin', 'super-admin']) && Hash::check($request->password, $user->password))) {
            // return response()->json(['message' => 'Invalid credentials.'], 401);
            return $user;
        }
        return null;
    }

    public function otp(User $user, string $type='verification'): Otp
    {
        // Check if user already has an active OTP
        $tries = 3;
        $time = Carbon::now()->subMinutes(30);

        $count = Otp::where([
            'user_id'   => $user->id,
            'active'    => 1,
            'type'      => $type
        ])->where('created_at', '>=', $time)->count();

        if ($count >= $tries) {
            abort(422, __('app.otp_many_attempts'));
        }

        // Generate OTP
        $code = random_int(100000, 999999);
        $otp = Otp::create([
            'user_id'   => $user->id,
            'type'      => $type,
            'code'      => $code,
            'active'    => 1,
            'expired_at'=> now()->addMinutes(5),
        ]);

        // Send OTP to user
        Mail::to($user->email)->send(new OtpMail($user, $otp));

        return $otp;
    }

    public function sendPassword(User $user, string $type='password-reset'): Otp
    {
        // Check if user already has an active OTP
        $tries = 3;
        $time = Carbon::now()->subMinutes(30);

        // Generate Temporary Password
        $password = random_int(100000, 999999);
        // Send OTP to user
        Mail::to($user->email)->send(new OtpMail($user, $password));

        return $password;
    }

    public function verify(User $user, object $request): User
    {
        $otp = Otp::where([
            'code'      => $request->otp,
            'user_id'   => $request->user()->id,
            'active'    => 1,
            'type'      => 'verification',
        ])->first();

        if (!$otp) {
            abort(422, __('app.otp_mail_verify_failed'));
        }

        $user->email_verified_at = Carbon::now();
        $user->update();

        $otp->active = 0;
        $otp->updated_at = Carbon::now();
        $otp->update();

        return $user;
    }

    public function resend(object $request): ?User
    {
        $user = User::where('email', $request->email)->first();
        if ($user) {
            $this->otp($user);

            return $user;
        }

        return null;
    }

    public function resetPassword(User $user, Object $request): User
    {
        // Validate otp
        $otp = Otp::where([
            'user_id'   => $user->id,
            'code'      => $request->otp,
            'active'    => 1,
            'type'      => 'password-reset',
        ])->first();

        // Check if otp is valid
        if (!$otp) {
            abort(422, __('app.invalid_otp'));
        }

        // Update user
        $user->password = $request->password;
        $user->updated_at = Carbon::now();
        $user->update();

        // Return user
        return $user;
    }

    public function resetPin(User $user, Object $request): User
    {
        // Validate otp
        $otp = Otp::where([
            'user_id'   => $user->id,
            'code'      => $request->otp,
            'active'    => 1,
            'type'      => 'pin-reset',
        ])->first();

        // Check if otp is valid
        if (!$otp) {
            abort(422, __('app.invalid_otp'));
        }

        // Update user
        $user->pin = $request->pin;
        $user->updated_at = Carbon::now();
        $user->update();

        // Return user
        return $user;
    }


    public function toggleAdminStatus(User $user): User
    {
        $user->status = $user->status === 'active' ? 'inactive' : 'active';
        $user->updated_at = Carbon::now();
        $user->update();
        return $user;
    }


    public function logout(): void
    {
        auth()->user()->tokens()->delete();
    }
}
