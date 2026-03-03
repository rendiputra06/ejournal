<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SettingApp extends Model
{
    use \App\Traits\HasJournal;

    protected $table = 'settingapp';

    protected $fillable = [
        'journal_id',
        'nama_app',
        'deskripsi',
        'logo',
        'favicon',
        'warna',
        'seo',
        'mail_transport',
        'mail_host',
        'mail_port',
        'mail_username',
        'mail_password',
        'mail_encryption',
        'mail_from_address',
        'mail_from_name',
        'guidelines',
        'aims_scope',
        'peer_review_process',
        'open_access_policy',
    ];


    protected $casts = [
        'seo' => 'array',
    ];
}
