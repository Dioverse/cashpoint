<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CableHistory extends Model
{
    //
    protected $fillable = [
        'user_id',
        'cable_id',
        'cable_plan_id',
        'iuc_number',
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

    public function cable()
    {
        return $this->belongsTo(Cable::class);
    }

    public function cablePlan()
    {
        return $this->belongsTo(CablePlan::class);
    }
}
