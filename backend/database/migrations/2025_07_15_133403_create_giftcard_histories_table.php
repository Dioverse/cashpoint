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
        Schema::create('giftcard_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('reference');
            $table->enum('type', ['buy', 'sell'])->default('sell');
            $table->string('card_type'); // e.g., Amazon, iTunes, etc.
            $table->integer('quantity')->default(1); // e.g., 1, 2, 3, etc.
            $table->string('category'); // e.g., Entertainment, Lifestyle, etc.
            $table->decimal('amount', 10, 2); // Amount in USD or original currency
            $table->decimal('naira_equivalent', 10, 2);
            $table->json('images'); // Store image paths as JSON
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->date('approved_on')->nullable();
            $table->string('rejection_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('giftcard_histories');
    }
};
