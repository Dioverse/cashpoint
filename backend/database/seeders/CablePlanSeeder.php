<?php

namespace Database\Seeders;

use App\Models\Cable;
use App\Models\CablePlan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CablePlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $plans = [
            'dstv' => [
                ['name' => 'DSTV Padi', 'code' => 'dstv-padi', 'amount' => 2500],
                ['name' => 'DSTV Yanga', 'code' => 'dstv-yanga', 'amount' => 3500],
                ['name' => 'DSTV Confam', 'code' => 'dstv-confam', 'amount' => 6200],
            ],
            'gotv' => [
                ['name' => 'GOTV Smallie', 'code' => 'gotv-smallie', 'amount' => 1000],
                ['name' => 'GOTV Jinja', 'code' => 'gotv-jinja', 'amount' => 1650],
                ['name' => 'GOTV Max', 'code' => 'gotv-max', 'amount' => 3600],
            ],
            'startimes' => [
                ['name' => 'Startimes Basic', 'code' => 'startimes-basic', 'amount' => 1500],
                ['name' => 'Startimes Smart', 'code' => 'startimes-smart', 'amount' => 2200],
            ],
            'showmax' => [
                ['name' => 'Showmax Monthly', 'code' => 'showmax-monthly', 'amount' => 3200],
                ['name' => 'Showmax Mobile', 'code' => 'showmax-mobile', 'amount' => 1200],
            ],
        ];


        foreach ($plans as $service => $servicePlans) {
            $cable = Cable::where('identifier', $service)->first();
            if (!$cable) continue;

            foreach ($servicePlans as $plan) {
                CablePlan::updateOrCreate(
                    ['code' => $plan['code']],
                    [
                        'cable_id' => $cable->id,
                        'name' => $plan['name'],
                        'amount' => $plan['amount']
                    ]
                );
            }
        }
    }
}
