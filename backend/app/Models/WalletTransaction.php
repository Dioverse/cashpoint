<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    //

    protected $fillable = [
        'user_id',
        'reference',
        'amount',
        'channel',
        'status',
        'bank',
        'description',
        'currency',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
