<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->integer('year');
            $table->string('make', 100);
            $table->string('model', 200);
            $table->string('trim', 100)->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('mileage');
            $table->string('condition', 50);
            $table->string('status', 50)->default('In Transit');
            $table->string('lot_number', 50)->unique();
            $table->string('location', 200)->nullable();
            $table->string('engine', 200)->nullable();
            $table->string('fuel_type', 50)->nullable();
            $table->string('transmission', 100)->nullable();
            $table->string('vin', 17)->unique();
            $table->text('primary_damage')->nullable();
            $table->text('secondary_damage')->nullable();
            $table->json('highlights')->nullable();
            $table->json('images')->nullable();
            $table->date('estimated_arrival')->nullable();
            $table->text('description')->nullable();
            $table->string('color', 100)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
