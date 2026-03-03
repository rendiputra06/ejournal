<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds Conflict of Interest (COI) fields to manuscript_assignments table.
     */
    public function up(): void
    {
        Schema::table('manuscript_assignments', function (Blueprint $table) {
            $table->boolean('coi_declared')->default(false)->after('notes')
                ->comment('Whether the reviewer has submitted a COI declaration');
            $table->boolean('coi_has_conflict')->nullable()->after('coi_declared')
                ->comment('True = reviewer declared conflict, false = no conflict, null = not yet declared');
            $table->timestamp('coi_declared_at')->nullable()->after('coi_has_conflict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manuscript_assignments', function (Blueprint $table) {
            $table->dropColumn(['coi_declared', 'coi_has_conflict', 'coi_declared_at']);
        });
    }
};
