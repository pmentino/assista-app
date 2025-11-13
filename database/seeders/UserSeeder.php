<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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

        User::factory()->create([
            'name' => 'assista admin',
            'email' => 'assista@admin.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        
        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'johndoe@email.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);


        User::factory()->count(10)->create();
    }
}
