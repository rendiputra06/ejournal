<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToJournal;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Volume extends Model
{
    use BelongsToJournal;

    protected $fillable = [
        'journal_id',
        'number',
        'description',
        'year',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }
}
