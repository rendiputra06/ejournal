<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class JournalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $journals = \App\Models\Journal::orderBy('name')->get();
        return \Inertia\Inertia::render('journals/index', [
            'journals' => $journals
        ]);
    }

    /**
     * Display the specified resource.
     * Uses raw $id to avoid journal middleware slug resolution issues.
     */
    public function show($id)
    {
        $journal = \App\Models\Journal::findOrFail($id);
        $setting = \App\Models\SettingApp::withoutGlobalScopes()->where('journal_id', $journal->id)->first();

        return \Inertia\Inertia::render('journals/Show', [
            'journal' => $journal,
            'setting' => $setting,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:journals,slug',
            'description' => 'nullable|string',
        ]);

        \App\Models\Journal::create($request->all());

        return redirect()->back()->with('success', 'Journal created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, \App\Models\Journal $journal)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:journals,slug,' . $journal->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $journal->update($request->all());

        return redirect()->back()->with('success', 'Journal updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(\App\Models\Journal $journal)
    {
        // Prevent deleting the last journal maybe?
        if (\App\Models\Journal::count() <= 1) {
            return redirect()->back()->with('error', 'Cannot delete the only remaining journal.');
        }

        $journal->delete();

        return redirect()->back()->with('success', 'Journal deleted successfully.');
    }

    public function switch($id)
    {
        $journal = \App\Models\Journal::findOrFail($id);
        session(['active_journal_id' => $journal->id]);
        session(['active_journal_slug' => $journal->slug]);

        return redirect()->back()->with('success', "Switched to journal: {$journal->name}");
    }
}
