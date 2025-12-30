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
        // Add the missing columns for the required files
        if (!Schema::hasColumn('applications', 'valid_id')) {
            $table->string('valid_id')->nullable()->after('facebook_link');
        }
        if (!Schema::hasColumn('applications', 'indigency_cert')) {
            $table->string('indigency_cert')->nullable()->after('valid_id');
        }
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
