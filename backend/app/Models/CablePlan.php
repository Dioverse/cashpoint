<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CablePlan extends Model
{
    //
    protected $fillable = [
        'cable_id',
        'name',
        'code',
        'buy_price',
        'amount',
        'is_active'
    ];

    public function cable()
    {
        return $this->belongsTo(Cable::class);
    }
}
