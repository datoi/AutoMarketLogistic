<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $admin = User::create([
            'name'     => 'Admin',
            'email'    => 'admin@automarketlogistic.com',
            'password' => Hash::make('password'),
        ]);
        $admin->role = 'admin';
        $admin->save();

        $this->call([
            VehicleSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
