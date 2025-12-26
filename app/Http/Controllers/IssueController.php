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

        return redirect()->back()->with('success', 'Manuscript published successfully in the selected issue.');
    }
}
