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
    Schema::table('assistance_programs', function (Blueprint $table) {
        // Stores: ["Valid ID", "Barangay Cert", "Medical Abstract"]
        $table->json('requirements')->nullable()->after('description');
    });
}

public function down(): void
{
    Schema::table('assistance_programs', function (Blueprint $table) {
        $table->dropColumn('requirements');
    });
}
};
