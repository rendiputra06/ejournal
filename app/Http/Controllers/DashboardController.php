<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Manuscript;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User; // Added
use App\Models\Issue; // Added
use Illuminate\Support\Facades\DB; // Added

class DashboardController extends Controller
{
    /**
     * Unified dashboard.
     */
    public function index()
    {
        $user = Auth::user();
        $data = [];

        // Common Data for All Roles
        $data['common'] = [
            'announcements' => [
                [
                    'id' => 1,
                    'title' => 'Call for Papers: Special Issue on AI',
                    'date' => now()->subDays(2)->format('M d, Y'),
                    'content' => 'We are inviting submissions for our upcoming special issue...'
                ],
                [
                    'id' => 2,
                    'title' => 'System Maintenance Scheduled',
                    'date' => now()->subDays(5)->format('M d, Y'),
                    'content' => 'The platform will undergo maintenance on Sunday...'
                ],
                [
                    'id' => 3,
                    'title' => 'New Reviewer Guidelines',
                    'date' => now()->subWeeks(1)->format('M d, Y'),
                    'content' => 'Updated guidelines for peer review process are now available...'
                ]
            ],
            'latestArticles' => Manuscript::where('status', 'published')
                ->orderBy('updated_at', 'desc')
                ->limit(3)
                ->with('authors') // Ensure authors are loaded if needed
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
            $activityData = Manuscript::select(
                DB::raw('count(id) as activity'),
                DB::raw("DATE_FORMAT(created_at, '%b') as month"),
                DB::raw('MAX(created_at) as created_at')
            )
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('month')
                ->orderBy('created_at')
                ->get();

            $months = [];
            for ($i = 5; $i >= 0; $i--) {
                $months[] = now()->subMonths($i)->format('M');
            }

            $activityChart = [];
            foreach ($months as $m) {
                $found = $activityData->firstWhere('month', $m);
                $activityChart[] = [
                    'month' => $m,
                    'activity' => $found ? $found->activity : 0
                ];
            }

            $data['manager'] = [
                'stats' => [
                    'totalUsers' => User::count(),
                    'publishedIssues' => Issue::where('status', 'published')->count(),
                    'totalSubmissions' => Manuscript::count(),
                ],
                'activityData' => $activityChart
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
                    'overdueReviews' => 0,
                ],
                'pendingAssignments' => Manuscript::with(['authors' => function ($q) {
                    $q->where('is_primary', true);
                }])
                    ->where('status', 'submitted')
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(function ($m) {
                        return [
                            'id' => $m->id,
                            'title' => $m->title,
                            'received' => $m->created_at->diffForHumans(),
                            'author' => $m->authors->first()->name ?? 'Unknown',
                        ];
                    }),
                'decisionData' => [
                    ['status' => 'Accepted', 'count' => $accepted, 'color' => '#10b981'],
                    ['status' => 'Revision', 'count' => $revision, 'color' => '#3b82f6'],
                    ['status' => 'Rejected', 'count' => $rejected, 'color' => '#ef4444'],
                ]
            ];
        }

        // 3. Author Data
        if ($user->hasRole('author')) {
            $activityData = Manuscript::select(
                DB::raw('count(id) as activity'),
                DB::raw("DATE_FORMAT(created_at, '%b') as month"),
                DB::raw('MAX(created_at) as created_at')
            )
                ->where('user_id', Auth::id())
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('month')
                ->orderBy('created_at')
                ->get();

            $months = [];
            for ($i = 5; $i >= 0; $i--) {
                $months[] = now()->subMonths($i)->format('M');
            }

            $activityChart = [];
            foreach ($months as $m) {
                $found = $activityData->firstWhere('month', $m);
                $activityChart[] = [
                    'month' => $m,
                    'activity' => $found ? $found->activity : 0
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
                        ->where('status', 'final_decision')
                        ->count(),
                ],
                'activityData' => $activityChart
            ];
        }

        // 4. Reviewer Data
        if ($user->hasRole('reviewer')) {
            $data['reviewer'] = true;
        }

        // 5. Reader Data
        if ($user->hasRole('reader') || $user->hasRole('admin')) { // Admin also gets reader view capabilities if desired, or mostly just for the role check
             $data['reader'] = [
                'latestIssues' => Issue::where('status', 'published')
                    ->orderBy('year', 'desc')
                    ->limit(3)
                    ->get(),
                'recommendedArticles' => Manuscript::where('status', 'published')
                    ->inRandomOrder()
                    ->limit(5)
                    ->get()
                    ->map(function ($m) {
                        return [
                            'id' => $m->id,
                            'title' => $m->title,
                            'abstract' => \Illuminate\Support\Str::limit($m->abstract, 100),
                            'author' => $m->authors->first()->name ?? 'Unknown',
                        ];
                    })
             ];
        }

        return Inertia::render('dashboard/index', [
            'roles' => $user->getRoleNames(),
            'data' => $data
        ]);
    }
}
