<?php

namespace App\Http\Controllers;

use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VisitorController extends Controller
{
    /**
     * Display visitor analytics page.
     */
    public function index(Request $request)
    {
        // Journal scoping: use the active journal from the app container (set by JournalMiddleware)
        $journalId = null;
        if (app()->bound(\App\Models\Journal::class)) {
            $journalId = app(\App\Models\Journal::class)->id;
        }

        $scopeQuery = fn($q) => $journalId ? $q->where('journal_id', $journalId) : $q;

        // Date range filter
        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));
        $country = $request->input('country');
        $search = $request->input('search');

        // Base query
        $query = Visitor::withoutGlobalScopes()
            ->when($journalId, fn($q) => $q->where('journal_id', $journalId))
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);

        // Apply filters
        if ($country) {
            $query->where('country', $country);
        }

        if ($search) {
            $query->where('ip_address', 'like', "%{$search}%");
        }

        // Statistics
        $baseStats = Visitor::withoutGlobalScopes()
            ->when($journalId, fn($q) => $q->where('journal_id', $journalId))
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);

        $stats = [
            'totalVisitors' => (clone $baseStats)->count(),
            'uniqueIPs' => (clone $baseStats)->distinct('ip_address')->count('ip_address'),
            'topCountry' => (clone $baseStats)
                ->select('country', DB::raw('count(*) as count'))
                ->groupBy('country')
                ->orderBy('count', 'desc')
                ->first(),
            'todayVisitors' => Visitor::withoutGlobalScopes()
                ->when($journalId, fn($q) => $q->where('journal_id', $journalId))
                ->whereDate('created_at', now())
                ->count(),
        ];

        // Visitors over time
        $visitorsOverTime = Visitor::withoutGlobalScopes()
            ->when($journalId, fn($q) => $q->where('journal_id', $journalId))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top countries
        $topCountries = Visitor::withoutGlobalScopes()
            ->when($journalId, fn($q) => $q->where('journal_id', $journalId))
            ->select('country', 'country_code', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->groupBy('country', 'country_code')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // Top cities
        $topCities = Visitor::withoutGlobalScopes()
            ->when($journalId, fn($q) => $q->where('journal_id', $journalId))
            ->select('city', 'country', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->groupBy('city', 'country')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // Top referrals
        $topReferrals = Visitor::withoutGlobalScopes()
            ->when($journalId, fn($q) => $q->where('journal_id', $journalId))
            ->select('referral', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->whereNotNull('referral')
            ->where('referral', '!=', '')
            ->groupBy('referral')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // Paginated visitor list
        $visitors = $query
            ->when($country, fn($q) => $q->where('country', $country))
            ->when($search, fn($q) => $q->where('ip_address', 'like', "%{$search}%"))
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        // All countries for filter dropdown (scoped to journal)
        $countries = Visitor::withoutGlobalScopes()
            ->when($journalId, fn($q) => $q->where('journal_id', $journalId))
            ->select('country')
            ->distinct()
            ->whereNotNull('country')
            ->orderBy('country')
            ->pluck('country');

        return Inertia::render('analytics/visitors/index', [
            'visitors' => $visitors,
            'stats' => $stats,
            'visitorsOverTime' => $visitorsOverTime,
            'topCountries' => $topCountries,
            'topCities' => $topCities,
            'topReferrals' => $topReferrals,
            'countries' => $countries,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'country' => $country,
                'search' => $search,
            ],
        ]);
    }
}
