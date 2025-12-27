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
    Schema::table('users', function (Blueprint $table) {

        // 1. Profile Photo (Check first)
        if (!Schema::hasColumn('users', 'profile_photo_path')) {
            $table->string('profile_photo_path', 2048)->nullable();
        }

        // 2. Contact Number
        if (!Schema::hasColumn('users', 'contact_number')) {
            $table->string('contact_number')->nullable();
        }

        // 3. Civil Status
        if (!Schema::hasColumn('users', 'civil_status')) {
            $table->string('civil_status')->nullable();
        }

        // 4. Sex
        if (!Schema::hasColumn('users', 'sex')) {
            $table->string('sex')->nullable();
        }

        // 5. Birth Date
        if (!Schema::hasColumn('users', 'birth_date')) {
            $table->date('birth_date')->nullable();
        }

        // 6. Address Fields
        if (!Schema::hasColumn('users', 'barangay')) {
            $table->string('barangay')->nullable();
        }
        if (!Schema::hasColumn('users', 'city')) {
            $table->string('city')->default('Roxas City');
        }
        if (!Schema::hasColumn('users', 'house_no')) {
            $table->string('house_no')->nullable();
        }
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
