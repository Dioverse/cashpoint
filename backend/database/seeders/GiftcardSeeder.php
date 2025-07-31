<?php

namespace Database\Seeders;

use App\Models\Giftcard;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GiftcardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $giftcards = [
            [
                'name' => 'Amazon',
                'country' => 'USA',
                'rate' => 700.00,
                'logo' => 'giftcards/amazon.png',
                'description' => 'Amazon giftcard in USD',
            ],
            [
                'name' => 'iTunes',
                'country' => 'USA',
                'rate' => 680.00,
                'logo' => 'giftcards/itunes.png',
                'description' => 'iTunes giftcard',
            ],
            [
                'name' => 'Steam',
                'country' => 'USA',
                'rate' => 690.00,
                'logo' => 'giftcards/steam.png',
                'description' => 'Steam wallet giftcard',
            ],
        ];

        foreach ($giftcards as $card) {
            Giftcard::updateOrCreate(['name' => $card['name']], $card);
        }
    }
}
