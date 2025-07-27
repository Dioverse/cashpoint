<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Network extends Model
{
    //
    protected $fillable = [
        'name',
        'code',
        'logo',
        'is_active',
    ];

    public function dataPrices()
    {
        return $this->hasMany(DataPrice::class);
    }

    public function airtimePercentages()
    {
        return $this->hasMany(AirtimePercentage::class);
    }
}
