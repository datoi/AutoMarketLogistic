<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $rows = [
            'social_facebook'       => '',
            'social_instagram'      => 'https://www.instagram.com/automarketlogistic/',
            'social_whatsapp'       => '',
            'contact_address_line1' => '7 Tsotne Dadiani St., Karvasla',
            'contact_address_line2' => 'Tbilisi, Georgia',
        ];

        foreach ($rows as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }

    public function down(): void
    {
        Setting::whereIn('key', [
            'social_facebook',
            'social_instagram',
            'social_whatsapp',
        ])->delete();
    }
};
