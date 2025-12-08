<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Application;
use Carbon\Carbon;

class ApplicationSeeder extends Seeder
{
    public function run()
    {
        // 1. Ensure dummy file exists
        if (!Storage::disk('public')->exists('dummy.pdf')) {
            $this->command->error("⚠️  Please put a small file named 'dummy.pdf' in 'storage/app/public/' first!");
            return;
        }

        // 2. Realistic Filipino Names & Scenarios (Total: 22)
        $applicants = [
            // --- Previous Set ---
            ['name' => 'Ramon Bautista', 'program' => 'Chemotherapy', 'barangay' => 'Banica', 'incident_date' => '2025-11-20'],
            ['name' => 'Luzviminda Garcia', 'program' => 'Medicine Assistance', 'barangay' => 'Baybay', 'incident_date' => '2025-12-01'],
            ['name' => 'Eduardo Manalo', 'program' => 'Funeral Assistance', 'barangay' => 'Cogon', 'incident_date' => '2025-12-05'],
            ['name' => 'Maria Theresa Cruz', 'program' => 'Laboratory Tests', 'barangay' => 'Poblacion I', 'incident_date' => '2025-12-02'],
            ['name' => 'Jun Jun Reyes', 'program' => 'Anti-Rabies Vaccine Treatment', 'barangay' => 'Tiza', 'incident_date' => '2025-12-07'],
            ['name' => 'Analyn Santos', 'program' => 'Hospitalization', 'barangay' => 'Lanot', 'incident_date' => '2025-11-28'],
            ['name' => 'Rolando Dantes', 'program' => 'Diagnostic Blood Tests', 'barangay' => 'Milibili', 'incident_date' => '2025-12-03'],
            ['name' => 'Jocelyn Fernandez', 'program' => 'Medicine Assistance', 'barangay' => 'Tanque', 'incident_date' => '2025-12-06'],
            ['name' => 'Ricardo Dalisay', 'program' => 'Hospitalization', 'barangay' => 'Bago', 'incident_date' => '2025-11-15'],
            ['name' => 'Marites Villamor', 'program' => 'Chemotherapy', 'barangay' => 'Punta Tabuc', 'incident_date' => '2025-11-30'],
            ['name' => 'Karding Talisay', 'program' => 'Funeral Assistance', 'barangay' => 'Dayao', 'incident_date' => '2025-12-04'],
            ['name' => 'Bea Alonzo', 'program' => 'Laboratory Tests', 'barangay' => 'Inzo Arnaldo Village', 'incident_date' => '2025-12-08'],

            // --- NEW BATCH (10 More) ---
            ['name' => 'Fernando Poe Jr', 'program' => 'Hospitalization', 'barangay' => 'Bolo', 'incident_date' => '2025-12-05'],
            ['name' => 'Catriona Gray', 'program' => 'Medicine Assistance', 'barangay' => 'Culasi', 'incident_date' => '2025-12-06'],
            ['name' => 'Manny Pacquiao', 'program' => 'Anti-Rabies Vaccine Treatment', 'barangay' => 'Libas', 'incident_date' => '2025-12-07'],
            ['name' => 'Regine Velasquez', 'program' => 'Diagnostic Blood Tests', 'barangay' => 'Loctugan', 'incident_date' => '2025-12-08'],
            ['name' => 'Jose Rizal', 'program' => 'Chemotherapy', 'barangay' => 'Lonoy', 'incident_date' => '2025-11-25'],
            ['name' => 'Andres Bonifacio', 'program' => 'Funeral Assistance', 'barangay' => 'Dumolog', 'incident_date' => '2025-12-01'],
            ['name' => 'Sarah Geronimo', 'program' => 'Laboratory Tests', 'barangay' => 'Dinginan', 'incident_date' => '2025-12-02'],
            ['name' => 'Vice Ganda', 'program' => 'Medicine Assistance', 'barangay' => 'Gabuan', 'incident_date' => '2025-12-03'],
            ['name' => 'Coco Martin', 'program' => 'Hospitalization', 'barangay' => 'Mongpong', 'incident_date' => '2025-12-04'],
            ['name' => 'Anne Curtis', 'program' => 'Anti-Rabies Vaccine Treatment', 'barangay' => 'Oloyan', 'incident_date' => '2025-12-05'],
        ];

        foreach ($applicants as $data) {
            $parts = explode(' ', $data['name']);
            $lastName = array_pop($parts);
            $firstName = implode(' ', $parts);
            // Unique email trick
            $email = strtolower(str_replace(' ', '', $firstName)) . '.' . strtolower($lastName) . rand(1,99) . '@example.com';

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'type' => 'user',
                    'contact_number' => '09' . mt_rand(100000000, 999999999),
                ]
            );

            // Dummy File Setup
            $uniqueId = uniqid();
            $validIdPath = "attachments/{$user->id}_{$uniqueId}_valid_id.pdf";
            $indigencyPath = "attachments/{$user->id}_{$uniqueId}_indigency.pdf";
            $reqPath = "attachments/{$user->id}_{$uniqueId}_req.pdf";

            // Quietly copy files
            try {
                Storage::disk('public')->copy('dummy.pdf', $validIdPath);
                Storage::disk('public')->copy('dummy.pdf', $indigencyPath);
                Storage::disk('public')->copy('dummy.pdf', $reqPath);
            } catch (\Exception $e) {
                // Ignore if dummy.pdf missing during repeated runs
            }

            Application::create([
                'user_id' => $user->id,
                'program' => $data['program'],
                'date_of_incident' => $data['incident_date'],
                'first_name' => $firstName,
                'middle_name' => '',
                'last_name' => $lastName,
                'suffix_name' => '',
                'sex' => mt_rand(0, 1) ? 'Male' : 'Female',
                'civil_status' => 'Single',
                'birth_date' => '1985-05-15',
                'house_no' => mt_rand(1, 999) . ' St.',
                'barangay' => $data['barangay'],
                'city' => 'Roxas City',
                'contact_number' => $user->contact_number,
                'email' => $user->email,
                'facebook_link' => 'facebook.com/' . str_replace(' ', '', $firstName),
                'status' => 'Pending',
                'amount_released' => null,
                'remarks' => null,
                'attachments' => [
                    'valid_id' => $validIdPath,
                    'indigency_cert' => $indigencyPath,
                    '0' => $reqPath
                ]
            ]);
        }

        $this->command->info('✅ Successfully seeded ' . count($applicants) . ' applicants!');
    }
}
