<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Volume extends Model
{
    protected $fillable = [
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
