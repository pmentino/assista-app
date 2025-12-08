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
            // Add 'type' if it doesn't exist
            if (!Schema::hasColumn('users', 'type')) {
                $table->string('type')->default('user')->after('email'); // 'admin' or 'user'
            }

            // Add 'contact_number' if it doesn't exist (safety check)
            if (!Schema::hasColumn('users', 'contact_number')) {
                $table->string('contact_number')->nullable()->after('password');
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
