<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\Manuscript;
use App\Models\User;
use App\Models\Issue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Notifications\JournalNotification;

class EditorialManuscriptController extends Controller
{
    /**
     * Display a listing of all manuscripts for editorial review.
     */
    public function index()
    {
        $manuscripts = Manuscript::with(['user', 'authors'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('editorial/submissions/index', [
            'manuscripts' => $manuscripts
        ]);
    }

    /**
     * Display the specified manuscript for editorial management.
     */
    public function show(Manuscript $manuscript)
    {
        $manuscript->load(['user', 'authors', 'assignments.user', 'assignments.review', 'sectionEditor']);
        
        // Get potential section editors (users with 'Editor' role)
        $editors = User::role('editor')->get(['id', 'name', 'email']);

        // Get potential reviewers (users with 'Reviewer' role)
        $reviewers = User::role('reviewer')->get(['id', 'name', 'email']);

        // Get available issues (only published or draft issues for publication)
        $issues = Issue::with('volume')->get();

        return Inertia::render('editorial/submissions/show', [
            'manuscript' => $manuscript,
            'editors' => $editors,
            'reviewers' => $reviewers,
            'issues' => $issues
        ]);
    }

    /**
     * Perform screening decision (desk reject, or proceed to review).
     */
    public function screening(Request $request, Manuscript $manuscript)
    {
        $request->validate([
            'decision' => 'required|in:proceed,reject,revision',
            'notes' => 'required_if:decision,reject,revision|string|nullable'
        ]);

        $statusMap = [
            'proceed' => 'screening', // Moves to screening stage/Editor assignment
            'reject' => 'archived',
            'revision' => 'draft', // Send back to author
        ];

        $manuscript->update([
            'status' => $statusMap[$request->decision]
        ]);

        // Send Notification to Author based on decision
        if ($request->decision === 'reject') {
            $manuscript->user->notify(new JournalNotification(
                'journal_decision_screening_reject',
                [
                    'author_name' => $manuscript->user->name,
                    'manuscript_title' => $manuscript->title,
                ]
            ));
        } elseif ($request->decision === 'revision') {
            $manuscript->user->notify(new JournalNotification(
                'journal_decision_screening_revise',
                [
                    'author_name' => $manuscript->user->name,
                    'manuscript_title' => $manuscript->title,
                    'action_url' => route('author.submissions.show', $manuscript->id),
                ]
            ));
        }

        return redirect()->back()->with('success', 'Keputusan prasaring telah berhasil disimpan.');
    }

    /**
     * Assign a Section Editor to the manuscript.
     */
    public function assignEditor(Request $request, Manuscript $manuscript)
    {
        $request->validate([
            'editor_id' => 'required|exists:users,id'
        ]);

        $manuscript->update([
            'section_editor_id' => $request->editor_id,
            'status' => 'reviewing' // Typically moves to reviewing once assigned
        ]);

        return redirect()->back()->with('success', 'Section Editor telah ditugaskan.');
    }

    /**
     * Invite a Reviewer to the manuscript.
     */
    public function inviteReviewer(Request $request, Manuscript $manuscript)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'due_date' => 'required|date|after:today'
        ]);

        $manuscript->assignments()->create([
            'user_id' => $request->user_id,
            'role' => 'reviewer',
            'status' => 'pending',
            'due_date' => $request->due_date
        ]);

        // Notify Reviewer
        $reviewer = User::find($request->user_id);
        $reviewer->notify(new JournalNotification(
            'journal_review_invitation',
            [
                'reviewer_name' => $reviewer->name,
                'manuscript_title' => $manuscript->title,
                'abstract' => Str::limit($manuscript->abstract, 200),
                'due_date' => $request->due_date,
                'action_url' => route('reviewer.assignments.index'),
            ]
        ));

        return redirect()->back()->with('success', 'Undangan peninjauan telah dikirimkan.');
    }
}
