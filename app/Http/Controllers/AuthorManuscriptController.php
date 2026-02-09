<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Manuscript;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;
use App\Notifications\JournalNotification;

class AuthorManuscriptController extends Controller
{
    /**
     * Display a listing of the author's manuscripts.
     */
    public function index()
    {
        $manuscripts = Manuscript::with('authors')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('author/submissions/index', [
            'manuscripts' => $manuscripts
        ]);
    }

    /**
     * Show the submission wizard.
     */
    public function create()
    {
        return Inertia::render('author/submissions/create');
    }

    /**
     * Store a new submission.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:500',
            'abstract' => 'required|string',
            'keywords' => 'nullable|string',
            'category' => 'required|string',
            'authors' => 'required|array|min:1',
            'authors.*.name' => 'required|string',
            'authors.*.email' => 'required|email',
            'authors.*.affiliation' => 'nullable|string',
            'authors.*.orcid' => 'nullable|string',
            'authors.*.is_primary' => 'boolean',
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB
        ]);

        return DB::transaction(function () use ($request) {
            $manuscript = Manuscript::create([
                'user_id' => Auth::id(),
                'title' => $request->title,
                'abstract' => $request->abstract,
                'keywords' => $request->keywords,
                'category' => $request->category,
                'status' => 'submitted',
                'external_id' => 'JRNL-' . date('Y') . '-' . strtoupper(Str::random(5)),
            ]);

            // Add Authors
            foreach ($request->authors as $index => $authorData) {
                $manuscript->authors()->create([
                    'name' => $authorData['name'],
                    'email' => $authorData['email'],
                    'affiliation' => $authorData['affiliation'] ?? null,
                    'orcid' => $authorData['orcid'] ?? null,
                    'is_primary' => $authorData['is_primary'] ?? false,
                    'order' => $index,
                ]);
            }

            // Upload File
            if ($request->hasFile('file')) {
                $manuscript->addMedia($request->file('file'))
                    ->toMediaCollection('manuscript_file');
            }

            // Send Acknowledgement to Author
            $author = Auth::user();
            $author->notify(new JournalNotification(
                'journal_submission_ack',
                [
                    'author_name' => $author->name,
                    'manuscript_title' => $manuscript->title,
                    'action_url' => route('author.submissions.show', $manuscript->id),
                ]
            ));

            // Send Alert to Editors
            $editors = User::role(['editor', 'manager'])->get();
            foreach ($editors as $editor) {
                $editor->notify(new JournalNotification(
                    'journal_new_submission',
                    [
                        'manuscript_title' => $manuscript->title,
                        'author_name' => $author->name,
                        'action_url' => route('editorial.submissions.show', $manuscript->id),
                    ]
                ));
            }

            return redirect()->route('author.submissions.index')
                ->with('success', 'Naskah Anda telah berhasil diajukan.');
        });
    }

    /**
     * Display the specified manuscript.
     */
    public function show(Manuscript $manuscript)
    {
        $this->authorizeAuthor($manuscript);

        return Inertia::render('author/submissions/show', [
            'manuscript' => $manuscript->load('authors')
        ]);
    }

    /**
     * Check if the logged-in user is the owner.
     */
    protected function authorizeAuthor(Manuscript $manuscript)
    {
        if ($manuscript->user_id !== Auth::id()) {
            abort(403);
        }
    }
}
