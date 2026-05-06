<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->index('status');
            $table->index('make');
            $table->index('year');
            $table->index('price');
            $table->index(['is_featured', 'created_at']);
        });

        Schema::table('inquiries', function (Blueprint $table) {
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['make']);
            $table->dropIndex(['year']);
            $table->dropIndex(['price']);
            $table->dropIndex(['is_featured', 'created_at']);
        });

        Schema::table('inquiries', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
    }
};
