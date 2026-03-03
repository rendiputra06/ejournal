<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JournalMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Routes that use {journal} as slug (public journal pages): resolve by slug.
     * Routes that use {journal} as numeric ID (e.g journals.switch): skip, use session context.
     * Auth/admin routes without {journal} param: use session or default.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $journalParam = $request->route('journal');

        if ($journalParam) {
            if (is_numeric($journalParam)) {
                $journal = \App\Models\Journal::find($journalParam);
            } else {
                $journal = \App\Models\Journal::where('slug', $journalParam)->first();
                if (!$journal) {
                    abort(404, 'Journal not found.');
                }
            }
        }

        // If journal not resolved from slug, use session or default (admin/auth context)
        if (!isset($journal) || !$journal) {
            $journalId = session('active_journal_id');

            if ($journalId) {
                $journal = \App\Models\Journal::find($journalId);
            }

            if (!isset($journal) || !$journal) {
                $journal = \App\Models\Journal::where('is_active', true)->first();
                if ($journal) {
                    session(['active_journal_id' => $journal->id]);
                    session(['active_journal_slug' => $journal->slug]);
                }
            }
        }

        if (isset($journal) && $journal) {
            // Set URL defaults for Ziggy route generation
            \Illuminate\Support\Facades\URL::defaults(['journal' => $journal->slug]);

            // Share journal and its scoped setting with all Inertia responses
            \Inertia\Inertia::share('journal', $journal);

            $journalSetting = \App\Models\SettingApp::where('journal_id', $journal->id)->first();
            \Inertia\Inertia::share('setting', $journalSetting);

            // Store in request for controllers
            $request->merge(['current_journal' => $journal]);

            // Bind as singleton for HasJournal trait & JournalScope
            app()->instance(\App\Models\Journal::class, $journal);
        }

        return $next($request);
    }
}
