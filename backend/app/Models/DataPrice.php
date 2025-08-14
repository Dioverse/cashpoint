<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataPrice extends Model
{
    //
    protected $fillable = [
        'network_id',
        'plan_name',
        'smeplug_plan_id',
        'buy_price',
        'price',
        'size',
        'size_in_mb',
        'validity',
        'is_active',
    ];

    public function network()
    {
        return $this->belongsTo(Network::class);
    }


}
