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
        Schema::create('cryptos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('symbol'); // e.g., BTC, ETH
            $table->decimal('usd_rate', 10, 2)->default(0.00);
            $table->string('logo')->nullable();
            $table->string('chain'); // e.g., BTC, ETH, TRX
            $table->string('nownode_ticker')->nullable(); // ticker for NowNode API
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cryptos');
    }
};
