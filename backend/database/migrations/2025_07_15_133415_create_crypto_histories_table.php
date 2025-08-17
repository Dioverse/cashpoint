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
        Schema::create('crypto_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('crypto_id')->constrained('cryptos');
            $table->enum('type', ['buy', 'sell']);
            $table->string('currency');
            $table->decimal('amount', 15, 2); // Amount in USD or original currency
            $table->decimal('amount_crypto', 20, 8); // Amount in crypto (e.g., BTC, ETH)
            $table->decimal('naira_equivalent', 15, 2)->nullable();
            $table->string('wallet_address')->nullable(); // optional if selling
            $table->string('transaction_hash')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->json('api_response')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crypto_histories');
    }
};
