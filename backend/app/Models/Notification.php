<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    //
    protected $casts = [
        'data' => 'array',
    ];

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'is_read',
        'type',
        'data',
    ];
}
