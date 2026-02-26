<?php

namespace App\Http\Middleware;

use App\Models\SettingApp;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $journal = app()->bound('current_journal') ? app('current_journal') : null;
        $setting = SettingApp::first();

        $appName = $journal?->name ?? $setting?->nama_app ?? config('app.name');
        $favicon = $journal?->favicon ?? $setting?->favicon;

        return array_merge(parent::share($request), [
            'appName' => $appName,
            'favicon' => $favicon,
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'journal' => $journal,
            'setting' => $setting,
        ]);
    }
}
