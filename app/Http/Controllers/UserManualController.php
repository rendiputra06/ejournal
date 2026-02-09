<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserManualController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->roles->first()?->name ?? 'reader';

        // Map internal role names to guide tab values if necessary
        $roleMap = [
            'journal-manager' => 'manager',
            'editor' => 'editor',
            'reviewer' => 'reviewer',
            'author' => 'author',
            'reader' => 'reader',
            'admin' => 'admin',
        ];

        $userRole = $roleMap[$role] ?? 'reader';

        return Inertia::render('guides/Index', [
            'userRole' => $userRole
        ]);
    }
}
