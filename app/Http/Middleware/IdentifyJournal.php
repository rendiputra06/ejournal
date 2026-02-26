<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Journal;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IdentifyJournal
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $slug = $request->route('journal_slug');

        if ($slug) {
            $journal = Journal::where('slug', $slug)->first();

            if (!$journal) {
                abort(404, 'Journal not found.');
            }

            app()->instance('current_journal', $journal);

            // Set Spatie teams context
            if (config('permission.teams')) {
                setPermissionsTeamId($journal->id);
            }
        }

        return $next($request);
    }
}
