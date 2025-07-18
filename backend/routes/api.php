<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\VirtualAccountController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Purchase\CryptoController;
use App\Http\Controllers\Purchase\GiftcardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login')->name('api.auth.login');
    Route::post('/register', 'register')->name('api.auth.register');
    Route::post('/reset/otp', 'resetOtp')->name('api.auth.reset.otp');
    Route::post('/reset/password', 'resetPassword')->name('api.auth.reset.password');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/otp', 'otp')->name('api.auth.otp');
        Route::post('/verify', 'verify')->name('api.auth.verify');
        Route::post('/resend', 'resend')->name('api.auth.resend');
        Route::post('/create-pin', 'createPin')->name('api.auth.create.pin');
        Route::post('/reset-pin', 'resetPin')->name('api.auth.reset.pin');
        Route::get('/user', 'user')->middleware('auth:sanctum');
        Route::post('/user/generate-wallet', 'generateWallet')->middleware('auth:sanctum');
        Route::post('/logout', 'logout')->middleware('auth:sanctum');
    });
});


Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('admin')->group(function () {
        // Gift Card
        Route::post('/giftcard/sell', [GiftcardController::class, 'sell']);
        Route::post('/giftcard/buy', [GiftcardController::class, 'buy']);
        Route::get('/giftcard/types', [GiftcardController::class, 'getTypes']);
        Route::get('/giftcard/rates', [GiftcardController::class, 'getRates']);

        // Crypto
        Route::post('/crypto/sell', [CryptoController::class, 'sell']);
        Route::post('/crypto/generate-address', [CryptoController::class, 'generateWalletAddress']);
        Route::post('/crypto/confirm-payment', [CryptoController::class, 'confirmPayment']);
        Route::get('/crypto/rates', [CryptoController::class, 'getRates']);

        // Wallet
        // Route::get('/wallet/balance', [WalletController::class, 'getBalance']);
        // Route::post('/wallet/fund', [WalletController::class, 'fund']);
        // Route::post('/wallet/withdraw', [WalletController::class, 'withdraw']);
    });

    // Virtual Accounts routes can be added here
    Route::post('/accounts/create', [VirtualAccountController::class, 'create'])->name('api.wallet.index');
    Route::post('/accounts/withdrawal', [VirtualAccountController::class, 'withdraw'])->name('api.wallet.withdraw');
});


// Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
//     Route::post('/settings/exchange-rate', [SettingController::class, 'updateExchangeRate']);
//     Route::get('/settings/exchange-rate', [SettingController::class, 'getExchangeRate']);
// });










// ADMINISTRATOR API ROUTES @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Route::prefix('admin')->group(function () {

    // Public Admin Routes
    Route::post('/login', [AdminAuthController::class, 'login']);

    // Protected Admin Routes
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::post('/add-admin', [AdminAuthController::class, 'register']);

        // Settings
        Route::get('/settings', [SettingController::class, 'index']);
        Route::post('/settings', [SettingController::class, 'store']);
        Route::put('/settings/{id}', [SettingController::class, 'update']);
        Route::delete('/settings/{id}', [SettingController::class, 'destroy']);

        Route::get('/exchange-rate', [SettingController::class, 'getExchangeRate']);

    });
});

// Webhook route goes here ....................................................................................
Route::post('/webhook/paystack', [VirtualAccountController::class, 'store'])->name('api.webhook.paystack');
