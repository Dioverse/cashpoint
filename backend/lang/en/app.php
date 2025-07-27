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
    // Errrorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrssssssssssssssssssssssssssssssssssss
    'internal_server'               => 'Internal server error, contact support.',
    'error_404'                     => 'Page not found.',

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

    // Giftcard ...................................................................................................
    'giftcard_retrieved'            => 'Giftcard types retrieved successfully.',
    'giftcard_rates_retrieved'      => 'Giftcard rates retrieved successfully.',
    'giftcard_sell_success'         => 'Giftcard sell request submitted successfully.',
    'giftcard_buy_success'          => 'Giftcard buy request submitted successfully.',
    'giftcard_history_retrieved'    => 'Giftcard history retrieved successfully.',
    'crypto_history_retrieved'      => 'Crypto history retrieved successfully.',
    'giftcard_not_found'            => 'Giftcard not found.',
    'crpto_not_found'               => 'Crypto not found.',
    'giftcard_detail_retrieved'     => 'Giftcard detail retrieved successfully.',
    'giftcard_process_failed'       => 'Giftcard processing failed, try again.',

    'crypto_trade_submitted'        => 'Trade submitted, pending approval',
    'crypto_sent'                   => 'Crypto sent to wallet.',
    'crypto_rates_retreived'        => 'Crypto rate retrieved',
    'wallet_address_created'        => 'Wallet address created.',
    'invalid_wallet_address'        => 'Invalid wallet address',
    'transaction_confirmed'         => 'Transaction confirmed.',
    'unable_to_verify_transaction'  => 'Unable to verify transaction.',

    'data_retrieved_successfully'   => 'Data retrieved successfully.',
    'data_retrieved_failed'         => 'Data couldn\'t be retreived.',

    'data_verified_successfully'    => 'Data verified successfully.',
    'data_verification_failed'      => 'Informartion couldn\'t be verified',
    'operation_failed'              => 'Operation failed, please try again.',
    'insufficient_funds'            => 'Insufficient balance.',
];
