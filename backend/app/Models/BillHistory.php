<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillHistory extends Model
{
    //
    protected $fillable = [
        'user_id',
        'bill_id',
        'account_number',
        'phone',
        'customer',
        'amount',
        'status',
        'reference',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }
}
