<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'contact_phone',        'value' => '+1 (555) 000-1234'],
            ['key' => 'contact_hours',         'value' => 'Mon–Sat, 9:00–18:00'],
            ['key' => 'contact_email',         'value' => 'info@automarketlogistic.com'],
            ['key' => 'contact_reply_time',    'value' => 'We reply within 24h'],
            ['key' => 'contact_address_line1', 'value' => '123 Auto Logistics Blvd'],
            ['key' => 'contact_address_line2', 'value' => 'Miami, FL 33101, USA'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], ['value' => $setting['value']]);
        }
    }
}
