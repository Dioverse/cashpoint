<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayoutAccount extends Model
{
    //
    protected $fillable = [
        'user_id', 'bank_name', 'bank_code', 'account_name', 'account_number', 'recipient_code', 'currency', 'is_default', 'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
