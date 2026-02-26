<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToJournal;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Issue extends Model
{
    use BelongsToJournal;

    protected $fillable = [
        'journal_id',
        'volume_id',
        'number',
        'title',
        'year',
        'month',
        'status',
        'cover_image_url',
    ];

    public function volume(): BelongsTo
    {
        return $this->belongsTo(Volume::class);
    }

    public function manuscripts(): HasMany
    {
        return $this->hasMany(Manuscript::class);
    }
}
