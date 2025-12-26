<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SettingApp extends Model
{
    protected $table = 'settingapp';

    protected $fillable = [
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
    ];

    protected $casts = [
        'seo' => 'array',
    ];
}
