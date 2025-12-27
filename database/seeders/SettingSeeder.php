<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // System Control
            ['key' => 'accepting_applications', 'value' => '1', 'label' => 'Accepting Online Applications', 'type' => 'boolean'],
            ['key' => 'system_announcement', 'value' => '', 'label' => 'Global Announcement Banner', 'type' => 'text'],

            // Signatories (For Reports & Claim Stubs)
            ['key' => 'signatory_mayor', 'value' => 'RONNIE T. DADIVAS', 'label' => 'City Mayor', 'type' => 'text'],
            ['key' => 'signatory_cswdo_head', 'value' => 'PERSEUS L. CORDOVA', 'label' => 'CSWDO Head', 'type' => 'text'],
            ['key' => 'signatory_social_worker', 'value' => 'BIVIEN B. DELA CRUZ, RSW', 'label' => 'Social Worker / Verifier', 'type' => 'text'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
