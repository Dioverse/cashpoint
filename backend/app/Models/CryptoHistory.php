<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CryptoHistory extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'user_id',
        'crypto_id',
        'type',
        'amount',
        'amount_crypto',
        'naira_equivalent',
        'wallet_address',
        'transaction_hash',
        'status'
    ];

    public function crypto()
    {
        return $this->belongsTo(Crypto::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
