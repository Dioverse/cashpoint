<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    //
    protected $fillable = [
        'name',
        'identifier',
        'serviceID',
        'is_active',
    ];

    public function billHistory()
    {
        return $this->hasMany(BillHistory::class);
    }
}
