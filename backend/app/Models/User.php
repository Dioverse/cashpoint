<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'firstName',
        'lastName',
        'middleName',
        'username',
        'email',
        'phone',
        'status',
        'wallet_address',
        'wallet_type',
        'wallet_naira',
        'wallet_usd',
        'virtual_accounts',
        'country_code',
        'state_code',
        'city',
        'address',
        'zip',
        'dob',
        'kyc_tier',
        'kyc_status',
        'kyc_rejection_reason',
        'idmean',
        'idtype',
        'prove_of_address',
        'prove_of_fund',
        'daily_spent',
        'monthly_spent',
        'last_reset_date',
        'password',
        'pin',
        'role',
        'passport',
        'device_token'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'daily_spent' => 'decimal:2',
            'monthly_spent' => 'decimal:2',
            'last_reset_date' => 'date',
        ];
    }

    /**
     * Get the daily limit attribute.
     *
     * @return float
     */
    public function getDailyLimitAttribute(): float
    {
        return match($this->kyc_tier) {
            'tier1' => 1000.00,
            'tier2' => 10000.00,
            'tier3' => 100000.00,
            default => 1000.00,
        };
    }

    /**
     * Get the monthly limit attribute.
     *
     * @return float
     */
    public function getMonthlyLimitAttribute(): float
    {
        return match($this->kyc_tier) {
            'tier1' => 10000.00,
            'tier2' => 100000.00,
            'tier3' => 1000000.00,
            default => 10000.00,
        };
    }

    /**
     * Get the daily remaining attribute.
     *
     * @return float
     */
    public function getDailyRemainingAttribute(): float
    {
        return max(0, $this->daily_limit - ($this->daily_spent ?? 0));
    }

    /**
     * Get the monthly remaining attribute.
     *
     * @return float
     */
    public function getMonthlyRemainingAttribute(): float
    {
        return max(0, $this->monthly_limit - ($this->monthly_spent ?? 0));
    }

    public function walletTransactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function generateWallet($type = 'USDT')
    {
        $this->wallet_type = $type;
        $this->wallet_address = strtoupper($type) . '-' . strtoupper(uniqid());
        $this->save();
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function cryptoHistory()
    {
        return $this->hasMany(CryptoHistory::class);
    }

    public function giftcardHistory()
    {
        return $this->hasMany(GiftcardHistory::class);
    }

    public function airtimeHistory()
    {
        return $this->hasMany(AirtimeHistory::class);
    }

    public function billHistory()
    {
        return $this->hasMany(BillHistory::class);
    }

    public function cableHistory()
    {
        return $this->hasMany(CableHistory::class);
    }




}
