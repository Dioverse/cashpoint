<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CableBillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $bills = [
            ['name' => 'Aba Electricity', 'identifier' => 'ABA', 'serviceID' => 'aba-electric', 'is_active'=>1],
            ['name' => 'Abuja Electricity', 'identifier' => 'AEDC', 'serviceID' => 'abuja-electric', 'is_active'=>1],
            ['name' => 'Benin Electricity', 'identifier' => 'BEDC', 'serviceID' => 'benin-electric', 'is_active'=>1],
            ['name' => 'Eko Electricity', 'identifier' => 'EKEDC', 'serviceID' => 'eko-electric', 'is_active'=>1],
            ['name' => 'Enugu Electricity', 'identifier' => 'EEDC', 'serviceID' => 'enugu-electric', 'is_active'=>1],
            ['name' => 'Ibadan Electricity', 'identifier' => 'IBEDC', 'serviceID' => 'eko-electric', 'is_active'=>1],
            ['name' => 'Ikeja Electricity', 'identifier' => 'IKEDC', 'serviceID' => 'ikeja-electric', 'is_active'=>1],
            ['name' => 'Jos Electricity', 'identifier' => 'EKEDC', 'serviceID' => 'jos-electric', 'is_active'=>1],
            ['name' => 'Kano Electricity', 'identifier' => 'KEDCO', 'serviceID' => 'kano-electric', 'is_active'=>1],
            ['name' => 'Kaduna Electricity', 'identifier' => 'KAEDC', 'serviceID' => 'kaduna-electric', 'is_active'=>1],
            ['name' => 'Port-Harcourt Electricity', 'identifier' => 'PHEDC', 'serviceID' => 'portharcourt-electric', 'is_active'=>1],
            ['name' => 'Yola Electricity', 'identifier' => 'YEDC', 'serviceID' => 'yola-electric', 'is_active'=>1],
        ];

        foreach ($bills as $bill) {
            \App\Models\Bill::updateOrCreate(
                [
                    'serviceID' => $bill['serviceID'],
                    'name' => $bill['name'],
                    'identifier' => $bill['identifier'],
                    'is_active' => $bill['is_active']
                ],
            );
        }

        // Cable services
        $cables = [
            ['name' => 'DSTV', 'identifier' => 'dstv'],
            ['name' => 'GOTV', 'identifier' => 'gotv'],
            ['name' => 'STARTIMES', 'identifier' => 'startimes'],
            ['name' => 'SHOWMAX', 'identifier' => 'showmax'],
        ];

        foreach ($cables as $cable) {
            \App\Models\Cable::updateOrCreate(
                ['identifier' => $cable['identifier']],
                $cable
            );
        }
    }
}
