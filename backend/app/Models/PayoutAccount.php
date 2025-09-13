<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayoutAccount extends Model
{
    //
    protected $fillable = [
        'user_id', 'bank_name', 'account_name', 'account_number', 'currency', 'is_default', 'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
