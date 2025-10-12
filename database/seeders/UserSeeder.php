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
        // Create the main admin user so you can always log in
        User::factory()->create([
            'name' => 'assista admin',
            'email' => 'assista@admin.com',
            'password' => Hash::make('password'), // The password is 'password'
            'role' => 'admin',
        ]);

        // Create a sample applicant user you can test with
        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'johndoe@email.com',
            'password' => Hash::make('password'), // The password is 'password'
            'role' => 'user',
        ]);

        // Create 10 more random users to make the database look full
        User::factory()->count(10)->create();
    }
}
