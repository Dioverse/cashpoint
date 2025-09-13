<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LockedBalance extends Model
{
    //
    protected $fillable = [
        'user_id', 'amount', 'reason', 'status', 'locked_at', 'unlocked_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
