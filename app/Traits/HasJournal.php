<?php

namespace App\Traits;

use App\Models\Journal;
use App\Models\Scopes\JournalScope;

trait HasJournal
{
    /**
     * Boot the trait.
     */
    public static function bootHasJournal(): void
    {
        static::addGlobalScope(new JournalScope());

        static::creating(function ($model) {
            if (app()->bound(Journal::class)) {
                $journal = app(Journal::class);
                if (!$model->journal_id) {
                    $model->journal_id = $journal->id;
                }
            }
        });
    }

    /**
     * Get the journal that owns this model.
     */
    public function journal(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Journal::class);
    }
}
