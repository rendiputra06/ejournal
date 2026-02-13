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
        // Date range filter
        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));
        $country = $request->input('country');
        $search = $request->input('search');

        // Base query
        $query = Visitor::whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);

        // Apply filters
        if ($country) {
            $query->where('country', $country);
        }

        if ($search) {
            $query->where('ip_address', 'like', "%{$search}%");
        }

        // Statistics
        $stats = [
            'totalVisitors' => Visitor::whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])->count(),
            'uniqueIPs' => Visitor::whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->distinct('ip_address')
                ->count('ip_address'),
            'topCountry' => Visitor::whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->select('country', DB::raw('count(*) as count'))
                ->groupBy('country')
                ->orderBy('count', 'desc')
                ->first(),
            'todayVisitors' => Visitor::whereDate('created_at', now())->count(),
        ];

        // Visitors over time (last 30 days)
        $visitorsOverTime = Visitor::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as count')
            )
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top countries
        $topCountries = Visitor::select('country', 'country_code', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->groupBy('country', 'country_code')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // Top cities
        $topCities = Visitor::select('city', 'country', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->groupBy('city', 'country')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // Top referrals
        $topReferrals = Visitor::select('referral', DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->whereNotNull('referral')
            ->where('referral', '!=', '')
            ->groupBy('referral')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // Paginated visitor list
        $visitors = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        // Get all countries for filter dropdown
        $countries = Visitor::select('country')
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
