<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'paystack' => [
        'base_url'      => env('PAYSTACK_BASE_URL', 'https://api.paystack.co'),
        'secret_key'    => env('PAYSTACK_SECRET_KEY'),
        'public_key'    => env('PAYSTACK_PUBLIC_KEY'),
    ],

    'nownode' => [
        'api_key' => env('NOWNODE_API_KEY'),
        'base_url' => env('NOWNODE_BASE_URL'),
    ],

    'firebase' => [
        'api_key' => env('FIREBASE_SERVER_KEY'),
    ],

    'smeplug' => [
        'key' => env('SMEPLUG_KEY'),
    ],

    'vtpass' => [
        'url'       => env('VTPASS_URL'),
        'username'  => env('VTPASS_USERNAME'),
        'password'  => env('VTPASS_PASSWORD'),
        'api_key'   => env('VTPASS_API_KEY'),
        'public_key'=> env('VTPASS_PUBLIC_KEY'),
        'secrete_key'=> env('VTPASS_SECRETE_KEY'),
    ]


];
