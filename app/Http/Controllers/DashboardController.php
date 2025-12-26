<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Manuscript;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * General dashboard.
     */
    public function index()
    {
        return Inertia::render('dashboard');
    }

    /**
     * Author dashboard with submission statistics.
     */
    public function author()
    {
        $manuscripts = Manuscript::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $stats = [
            'total' => Manuscript::where('user_id', Auth::id())->count(),
            'active' => Manuscript::where('user_id', Auth::id())
                ->whereIn('status', ['submitted', 'screening', 'reviewing'])
                ->count(),
            'published' => Manuscript::where('user_id', Auth::id())
                ->where('status', 'final_decision')
                ->count(),
        ];

        return Inertia::render('dashboard/author', [
            'recentSubmissions' => $manuscripts,
            'stats' => $stats
        ]);
    }

    /**
     * Manager dashboard.
     */
    public function manager()
    {
        return Inertia::render('dashboard/manager');
    }

    /**
     * Editor dashboard.
     */
    public function editor()
    {
        return Inertia::render('dashboard/editor');
    }

    /**
     * Reviewer dashboard.
     */
    public function reviewer()
    {
        return Inertia::render('dashboard/reviewer');
    }
}
