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
        Schema::create('giftcards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('country')->nullable(); // e.g. USA, UK
            $table->decimal('rate', 10, 2)->default(0); // Naira rate per $1
            $table->string('logo')->nullable(); // Path to logo image
            $table->text('description')->nullable(); // Optional note
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('giftcards');
    }
};
