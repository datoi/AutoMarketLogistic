<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'contact_phone',        'value' => '+995 32 205 42 44'],
            ['key' => 'contact_hours',         'value' => 'Mon–Sat, 9:00–18:00'],
            ['key' => 'contact_email',         'value' => 'info@automarketlogistic.com'],
            ['key' => 'contact_reply_time',    'value' => 'We reply within 24h'],
            ['key' => 'contact_address_line1', 'value' => '7 Tsotne Dadiani St., Karvasla'],
            ['key' => 'contact_address_line2', 'value' => 'Tbilisi, Georgia'],
            ['key' => 'social_facebook',       'value' => ''],
            ['key' => 'social_instagram',      'value' => 'https://www.instagram.com/automarketlogistic/'],
            ['key' => 'social_whatsapp',       'value' => ''],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], ['value' => $setting['value']]);
        }
    }
}
