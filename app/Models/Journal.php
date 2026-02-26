<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Journal extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo',
        'favicon',
        'theme_color',
        'seo',
        'guidelines',
        'mail_transport',
        'mail_host',
        'mail_port',
        'mail_username',
        'mail_password',
        'mail_encryption',
        'mail_from_address',
        'mail_from_name',
        'is_active',
    ];

    protected $casts = [
        'seo' => 'array',
        'is_active' => 'boolean',
    ];

    public function volumes(): HasMany
    {
        return $this->hasMany(Volume::class);
    }

    public function announcements(): HasMany
    {
        return $this->hasMany(Announcement::class);
    }
}
