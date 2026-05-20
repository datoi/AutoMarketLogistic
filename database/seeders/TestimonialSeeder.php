<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            [
                'name'          => 'Giorgi M.',
                'city'          => 'Tbilisi',
                'vehicle_label' => '2020 BMW X5',
                'quote'         => 'AutoMarket found me the exact car I wanted at a price I could not match anywhere else. The whole process — bidding, shipping, customs — was handled without me lifting a finger.',
                'rating'        => 5,
                'sort_order'    => 1,
                'is_active'     => true,
            ],
            [
                'name'          => 'Nino K.',
                'city'          => 'Batumi',
                'vehicle_label' => '2019 Toyota Camry',
                'quote'         => 'Smooth from start to finish. They sent me lot photos before the auction, kept me updated through shipping, and delivered to my door in Batumi.',
                'rating'        => 5,
                'sort_order'    => 2,
                'is_active'     => true,
            ],
            [
                'name'          => 'Davit T.',
                'city'          => 'Kutaisi',
                'vehicle_label' => '2021 Audi A6',
                'quote'         => 'Got my Audi three weeks earlier than the original ETA and in better condition than the photos suggested. Recommended to two friends already.',
                'rating'        => 5,
                'sort_order'    => 3,
                'is_active'     => true,
            ],
        ];

        foreach ($rows as $row) {
            Testimonial::updateOrCreate(
                ['name' => $row['name'], 'vehicle_label' => $row['vehicle_label']],
                $row,
            );
        }
    }
}
