<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AirtimePercentage extends Model
{
    //
    protected $fillable = [
        'network_id',
        'buy_perc',
        'percentage'
    ];

    public function network()
    {
        return $this->belongsTo(Network::class);
    }
}
