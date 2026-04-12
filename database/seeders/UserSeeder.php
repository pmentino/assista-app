<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ginamit natin ang User::create imbes na User::factory()->create
        User::create([
            'name' => 'assista admin',
            'email' => 'assista@admin.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'John Doe',
            'email' => 'johndoe@email.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

    }
}
