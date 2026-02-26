<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class SettingAppController extends Controller
{
    public function edit()
    {
        $setting = app('current_journal');
        return Inertia::render('settingapp/Form', ['setting' => $setting]);
    }

    public function update(Request $request)
    {
        $journal = app('current_journal');

        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'description'       => 'nullable|string',
            'logo'              => 'nullable|image|max:2048',
            'favicon'           => 'nullable|image|max:1024',
            'theme_color'       => 'nullable|string|max:20',
            'seo'               => 'nullable|array',
            'mail_transport'    => 'nullable|string|max:50',
            'mail_host'         => 'nullable|string|max:255',
            'mail_port'         => 'nullable|string|max:10',
            'mail_username'     => 'nullable|string|max:255',
            'mail_password'     => 'nullable|string|max:255',
            'mail_encryption'   => 'nullable|string|max:20',
            'mail_from_address' => 'nullable|email|max:255',
            'mail_from_name'    => 'nullable|string|max:255',
            'guidelines'        => 'nullable|string',
        ]);

        // Handle File Uploads
        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('logo', 'public');
        } else {
            unset($data['logo']);
        }

        if ($request->hasFile('favicon')) {
            $data['favicon'] = $request->file('favicon')->store('favicon', 'public');
        } else {
            unset($data['favicon']);
        }

        // Safety: If password is not provided in request, don't overwrite existing
        if (empty($data['mail_password'])) {
            unset($data['mail_password']);
        }

        $journal->update($data);

        return redirect()->back()->with('success', 'Pengaturan jurnal berhasil disimpan.');
    }
}
