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
        // Personal Info
        if (!Schema::hasColumn('applications', 'sex')) $table->string('sex')->nullable();
        if (!Schema::hasColumn('applications', 'civil_status')) $table->string('civil_status')->nullable();
        if (!Schema::hasColumn('applications', 'birth_date')) $table->date('birth_date')->nullable();

        // Address
        if (!Schema::hasColumn('applications', 'house_no')) $table->string('house_no')->nullable();
        if (!Schema::hasColumn('applications', 'barangay')) $table->string('barangay')->nullable();
        if (!Schema::hasColumn('applications', 'city')) $table->string('city')->default('Roxas City');

        // Contact
        if (!Schema::hasColumn('applications', 'facebook_link')) $table->string('facebook_link')->nullable();

        // Names (Just in case they were missing)
        if (!Schema::hasColumn('applications', 'middle_name')) $table->string('middle_name')->nullable();
        if (!Schema::hasColumn('applications', 'suffix_name')) $table->string('suffix_name')->nullable();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            //
        });
    }
};
