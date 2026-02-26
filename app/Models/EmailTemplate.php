<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToJournal;

class EmailTemplate extends Model
{
    use BelongsToJournal;

    protected $fillable = [
        'journal_id',
        'key',
        'subject',
        'body',
    ];
}
