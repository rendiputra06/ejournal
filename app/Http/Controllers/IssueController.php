<?php

namespace App\Http\Controllers;

use App\Models\Volume;
use App\Models\Issue;
use App\Models\Manuscript;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IssueController extends Controller
{
    /**
     * Display a listing of volumes and issues.
     */
    public function index()
    {
        $volumes = Volume::with('issues.manuscripts')->orderBy('year', 'desc')->get();
        
        return Inertia::render('editorial/issues/index', [
            'volumes' => $volumes
        ]);
    }

    /**
     * Store a newly created volume.
     */
    public function storeVolume(Request $request)
    {
        $request->validate([
            'number' => 'required|string',
            'year' => 'required|integer',
            'description' => 'nullable|string'
        ]);

        Volume::create($request->all());

        return redirect()->back()->with('success', 'Volume created successfully.');
    }

    /**
     * Store a newly created issue.
     */
    public function storeIssue(Request $request)
    {
        $request->validate([
            'volume_id' => 'required|exists:volumes,id',
            'number' => 'required|string',
            'year' => 'required|integer',
            'month' => 'nullable|string',
            'title' => 'nullable|string'
        ]);

        Issue::create($request->all());

        return redirect()->back()->with('success', 'Issue created successfully.');
    }

    /**
     * Update the specified volume.
     */
    public function updateVolume(Request $request, Volume $volume)
    {
        $request->validate([
            'number' => 'required|string',
            'year' => 'required|integer',
            'description' => 'nullable|string'
        ]);

        $volume->update($request->all());

        return redirect()->back()->with('success', 'Volume updated successfully.');
    }

    /**
     * Update the specified issue.
     */
    public function updateIssue(Request $request, Issue $issue)
    {
        $request->validate([
            'number' => 'required|string',
            'year' => 'required|integer',
            'month' => 'nullable|string',
            'title' => 'nullable|string',
            'status' => 'required|string|in:draft,published',
            'cover_image' => 'nullable|image|max:2048' // Validate image
        ]);

        $data = $request->except(['cover_image']);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('covers', 'public');
            // Assuming we store the full URL or relative path. 
            // If the model expects a full URL, we normally use a mutator or Storage::url()
            // Here assuming simple storage path or we prepend /storage/ in frontend.
            // But looking at the frontend, it uses `issue.cover_image_url`.
            // Let's store the storage URL.
            $data['cover_image_url'] = '/storage/' . $path;
        }

        $issue->update($data);

        return redirect()->back()->with('success', 'Issue updated successfully.');
    }

    /**
     * Assign a manuscript to an issue.
     */
    public function publishManuscript(Request $request, Manuscript $manuscript)
    {
        $request->validate([
            'issue_id' => 'required|exists:issues,id',
            'page_start' => 'nullable|string',
            'page_end' => 'nullable|string',
            'doi' => 'nullable|string'
        ]);

        $manuscript->update(array_merge($request->all(), [
            'status' => 'published'
        ]));

        // Notify Author
        $manuscript->user->notify(new \App\Notifications\JournalNotification(
            'journal_published',
            [
                'author_name' => $manuscript->user->name,
                'manuscript_title' => $manuscript->title,
                'action_url' => route('journal.current'), // Or a direct link to the article if implemented
            ]
        ));

        return redirect()->back()->with('success', 'Manuscript published successfully in the selected issue.');
    }
}
