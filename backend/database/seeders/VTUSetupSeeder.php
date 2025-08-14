<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;


class VTUSetupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('networks')->delete();
        DB::table('data_prices')->delete();
        DB::table('airtime_percentages')->delete();

        // Networks
        $networks = [
            ['name' => 'MTN', 'code' => 'MTN'],
            ['name' => 'AIRTEL', 'code' => 'AIRTEL'],
            ['name' => '9MOBILE', 'code' => '9MOBILE'],
            ['name' => 'GLO', 'code' => 'GLO'],
        ];

        foreach ($networks as $network) {
            DB::table('networks')->insert($network);
        }

        // Get network IDs
        $mtnId      = DB::table('networks')->where('code', 'MTN')->value('id');
        $airtelId   = DB::table('networks')->where('code', 'AIRTEL')->value('id');
        $nmobileId  = DB::table('networks')->where('code', '9MOBILE')->value('id');
        $gloId      = DB::table('networks')->where('code', 'GLO')->value('id');

        // Data Plans
        DB::table('data_prices')->insert([
            [
                'network_id' => $mtnId,
                'plan_name' => '500MB',
                'smeplug_plan_id' => '1',
                'size' => '500MB',
                'size_in_mb' => 500,
                'price' => 150,
                'buy_price' => 135, // what app pays
            ],
            [
                'network_id' => $mtnId,
                'plan_name' => '1GB',
                'smeplug_plan_id' => '2',
                'size' => '1GB',
                'size_in_mb' => 1024,
                'price' => 690,
                'buy_price' => 670,
            ],
            [
                'network_id' => $mtnId,
                'plan_name' => '2GB',
                'smeplug_plan_id' => '3',
                'size' => '2GB',
                'size_in_mb' => 2024,
                'price' => 1380,
                'buy_price' => 1300,
            ],
            [
                'network_id' => $mtnId,
                'plan_name' => '3GB',
                'smeplug_plan_id' => '4',
                'size' => '3GB',
                'size_in_mb' => 3024,
                'price' => 2460,
                'buy_price' => 2400,
            ],
            [
                'network_id' => $mtnId,
                'plan_name' => '5GB',
                'smeplug_plan_id' => '2',
                'size' => '5GB',
                'size_in_mb' => 5024,
                'price' => 3920,
                'buy_price' => 3800,
            ],
            [
                'network_id' => $mtnId,
                'plan_name' => '10GB',
                'smeplug_plan_id' => '2',
                'size' => '10GB',
                'size_in_mb' => 10024,
                'price' => 7880,
                'buy_price' => 7500,
            ],
            [
                'network_id' => $airtelId,
                'plan_name' => '1GB',
                'smeplug_plan_id' => '113',
                'size' => '1GB',
                'size_in_mb' => 1024,
                'price' => 450,
                'buy_price' => 420,
            ],
            [
                'network_id' => $airtelId,
                'plan_name' => '2GB',
                'smeplug_plan_id' => '114',
                'size' => '2GB',
                'size_in_mb' => 2024,
                'price' => 900,
                'buy_price' => 850,
            ],
            [
                'network_id' => $airtelId,
                'plan_name' => '5GB',
                'smeplug_plan_id' => '115',
                'size' => '5GB',
                'size_in_mb' => 5024,
                'price' => 1800,
                'buy_price' => 1700,
            ],
            [
                'network_id' => $airtelId,
                'plan_name' => '10GB',
                'smeplug_plan_id' => '116',
                'size' => '10GB',
                'size_in_mb' => 10024,
                'price' => 8700,
                'buy_price' => 8500,
            ],
            [
                'network_id' => $airtelId,
                'plan_name' => '15GB',
                'smeplug_plan_id' => '117',
                'size' => '15GB',
                'size_in_mb' => 15024,
                'price' => 9000,
                'buy_price' => 8900,
            ],
            [
                'network_id' => $gloId,
                'plan_name' => '135GB',
                'smeplug_plan_id' => '415',
                'size' => '135GB',
                'size_in_mb' => 135024,
                'price' => 25700,
                'buy_price' => 25600,
            ],
            [
                'network_id' => $gloId,
                'plan_name' => '165GB',
                'smeplug_plan_id' => '416',
                'size' => '165GB',
                'size_in_mb' => 165024,
                'price' => 35700,
                'buy_price' => 35600,
            ],
            [
                'network_id' => $gloId,
                'plan_name' => '220',
                'smeplug_plan_id' => '417',
                'size' => '220',
                'size_in_mb' => 220024,
                'price' => 55700,
                'buy_price' => 55600,
            ],
        ]);

        // Airtime Percentage
        foreach ($networks as $network) {
            $networkId = DB::table('networks')->where('code', $network['code'])->value('id');

            DB::table('airtime_percentages')->insert([
                'network_id' => $networkId,
                'percentage' => 3.0, // what user gets
                'buy_perc' => 2.5,   // what SMEPlug gives (profit = 0.5%)
            ]);
        }
    }
}
