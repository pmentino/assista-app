<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Application;

class ApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users who are not admins
        $users = User::where('role', 'user')->get();

        // If there are no users, we can't create applications, so we stop.
        if ($users->isEmpty()) {
            $this->command->info('No users found to create applications for. Please seed users first.');
            return;
        }

        // Define the possible programs and statuses
        $programs = ['AICS - Medical', 'AICS - Burial', 'AICS - Food'];
        $statuses = ['Pending', 'Approved', 'Rejected'];

        // Create 25 sample applications
        for ($i = 0; $i < 25; $i++) {
            $user = $users->random(); // Pick a random user from our list

            Application::factory()->create([
                'user_id' => $user->id,
                'first_name' => $user->name ? explode(' ', $user->name)[0] : 'First',
                'last_name' => $user->name ? (explode(' ', $user->name)[1] ?? 'Last') : 'Last',
                'email' => $user->email,
                'program' => $programs[array_rand($programs)], // Pick a random program
                'status' => $statuses[array_rand($statuses)], // Pick a random status
                // The factory will automatically fill in other random details
            ]);
        }
    }
}
