<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->string('program')->after('user_id');
            $table->date('date_of_incident')->nullable()->after('program');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('suffix_name')->nullable()->after('last_name');
            $table->string('sex')->after('suffix_name');
            $table->string('civil_status')->after('sex');
            $table->string('house_no')->nullable()->after('birth_date');
            $table->string('barangay')->after('house_no');
            $table->string('city')->after('barangay');
            $table->string('email')->after('contact_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            // To make the migration reversible
            $table->dropColumn(['program', 'date_of_incident', 'middle_name', 'suffix_name', 'sex', 'civil_status', 'house_no', 'barangay', 'city', 'email']);
        });
    }
};
