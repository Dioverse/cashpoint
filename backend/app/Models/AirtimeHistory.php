<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AirtimeHistory extends Model
{
    //
    protected $fillable = ['user_id','network_id','phone','amount','commission','status','reference'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function network()
    {
        return $this->belongsTo(Network::class);
    }
}
