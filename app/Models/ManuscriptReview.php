<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ManuscriptReview extends Model
{
    protected $fillable = [
        'assignment_id',
        'relevance_score',
        'novelty_score',
        'methodology_score',
        'comment_for_author',
        'comment_for_editor',
        'recommendation',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function assignment(): BelongsTo
    {
        return $this->belongsTo(ManuscriptAssignment::class);
    }
}
