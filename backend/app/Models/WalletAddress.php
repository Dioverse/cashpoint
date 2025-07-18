<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalletAddress extends Model
{
    //
    protected $fillable = [
        'user_id',
        'coin', // e.g., USDT, BTC
        'address', // Wallet address
        'expires_at', // Optional expiration date for the address
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
