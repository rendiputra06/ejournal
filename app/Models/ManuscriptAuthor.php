<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ManuscriptAuthor extends Model
{
    protected $fillable = [
        'manuscript_id',
        'name',
        'email',
        'affiliation',
        'orcid',
        'is_primary',
        'order',
    ];

    public function manuscript(): BelongsTo
    {
        return $this->belongsTo(Manuscript::class);
    }
}
