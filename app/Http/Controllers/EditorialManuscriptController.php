<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\Manuscript;
use App\Models\User;
use App\Models\Issue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Notifications\JournalNotification;

class EditorialManuscriptController extends Controller
{
    /**
     * Display a listing of all manuscripts for editorial review.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Manuscript::with(['user', 'authors']);

        // Filter for Section Editors: only show assigned manuscripts
        // Journal Managers can see everything
        if ($user->hasRole('editor') && !$user->hasRole('journal-manager')) {
            $query->where('section_editor_id', $user->id);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $manuscripts = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('editorial/submissions/index', [
            'manuscripts' => $manuscripts,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Display the specified manuscript for editorial management.
     */
    public function show(Manuscript $manuscript)
    {
        // Auto-update status from 'submitted' to 'screening' when viewed by editor/manager
        if ($manuscript->status === 'submitted') {
            $manuscript->update(['status' => 'screening']);
        }

        $manuscript->load(['user', 'authors', 'assignments.user', 'assignments.review', 'sectionEditor', 'issue.volume']);
        
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
            'issues' => $issues,
            'auth_user_role' => Auth::user()->roles->first()?->name ?? 'reader'
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

        $manuscript->load('assignments');
        $hasReviewers = $manuscript->assignments()->where('role', 'reviewer')->exists();
        $hasPendingReviewers = $manuscript->assignments()
            ->where('role', 'reviewer')
            ->whereIn('status', ['pending', 'accepted'])
            ->exists();

        // Validation: Cannot 'Accept' if there are pending reviewer invitations
        if ($request->decision === 'proceed' && $hasPendingReviewers) {
            return redirect()->back()->withErrors([
                'decision' => 'Cannot accept this manuscript while reviewer invitations are still pending or in progress.'
            ]);
        }

        $statusMap = [
            'proceed' => ($hasReviewers || $manuscript->status === 'reviewing') ? 'final_decision' : 'screening',
            'reject' => 'archived',
            'revision' => 'draft', // Send back to author
        ];

        $previousStatus = $manuscript->status;
        $newStatus = $statusMap[$request->decision];

        $manuscript->update([
            'status' => $newStatus,
            'screening_notes' => $request->notes // Persist editorial feedback
        ]);

        // Send Notification to Author based on decision
        if ($request->decision === 'proceed') {
            $template = ($newStatus === 'final_decision') ? 'journal_decision_accept' : 'journal_screening_proceed';
            $manuscript->user->notify(new JournalNotification(
                $template,
                [
                    'author_name' => $manuscript->user->name,
                    'manuscript_title' => $manuscript->title,
                    'action_url' => route('author.submissions.show', $manuscript->id),
                ]
            ));
        } elseif ($request->decision === 'reject') {
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

        return redirect()->back()->with('success', 'Keputusan operasional telah berhasil disimpan.');
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

        // Notify Section Editor
        $editor = User::find($request->editor_id);
        $editor->notify(new JournalNotification(
            'journal_editor_assigned',
            [
                'editor_name' => $editor->name,
                'manuscript_title' => $manuscript->title,
                'author_name' => $manuscript->user->name,
                'action_url' => route('editorial.submissions.show', $manuscript->id),
            ]
        ));

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

        // Check for duplicate invitation
        $exists = $manuscript->assignments()
            ->where('user_id', $request->user_id)
            ->where('role', 'reviewer')
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Reviewer ini sudah diundang sebelumnya.');
        }

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
