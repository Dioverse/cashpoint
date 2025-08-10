<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\VirtualAccountController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminCryptoController;
use App\Http\Controllers\Admin\AdminGiftcardController as AdminAdminGiftcardController;
use App\Http\Controllers\Admin\AdminHistoryController;
use App\Http\Controllers\Admin\AdminKycController;
use App\Http\Controllers\Admin\AirtimePricingController;
use App\Http\Controllers\Admin\CablePricingController;
use App\Http\Controllers\Admin\DataPricingController;
use App\Http\Controllers\Admin\GiftCardController as AdminGiftCardController;
use App\Http\Controllers\Admin\PricingController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\KYCController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Purchase\CryptoController;
use App\Http\Controllers\Purchase\GiftcardController;
use App\Http\Controllers\VTUController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login')->name('api.auth.login');
    Route::post('/adminlogin', 'adminLogin')->name('api.auth.adminLogin');
    Route::post('/register', 'register')->name('api.auth.register');
    Route::post('/reset/otp', 'resetOtp')->name('api.auth.reset.otp');
    Route::post('/reset/password', 'resetPassword')->name('api.auth.reset.password');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/otp', 'otp')->name('api.auth.otp');
        Route::post('/verify', 'verify')->name('api.auth.verify');
        Route::post('/resend', 'resend')->name('api.auth.resend');
        Route::post('/create-pin', 'createPin')->name('api.auth.create.pin');
        Route::post('/reset-pin', 'resetPin')->name('api.auth.reset.pin');
        Route::get('/user', 'user')->name('api.auth.user');
        Route::post('/user/generate-wallet', 'generateWallet')->name('api.auth.generate.wallet');
        Route::post('/logout', 'logout')->name('api.auth.logout');
        Route::post('/passport', 'passport')->name('api.auth.passport');
    });
});

Route::controller(KYCController::class)->middleware('auth:sanctum')->group(function () {
    Route::post('/kyc/tier2', 'store')->name('api.kyc.tier2');
    Route::post('/kyc/tier3', 'create')->name('api.kyc.tier3');
});

Route::middleware('auth:sanctum')->group(function () {
        // Gift Card
    Route::post('/giftcard/sell', [GiftcardController::class, 'sell']);
    Route::post('/giftcard/buy', [GiftcardController::class, 'buy']);
    Route::get('/giftcard/types', [GiftcardController::class, 'getTypes']);
    Route::get('/giftcard/rates', [GiftcardController::class, 'getRates']);
    Route::get('/giftcard/history', [GiftcardController::class, 'getMyGiftcardHistories']);
    Route::get('/giftcard/history/{id}', [GiftcardController::class, 'giftcardDetails']);

    // Crypto
    Route::post('/crypto/sell', [CryptoController::class, 'sell']);
    Route::post('/crypto/buy', [CryptoController::class, 'buy']);
    Route::post('/crypto/generate-address', [CryptoController::class, 'generateWalletAddress']);
    Route::post('/crypto/confirm-payment', [CryptoController::class, 'confirmPayment']);
    Route::get('/crypto/rates', [CryptoController::class, 'getRates']);
    Route::get('/crypto/history', [CryptoController::class, 'getMyCryptoHistories']);
    Route::get('/crypto/history/{id}', [CryptoController::class, 'cryptoDetails']);

    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('/{id}/mark-read', [NotificationController::class, 'markAsRead']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::get('/test', [NotificationController::class, 'testNotify']); // optional
    });

    Route::prefix('vtu')->controller(VTUController::class)->group(function () {
        Route::post('/airtime', 'buyAirtime')->name('api.vtu.airtime');
        Route::post('/bill', 'buyBill')->name('api.vtu.bill');
        Route::post('/cable', 'buyCable')->name('api.vtu.cable');
        Route::post('/data', 'buyData')->name('api.vtu.data');
        Route::post('/verify', 'verifyBillNo')->name('api.vtu.verify');


        Route::get('/bills', 'bills');
        Route::get('/cables', 'cables');
        Route::get('/data/plans', 'getDataPlans');
        Route::get('/data/plans/{id}', 'dataByNetwork');
        Route::get('/cable/plans', 'getCablePlans');
        Route::get('/cable/plan/{id}', 'cablePlan');
        Route::get('/airtime/perc/{id}', 'getAirtimePercentage');
        Route::get('/airtime/percentages', 'getAirtimePercentages');

        Route::get('/data/history', 'getMyDataHistories');
        Route::get('/data/history/{id}', 'dataDetails');
        Route::get('/airtime/history', 'getMyAirtimeHistories');
        Route::get('/airtime/history/{id}', 'airtimeDetails');
        Route::get('/cable/history', 'getMyCableHistories');
        Route::get('/cable/history/{id}', 'cableDetails');
        Route::get('/bill/history', 'getMyBillHistories');
        Route::get('/bill/history/{id}', 'billDetails');
    });


        // Wallet
        // Route::get('/wallet/balance', [WalletController::class, 'getBalance']);
        // Route::post('/wallet/fund', [WalletController::class, 'fund']);
        // Route::post('/wallet/withdraw', [WalletController::class, 'withdraw']);

    // Virtual Accounts routes can be added here
    Route::post('/accounts/create', [VirtualAccountController::class, 'create'])->name('api.wallet.index');
    Route::post('/accounts/withdrawal', [VirtualAccountController::class, 'withdraw'])->name('api.wallet.withdraw');
});


Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::post('/settings/exchange-rate', [SettingController::class, 'updateExchangeRate']);
    Route::get('/settings/exchange-rate', [SettingController::class, 'getExchangeRate']);
});










