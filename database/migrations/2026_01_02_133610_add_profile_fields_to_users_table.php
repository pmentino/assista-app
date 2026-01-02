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
        if (!Schema::hasColumn('users', 'profile_photo_path')) $table->string('profile_photo_path', 2048)->nullable();
        if (!Schema::hasColumn('users', 'contact_number')) $table->string('contact_number')->nullable();
        if (!Schema::hasColumn('users', 'civil_status')) $table->string('civil_status')->nullable();
        if (!Schema::hasColumn('users', 'sex')) $table->string('sex')->nullable();
        if (!Schema::hasColumn('users', 'birth_date')) $table->date('birth_date')->nullable();
        if (!Schema::hasColumn('users', 'barangay')) $table->string('barangay')->nullable();
        if (!Schema::hasColumn('users', 'house_no')) $table->string('house_no')->nullable();
        if (!Schema::hasColumn('users', 'type')) $table->string('type')->default('user'); // For Admin/User roles
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
