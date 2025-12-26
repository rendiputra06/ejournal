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
        Schema::create('manuscripts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('external_id')->unique()->nullable(); // e.g. JRNL-2025-001
            $table->string('title');
            $table->text('abstract');
            $table->string('keywords')->nullable();
            $table->string('category')->default('research'); // research, review, case_report
            $table->string('status')->default('draft'); // draft, submitted, screening, reviewing, final_decision
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manuscripts');
    }
};
