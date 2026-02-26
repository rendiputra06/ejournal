<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToJournal;

class Visitor extends Model
{
    use BelongsToJournal;

    protected $fillable = [
        'journal_id',
        'ip_address',
        'user_agent',
        'path',
    ];
}
