<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Issue extends Model
{
    protected $fillable = [
        'volume_id',
        'number',
        'title',
        'year',
        'month',
        'status',
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
