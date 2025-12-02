<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            // Adding the optional Facebook link
            $table->string('facebook_link')->nullable()->after('contact_number');

            // Adding a specific column for interview schedule (for Phase 2)
            $table->dateTime('interview_schedule')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn('facebook_link');
            $table->dropColumn('interview_schedule');
        });
    }
};
