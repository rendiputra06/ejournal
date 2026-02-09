<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\ManuscriptAssignment;
use App\Models\ManuscriptReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\JournalNotification;
use App\Models\User;

class ReviewerController extends Controller
{
    /**
     * Display a listing of review assignments for the current reviewer.
     */
    public function index()
    {
        $assignments = ManuscriptAssignment::with(['manuscript.authors'])
            ->where('user_id', Auth::id())
            ->where('role', 'reviewer')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('reviewer/assignments/index', [
            'assignments' => $assignments
        ]);
    }

    /**
     * Display the specified manuscript for review.
     */
    public function show(ManuscriptAssignment $assignment)
    {
        $this->authorizeAccess($assignment);
        
        $assignment->load(['manuscript.authors', 'review']);

        return Inertia::render('reviewer/assignments/show', [
            'assignment' => $assignment
        ]);
    }

    /**
     * Accept or decline a review invitation.
     */
    public function respond(Request $request, ManuscriptAssignment $assignment)
    {
        $this->authorizeAccess($assignment);
        
        $request->validate([
            'status' => 'required|in:accepted,declined'
        ]);

        $assignment->update([
            'status' => $request->status
        ]);

        $message = $request->status === 'accepted' 
            ? 'Undangan peninjauan telah diterima.' 
            : 'Undangan peninjauan telah ditolak.';

        return redirect()->back()->with('success', $message);
    }

    /**
     * Submit a manuscript review.
     */
    public function store(Request $request, ManuscriptAssignment $assignment)
    {
        $this->authorizeAccess($assignment);
        
        if ($assignment->status !== 'accepted') {
            return redirect()->back()->with('error', 'Anda harus menerima undangan sebelum mengirimkan tinjauan.');
        }

        $request->validate([
            'relevance_score' => 'required|integer|min:1|max:5',
            'novelty_score' => 'required|integer|min:1|max:5',
            'methodology_score' => 'required|integer|min:1|max:5',
            'comment_for_author' => 'required|string',
            'comment_for_editor' => 'nullable|string',
            'recommendation' => 'required|in:accept,minor_revision,major_revision,reject'
        ]);

        $review = ManuscriptReview::updateOrCreate(
            ['assignment_id' => $assignment->id],
            array_merge($request->all(), ['submitted_at' => now()])
        );

        $assignment->update(['status' => 'completed']);

        // Notify Section Editor or all Editors
        $manuscript = $assignment->manuscript;
        $editor = $manuscript->sectionEditor ?? User::role('editor')->first(); // Fallback to any editor if no section editor

        if ($editor) {
            $editor->notify(new JournalNotification(
                'journal_review_completed',
                [
                    'manuscript_title' => $manuscript->title,
                    'reviewer_name' => Auth::user()->name,
                    'action_url' => route('editorial.submissions.show', $manuscript->id),
                ]
            ));
        }

        return redirect()->route('reviewer.assignments.index')->with('success', 'Tinjauan naskah telah berhasil dikirimkan.');
    }

    protected function authorizeAccess(ManuscriptAssignment $assignment)
    {
        if ($assignment->user_id !== Auth::id()) {
            abort(403, 'Akses ditolak.');
        }
    }
}
