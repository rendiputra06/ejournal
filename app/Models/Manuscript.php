<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Manuscript extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'user_id',
        'section_editor_id',
        'issue_id',
        'external_id',
        'title',
        'abstract',
        'keywords',
        'category',
        'status',
        'page_start',
        'page_end',
        'doi',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sectionEditor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'section_editor_id');
    }

    public function issue(): BelongsTo
    {
        return $this->belongsTo(Issue::class);
    }

    public function authors(): HasMany
    {
        return $this->hasMany(ManuscriptAuthor::class)->orderBy('order');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(ManuscriptAssignment::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('manuscript_file')
            ->singleFile();
        
        $this->addMediaCollection('supplementary_files');
    }
}
