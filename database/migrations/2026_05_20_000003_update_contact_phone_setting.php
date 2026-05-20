<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Setting::updateOrCreate(
            ['key' => 'contact_phone'],
            ['value' => '+995 32 205 42 44'],
        );
    }

    public function down(): void
    {
        // No rollback — phone changes are forward-only.
    }
};
