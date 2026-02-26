<?php

namespace App\Traits;

use App\Models\Journal;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToJournal
{
    protected static function booted()
    {
        static::addGlobalScope('journal', function (Builder $builder) {
            if (app()->bound('current_journal')) {
                $builder->where('journal_id', app('current_journal')->id);
            }
        });

        static::creating(function ($model) {
            if (app()->bound('current_journal')) {
                $model->journal_id = $model->journal_id ?? app('current_journal')->id;
            }
        });
    }

    public function journal(): BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }
}
