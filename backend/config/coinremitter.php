<?php

return [
    'BTC' => [
        'API_KEY'   => env('COINREMITTER_BTC_API_KEY'),
        'PASSWORD'  => env('COINREMITTER_BTC_PASSWORD'),
        'address'    => env('COINREMITTER_BTC_WALLET')
    ],
    'USDT' => [
        'API_KEY'   => env('COINREMITTER_USDT_API_KEY'),
        'PASSWORD'  => env('COINREMITTER_USDT_PASSWORD'),
        'address'    => env('COINREMITTER_USDT_WALLET')
    ],
];
