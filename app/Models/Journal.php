<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo',
        'header_image',
        'is_active',
        'settings',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'settings' => 'array',
    ];

    public function volumes()
    {
        return $this->hasMany(Volume::class);
    }

    public function issues()
    {
        return $this->hasMany(Issue::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function manuscripts()
    {
        return $this->hasMany(Manuscript::class);
    }
}
