<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Application Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used during authentication for various
    | messages that we need to display to the user. You are free to modify
    | these language lines according to your application's requirements.
    |
    */

    'registration_success'          => 'Registration Successful',
    'registration_success_verify'   => 'Registration Successful. Please verify your account.',
    'login_success'                 => 'Login successful',
    'login_success_verify'          => 'Login successful, please verify your account.',
    'logout_success'                => 'Logout successful',
    'invalid_otp'                   => 'Invalid OTP',
    'otp_mail_subject'              => 'Your 6-digit Cashpoint OTP',
    'otp_mail_sent'                 => 'OTP sent to your email address.',
    'otp_mail_verify_success'       => 'Your account has been verified successfully.',
    'otp_mail_verify_failed'        => 'Your account verification failed. Please try again.',
    'otp_mail_verify_expired'       => 'Your OTP has expired. Please request a new OTP.',
    'otp_many_attempts'             => 'You have exceeded the maximum number of OTP attempts. Please try again later.',
    'password_reset_success'        => 'Password reset successful, please login with your new password.',

    'virtual_account_created'       => 'Virtual account created successfully.',
    'virtual_account_error'         => 'An error occurred while creating the virtual account. Please try again later.',


    // Settings ...................................................................................................
    'setting_created'               => 'Setting created successfully.',
    'setting_updated'               => 'Setting updated successfully.',
    'setting_deleted'               => 'Setting deleted successfully.',
    'setting_not_found'             => 'Setting not found.',

    // Withdrawal ...............................................................................................
    'withdrawal_success'            => 'Withdrawal successful.',
    'withdrawal_failed'             => 'Withdrawal failed. Please try again later.',
    'insufficient_balance'          => 'Insufficient balance.',
    'invalid_amount'                => 'Invalid amount. Amount must not be less than 1 USD.',
];
