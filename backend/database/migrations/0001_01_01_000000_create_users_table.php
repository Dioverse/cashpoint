<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->string('firstName');
            $table->string('lastName');
            $table->string('middleName')->nullable();
            $table->string('username');
            $table->string('email');
            $table->string('phone');
            $table->enum('status', ['active', 'inactive', 'banned'])->default('active');
            $table->string('wallet_address')->nullable();
            $table->string('wallet_naira')->default(0.00);
            $table->string('wallet_usd')->default(0.00);
            $table->string('virtual_accounts')->nullable();
            $table->string('country_code')->nullable();
            $table->string('state_code')->nullable();
            $table->string('city')->nullable();
            $table->string('address')->nullable();
            $table->string('zip')->nullable();
            $table->string('dob')->nullable();
            $table->string('kyc_tier')->nullable();
            $table->string('kyc_status')->nullable();
            $table->string('kyc_rejection_reason')->nullable();
            $table->text('idmean')->nullable();
            $table->string('idtype')->nullable();
            $table->text('prove_of_address')->nullable(); //// Better for manual encryption openssl_encrypt($data, 'AES-256-CBC', $key, 0, $iv);
            $table->text('prove_of_fund')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('pin')->nullable();
            $table->enum('role', ['user', 'admin', 'super-admin'])->default('user');
            $table->text('passport')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
