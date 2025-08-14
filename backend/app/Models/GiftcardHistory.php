<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GiftcardHistory extends Model
{
    //
    protected $fillable = [
        'user_id',
        'reference',
        'type', // buy or sell
        'card_type',
        'category',
        'quantity',
        'amount',
        'naira_equivalent',
        'images',
        'status', // pending, approved, rejected
        'approved_by', // admin ID
        'approved_on',
        'rejection_reason'
    ];

    protected $casts = [
        'images' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function giftcard()
    {
        return $this->belongsTo(Giftcard::class);
    }
}
