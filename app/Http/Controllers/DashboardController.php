<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Issue;
use App\Models\Manuscript;
use App\Models\ManuscriptAssignment;
use App\Models\User;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $data = [
            'announcements' => Announcement::where('published_at', '<=', now())
                ->orderBy('published_at', 'desc')
                ->limit(5)
                ->get(),
            'latestArticles' => Manuscript::where('status', 'published')
                ->orderBy('updated_at', 'desc')
                ->limit(3)
                ->with('authors')
                ->get()
                ->map(function ($m) {
                    return [
                        'id' => $m->id,
                        'title' => $m->title,
                        'published_at' => $m->updated_at->format('M d, Y'),
                        'author' => $m->authors->first()->name ?? 'Unknown Author'
                    ];
                })
        ];

        // 1. Manager & Admin Data
        if ($user->hasRole('journal-manager') || $user->hasRole('admin')) {
            $activityData = Manuscript::where('created_at', '>=', now()->subMonths(6))
                ->get()
                ->groupBy(fn($m) => $m->created_at->format('M'));

            $months = [];
            for ($i = 5; $i >= 0; $i--) {
                $months[] = now()->subMonths($i)->format('M');
            }

            $activityChart = [];
            foreach ($months as $m) {
                $activityChart[] = [
                    'month' => $m,
                    'activity' => isset($activityData[$m]) ? $activityData[$m]->count() : 0
                ];
            }

            $visitorStats = Visitor::select('country', DB::raw('count(*) as count'))
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('country')
                ->orderBy('count', 'desc')
                ->limit(5)
                ->get();

            $data['manager'] = [
                'stats' => [
                    'totalUsers' => User::count(),
                    'publishedIssues' => Issue::where('status', 'published')->count(),
                    'totalSubmissions' => Manuscript::count(),
                    'totalVisitors' => Visitor::count(),
                ],
                'activityData' => $activityChart,
                'visitorData' => $visitorStats
            ];
        }

        // 2. Editor Data
        if ($user->hasRole('editor')) {
            $accepted = Manuscript::where('status', 'published')->orWhere('status', 'accepted')->count();
            $rejected = Manuscript::where('status', 'rejected')->count();
            $revision = Manuscript::where('status', 'draft')->count();

            $data['editor'] = [
                'stats' => [
                    'newSubmissions' => Manuscript::where('status', 'submitted')->count(),
                    'underReview' => Manuscript::where('status', 'reviewing')->count(),
                    'pendingDecisions' => Manuscript::whereIn('status', ['screening', 'review_completed'])->count(),
                    'overdueReviews' => ManuscriptAssignment::where('role', 'reviewer')
                        ->whereIn('status', ['pending', 'accepted'])
                        ->where('due_date', '<', now())
                        ->count(),
                ],
                'pendingAssignments' => Manuscript::with(['authors' => fn($q) => $q->where('is_primary', true)])
                    ->where('status', 'submitted')
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(fn($m) => [
                        'id' => $m->id,
                        'title' => $m->title,
                        'received' => $m->created_at->diffForHumans(),
                        'author' => $m->authors->first()->name ?? 'Unknown',
                    ]),
                'decisionData' => [
                    ['status' => 'Accepted', 'count' => $accepted, 'color' => '#10b981'],
                    ['status' => 'Revision', 'count' => $revision, 'color' => '#3b82f6'],
                    ['status' => 'Rejected', 'count' => $rejected, 'color' => '#ef4444'],
                ]
            ];
        }

        // 3. Author Data
        if ($user->hasRole('author')) {
            $activityData = Manuscript::where('user_id', Auth::id())
                ->where('created_at', '>=', now()->subMonths(6))
                ->get()
                ->groupBy(fn($m) => $m->created_at->format('M'));

            $months = [];
            for ($i = 5; $i >= 0; $i--) {
                $months[] = now()->subMonths($i)->format('M');
            }

            $activityChart = [];
            foreach ($months as $m) {
                $activityChart[] = [
                    'month' => $m,
                    'activity' => isset($activityData[$m]) ? $activityData[$m]->count() : 0
                ];
            }

            $data['author'] = [
                'recentSubmissions' => Manuscript::where('user_id', Auth::id())
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get(),
                'stats' => [
                    'total' => Manuscript::where('user_id', Auth::id())->count(),
                    'active' => Manuscript::where('user_id', Auth::id())
                        ->whereIn('status', ['submitted', 'screening', 'reviewing'])
                        ->count(),
                    'published' => Manuscript::where('user_id', Auth::id())
                        ->where('status', 'published')
                        ->count(),
                    'rejected' => Manuscript::where('user_id', Auth::id())
                        ->where('status', 'rejected')
                        ->count(),
                ],
                'activityData' => $activityChart
            ];
        }

        // 4. Reviewer Data
        if ($user->hasRole('reviewer')) {
            $assignments = ManuscriptAssignment::where('user_id', $user->id)
                ->where('role', 'reviewer')
                ->with('manuscript')
                ->get();

            $pending = $assignments->whereIn('status', ['pending', 'accepted']);
            $completed = $assignments->where('status', 'completed');
            $overdue = $pending->filter(fn($a) => $a->due_date && $a->due_date->isPast());

            $activityData = ManuscriptAssignment::where('user_id', $user->id)
                ->where('role', 'reviewer')
                ->where('status', 'completed')
                ->where('updated_at', '>=', now()->subMonths(6))
                ->get()
                ->groupBy(fn($a) => $a->updated_at->format('M'));

            $months = [];
            for ($i = 5; $i >= 0; $i--) {
                $months[] = now()->subMonths($i)->format('M');
            }

            $activityChart = [];
            foreach ($months as $m) {
                $activityChart[] = [
                    'month' => $m,
                    'activity' => isset($activityData[$m]) ? $activityData[$m]->count() : 0
                ];
            }

            $data['reviewer'] = [
                'stats' => [
                    'pendingReviews' => $pending->count(),
                    'completedReviews' => $completed->count(),
                    'overdueReviews' => $overdue->count(),
                    'activeInvitations' => $assignments->where('status', 'pending')->count(),
                ],
                'activeAssignments' => $pending->take(5)->map(fn($a) => [
                    'id' => $a->id,
                    'manuscript_id' => $a->manuscript_id,
                    'title' => $a->manuscript->title,
                    'due_date' => $a->due_date ? ($a->due_date instanceof \Carbon\Carbon ? $a->due_date->format('M d, Y') : $a->due_date) : 'No Date',
                    'status' => $a->status,
                ])->values(),
                'activityData' => $activityChart
            ];
        }

        // 5. Reader Data
        if ($user->hasRole('reader') || $user->hasRole('admin')) {
             $data['reader'] = [
                'latestIssues' => Issue::where('status', 'published')
                    ->orderBy('year', 'desc')
                    ->limit(3)
                    ->get(),
                'recommendedArticles' => Manuscript::where('status', 'published')
                    ->inRandomOrder()
                    ->limit(5)
                    ->get()
                    ->map(fn($m) => [
                        'id' => $m->id,
                        'title' => $m->title,
                        'abstract' => \Illuminate\Support\Str::limit($m->abstract, 100),
                        'author' => $m->authors->first()->name ?? 'Unknown',
                    ])
             ];
        }

        $roles = $user->getRoleNames()->toArray();
        if ($user->hasRole('admin') && !in_array('journal-manager', $roles)) {
            $roles[] = 'journal-manager';
        }

        return Inertia::render('dashboard/index', [
            'roles' => $roles,
            'data' => $data
        ]);
    }
}
