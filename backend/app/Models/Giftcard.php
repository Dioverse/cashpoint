<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Giftcard extends Model
{
    //
    use HasFactory;
    protected $fillable = [
        'name',
        'country',
        'rate',
        'logo',
        'description',
        'is_active',
    ];
}
