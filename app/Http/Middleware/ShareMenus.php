<?php

namespace App\Http\Middleware;

use App\Models\Menu;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShareMenus
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $journal = app()->bound('current_journal') ? app('current_journal') : null;

        Inertia::share('menus', function () use ($user, $journal) {
            if (!$user || !$journal) return [];

            // Ambil semua menu secara flat
            $allMenus = Menu::orderBy('order')->get();

            // Index berdasarkan ID
            $indexed = $allMenus->keyBy('id');

            // Recursive builder (filtered by permission)
            $buildTree = function ($parentId = null) use (&$buildTree, $indexed, $user, $journal) {
                return $indexed
                    ->filter(
                        fn($menu) =>
                        $menu->parent_id === $parentId &&
                            (!$menu->permission_name || $user->can($menu->permission_name))
                    )
                    ->map(function ($menu) use (&$buildTree, $journal) {
                        $menu->children = $buildTree($menu->id)->values();

                        // Dynamically adjust the route to include journal slug
                        if ($menu->route && $menu->route !== '#') {
                            $menu->url = "/j/{$journal->slug}" . (str_starts_with($menu->route, '/') ? '' : '/') . $menu->route;
                        } else {
                            $menu->url = $menu->route;
                        }

                        return $menu;
                    })
                    ->filter(
                        fn($menu) =>
                        $menu->url || $menu->children->isNotEmpty()
                    )
                    ->values();
            };

            return $buildTree();
        });

        return $next($request);
    }
}
