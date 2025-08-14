<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cable extends Model
{
    //
    protected $fillable = [
        'name',
        'identifier',
        'is_active'
    ];

    public function cablePlan()
    {
        return $this->hasMany(CablePlan::class);
    }

    public function cableHistory()
    {
        return $this->hasMany(CableHistory::class);
    }
}