// ADMINISTRATOR API ROUTES @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Route::prefix('admin')->group(function () {

    // Public Admin Routes
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::get('/user', [AdminAuthController::class, 'me'])->name('api.admin.user');

    // Protected Admin Routes
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::post('/add-admin', [AdminAuthController::class, 'register']);

        Route::get('/kycs', [AdminKycController::class, 'index'])->name('admin.kycs.index');
        Route::get('/kycs/{kyc}', [AdminKycController::class, 'show'])->name('admin.kycs.show');
        Route::post('/kycs/{kyc}/approve', [AdminKycController::class, 'approve'])->name('admin.kycs.approve');
        Route::post('/kycs/{kyc}/reject', [AdminKycController::class, 'reject'])->name('admin.kycs.reject');

        // Settings
        Route::get('/settings', [SettingController::class, 'index']);
        Route::post('/settings', [SettingController::class, 'store']);
        Route::put('/settings/{id}', [SettingController::class, 'update']);
        Route::delete('/settings/{id}', [SettingController::class, 'destroy']);
        Route::get('/exchange-rate', [SettingController::class, 'getExchangeRate']);

        Route::get('/users', [AdminController::class, 'index']);
        Route::patch('/users/{id}/block', [AdminController::class, 'block']);
        Route::patch('/users/{id}/unblock', [AdminController::class, 'unblock']);
        Route::post('/users/create-admin', [AdminController::class, 'admin']);
        Route::delete('/users/{id}', [AdminController::class, 'delete']);

        Route::get('/histories/airtime', [AdminController::class, 'airtime']);
        Route::get('/histories/bill', [AdminController::class, 'bill']);
        Route::get('/histories/cable', [AdminController::class, 'cable']);
        Route::get('/histories/data', [AdminController::class, 'data']);
        Route::get('/histories/giftcards', [AdminController::class, 'giftcards']);

        Route::get('/giftcard/{id}/approve', [GiftcardController::class, 'approveGiftcard']);
        Route::post('/giftcard/{id}/decline', [GiftcardController::class, 'declineGiftcard']);

        // ++++++++++++++++ PRICING ROUTES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        Route::get('/pricings/airtime', [AirtimePricingController::class, 'index']);
        Route::post('/pricings/airtime', [AirtimePricingController::class, 'store']);
        Route::get('/pricings/airtime/{id}', [AirtimePricingController::class, 'read']);
        Route::put('/pricings/airtime/{id}', [AirtimePricingController::class, 'update']);
        Route::delete('/pricings/airtime/{id}', [AirtimePricingController::class, 'destroy']);

        Route::get('/pricings/cable', [CablePricingController::class, 'index']);
        Route::post('/pricings/cable', [CablePricingController::class, 'store']);
        Route::get('/pricings/cable/{id}', [CablePricingController::class, 'read']);
        Route::put('/pricings/cable/{id}', [CablePricingController::class, 'update']);
        Route::delete('/pricings/cable/{id}', [CablePricingController::class, 'destroy']);
        Route::get('/pricings/cable/status/{id}', [CablePricingController::class, 'toggleStatus']);

        Route::get('/pricings/crypto', [AdminCryptoController::class, 'index']);
        Route::post('/pricings/crypto', [AdminCryptoController::class, 'store']);
        Route::get('/pricings/crypto/{id}', [AdminCryptoController::class, 'read']);
        Route::post('/pricings/crypto/{id}', [AdminCryptoController::class, 'update']);
        Route::delete('/pricings/crypto/{id}', [AdminCryptoController::class, 'destroy']);
        Route::get('/pricings/crypto/status/{id}', [AdminCryptoController::class, 'toggleStatus']);

        Route::get('/pricings/data', [DataPricingController::class, 'index']);
        Route::post('/pricings/data', [DataPricingController::class, 'store']);
        Route::get('/pricings/data/{id}', [DataPricingController::class, 'read']);
        Route::put('/pricings/data/{id}', [DataPricingController::class, 'update']);
        Route::delete('/pricings/data/{id}', [DataPricingController::class, 'destroy']);
        Route::get('/pricings/data/status/{id}', [DataPricingController::class, 'toggleStatus']);

        Route::get('/pricings/giftcard', [AdminAdminGiftcardController::class, 'index']);
        Route::post('/pricings/giftcard', [AdminAdminGiftcardController::class, 'store']);
        Route::get('/pricings/giftcard/{id}', [AdminAdminGiftcardController::class, 'read']);
        Route::post('/pricings/giftcard/{id}', [AdminAdminGiftcardController::class, 'update']);
        Route::delete('/pricings/giftcard/{id}', [AdminAdminGiftcardController::class, 'destroy']);
        Route::get('/pricings/giftcard/status/{id}', [AdminAdminGiftcardController::class, 'toggleStatus']);


        // ++++++++++++++++ HISTORY ROUTES ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        Route::get('/histories/airtime', [AdminHistoryController::class, 'airtimeHistory']);
        Route::get('/histories/bill', [AdminHistoryController::class, 'billHistory']);
        Route::get('/histories/cable', [AdminHistoryController::class, 'cableHistory']);
        Route::get('/histories/crypto', [AdminHistoryController::class, 'cryptoHistory']);
        Route::get('/histories/data', [AdminHistoryController::class, 'dataHistory']);
        Route::get('/histories/giftcard', [AdminHistoryController::class, 'giftcardHistory']);
        Route::get('/histories/payment', [AdminHistoryController::class, 'fundHistory']);


        Route::get('/histories/airtime/{id}', [AdminHistoryController::class, 'airtimeHistoryDetail']);
        Route::get('/histories/bill/{id}', [AdminHistoryController::class, 'billHistoryDetail']);
        Route::get('/histories/cable/{id}', [AdminHistoryController::class, 'cableHistoryDetail']);
        Route::get('/histories/crypto/{id}', [AdminHistoryController::class, 'cryptoHistoryDetail']);
        Route::get('/histories/data/{id}', [AdminHistoryController::class, 'dataHistoryDetail']);
        Route::get('/histories/giftcard/{id}', [AdminHistoryController::class, 'giftcardHistoryDetail']);
        Route::get('/histories/payment/{id}', [AdminHistoryController::class, 'fundHistoryDetail']);


    });
});

// Webhook route goes here ....................................................................................
Route::post('/webhook/paystack', [VirtualAccountController::class, 'store'])->name('api.webhook.paystack');
