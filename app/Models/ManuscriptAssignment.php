<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ManuscriptAssignment extends Model
{
    protected $fillable = [
        'manuscript_id',
        'user_id',
        'role',
        'status',
        'due_date',
        'notes',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(Manuscript::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function review(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(ManuscriptReview::class, 'assignment_id');
    }
}
