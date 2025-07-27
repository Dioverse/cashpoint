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
        Schema::create('data_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('network_id')->constrained()->onDelete('cascade');
            $table->string('plan_name');
            $table->string('smeplug_plan_id');
            $table->integer('buy_price')->default(0); //buy price from provider
            $table->decimal('price', 10, 2); //sell price to user
            $table->string('size'); // e.g. 1GB
            $table->integer('size_in_mb');
            $table->string('validity')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_prices');
    }
};
