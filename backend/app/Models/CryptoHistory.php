<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CryptoHistory extends Model
{
    //
    protected $fillable = [
        'user_id',
        'coin', // e.g., USDT, BTC
        'amount', // Amount in USD or original currency
        'naira_equivalent',
        'status', // pending, approved, rejected
        'tx_hash' // Transaction hash for tracking
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
