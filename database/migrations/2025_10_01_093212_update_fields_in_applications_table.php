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
            // Check if columns exist before adding them to be safe
            if (!Schema::hasColumn('applications', 'middle_name')) {
                $table->string('middle_name')->nullable()->after('first_name');
            }
            if (!Schema::hasColumn('applications', 'suffix_name')) {
                $table->string('suffix_name')->nullable()->after('last_name');
            }
            if (!Schema::hasColumn('applications', 'sex')) {
                $table->string('sex')->after('suffix_name');
            }
            if (!Schema::hasColumn('applications', 'civil_status')) {
                $table->string('civil_status')->after('sex');
            }
            if (!Schema::hasColumn('applications', 'house_no')) {
                $table->string('house_no')->nullable()->after('birth_date');
            }
            if (!Schema::hasColumn('applications', 'barangay')) {
                $table->string('barangay')->after('house_no');
            }
            if (!Schema::hasColumn('applications', 'city')) {
                $table->string('city')->after('barangay');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn([
                'middle_name',
                'suffix_name',
                'sex',
                'civil_status',
                'house_no',
                'barangay',
                'city',
            ]);
        });
    }
};
