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
        Schema::create('manuscript_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained('manuscript_assignments')->cascadeOnDelete();
            $table->integer('relevance_score');
            $table->integer('novelty_score');
            $table->integer('methodology_score');
            $table->text('comment_for_author')->nullable();
            $table->text('comment_for_editor')->nullable();
            $table->string('recommendation'); // accept, minor_revision, major_revision, reject
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manuscript_reviews');
    }
};
