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
            $table->string('card_type'); // e.g., Amazon, iTunes, etc.
            $table->string('category');
            $table->decimal('amount', 10, 2); // Amount in USD or original currency
            $table->decimal('naira_equivalent', 10, 2);
            $table->json('images'); // Store image paths as JSON
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('approved_by')->constrained()->onDelete('cascade')->nullable();
            $table->date('approved_on');
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
