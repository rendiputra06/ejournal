<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    use \App\Traits\HasJournal;

    protected $fillable = [
        'journal_id',
        'ip_address',
        'user_agent',
        'country',
        'country_code',
        'city',
        'referral',
    ];

}
