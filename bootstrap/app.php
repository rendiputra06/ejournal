<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\ShareMenus;
use App\Http\Middleware\CheckMenuPermission;
use App\Http\Middleware\IdentifyJournal;
use App\Http\Middleware\LogVisitor;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            LogVisitor::class,
        ]);

        $middleware->trustProxies(at: '*');

        $middleware->alias([
            'menu.permission' => CheckMenuPermission::class,
            'journal.identify' => IdentifyJournal::class,
            'menus.share' => ShareMenus::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Illuminate\Routing\Exceptions\InvalidSignatureException $e, \Illuminate\Http\Request $request) {
            if ($request->routeIs('verification.verify')) {
                return redirect()->route('verification.notice')
                    ->with('error', 'Link verifikasi telah kedaluwarsa atau tidak valid. Silakan kirim ulang email verifikasi.');
            }
        });
    })->create();
