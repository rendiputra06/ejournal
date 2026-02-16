<?php

namespace App\Http\Controllers;

use App\Models\Action;
use App\Models\Announcement;
use App\Models\Issue;
use App\Models\Manuscript;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicJournalController extends Controller
{
    /**
     * Landing Page.
     */
    public function welcome()
    {
        // 1. Current Issue
        $currentIssue = Issue::with(['manuscripts' => function ($q) {
                $q->where('status', 'published');
            }, 'manuscripts.authors'])
            ->where('status', 'published')
            ->orderBy('year', 'desc')
            ->orderBy('number', 'desc') // Assuming number is reliable for ordering
            ->first();

        // 2. Announcements
        $announcements = Announcement::where('published_at', '<=', now())
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get();

        // 3. Stats (Optional)
        $stats = [
            'totalArticles' => Manuscript::where('status', 'published')->count(),
            'totalAuthors' => User::role('author')->count(),
            'totalVisitors' => \App\Models\Visitor::count(),
            // Add more stats as needed
        ];

        return Inertia::render('welcome', [
            'currentIssue' => $currentIssue,
            'announcements' => $announcements,
            'stats' => $stats,
        ]);
    }

    /**
     * Current Issue Page.
     */
    public function current()
    {
        $currentIssue = Issue::with(['manuscripts' => function ($q) {
                $q->where('status', 'published');
            }, 'manuscripts.authors'])
            ->where('status', 'published')
            ->orderBy('year', 'desc')
            ->orderBy('number', 'desc')
            ->first();

        return Inertia::render('journal/current', [
            'issue' => $currentIssue,
        ]);
    }

    /**
     * Archives Page.
     */
    public function archives()
    {
        $issues = Issue::where('status', 'published')
            ->orderBy('year', 'desc')
            ->orderBy('number', 'desc')
            ->get()
            ->groupBy('year');

         return Inertia::render('journal/archives', [
            'archives' => $issues
         ]);
    }

    /**
     * Announcements Page.
     */
    public function announcements()
    {
        return Inertia::render('journal/announcements', [
             'announcements' => Announcement::where('published_at', '<=', now())
                ->orderBy('published_at', 'desc')
                ->paginate(10)
        ]);
    }

    /**
     * Search Articles.
     */
    public function search(Request $request)
    {
        $query = $request->input('q');
        
        $results = Manuscript::where('status', 'published') // or final_decision
            ->where(function($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('abstract', 'like', "%{$query}%")
                  ->orWhere('keywords', 'like', "%{$query}%");
            })
            ->with('authors', 'issue')
            ->paginate(10);

        return Inertia::render('journal/search', [
            'results' => $results,
            'query' => $query
        ]);
    }

    /**
     * About Page.
     */
    public function about()
    {
        $setting = \App\Models\SettingApp::first();
        return Inertia::render('journal/about', [
            'guidelines' => $setting?->guidelines
        ]);
    }

    /**
     * Article Detail Page.
     */
    public function article(Manuscript $manuscript)
    {
        if ($manuscript->status !== 'published') {
            abort(404);
        }

        $manuscript->load(['authors', 'issue.volume']);

        return Inertia::render('journal/article', [
            'article' => $manuscript,
        ]);
    }
}
