<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataHistory extends Model
{
    //
    protected $fillable = [
        'user_id',
        'network_id',
        'data_price_id',
        'phone',
        'amount',
        'status',
        'reference'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function network()
    {
        return $this->belongsTo(Network::class);
    }
}
