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
            // 1. Add 'is_active' for the Deactivation feature (Default: true)
            if (!Schema::hasColumn('users', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('password');
            }

            // 2. Safety Check: Ensure 'type' exists for Role Management
            if (!Schema::hasColumn('users', 'type')) {
                $table->string('type')->default('user')->after('email');
                // Default to 'user'. You can manually change Admin to 'admin' later.
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'is_active')) {
                $table->dropColumn('is_active');
            }
            // We usually don't drop 'type' in down() if it might be crucial,
            // but for strict reversibility:
            if (Schema::hasColumn('users', 'type')) {
                $table->dropColumn('type');
            }
        });
    }
};
