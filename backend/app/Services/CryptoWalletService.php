<?php

namespace App\Services;

use Coinremitter\Coinremitter;


class CryptoWalletService
{
    protected $coin;

    public function __construct($coin = 'BTC')
    {
        $this->coin = strtoupper($coin);
    }

    public function createAddress()
    {
        $wallet = new Coinremitter($this->coin);
        return $wallet->get_new_address();
    }

    public function getBalance()
    {
        $wallet = new Coinremitter($this->coin);
        return $wallet->get_balance();
    }

    public function send($toAddress, $amount)
    {
        $wallet = new Coinremitter($this->coin);
        return $wallet->withdraw([
            'to_address' => $toAddress,
            'amount' => $amount,
        ]);
    }
}
