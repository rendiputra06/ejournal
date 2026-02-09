<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\SettingApp;
use Illuminate\Http\Request;

class SettingAppController extends Controller
{
    public function edit()
    {
        $setting = SettingApp::first();
        return Inertia::render('settingapp/Form', ['setting' => $setting]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'nama_app'          => 'required|string|max:255',
            'deskripsi'         => 'nullable|string',
            'logo'              => 'nullable|file|image|max:2048',
            'favicon'           => 'nullable|file|image|max:1024',
            'warna'             => 'nullable|string|max:20',
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

        $setting = SettingApp::firstOrNew();

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

        $setting->fill($data)->save();

        return redirect()->back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
