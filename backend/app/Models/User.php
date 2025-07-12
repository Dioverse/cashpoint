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
        'wallet_address',
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
        'password',
        'pin',
        'role',
        'passport',
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
        ];
    }

    public function walletTransactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }
}
