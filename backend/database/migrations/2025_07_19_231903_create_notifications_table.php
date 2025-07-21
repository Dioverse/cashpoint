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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // sender or receiver
            $table->string('title');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->enum('type', ['user', 'admin'])->default('user'); // who it's for
            $table->json('data')->nullable(); // for extra details like transaction_id
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
