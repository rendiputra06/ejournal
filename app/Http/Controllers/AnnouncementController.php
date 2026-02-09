<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::with('user')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('announcements/Index', [
            'announcements' => $announcements,
        ]);
    }

    public function create()
    {
        return Inertia::render('announcements/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required|string',
            'published_at' => 'nullable|date',
        ]);

        $announcement = Announcement::create([
            'title'        => $validated['title'],
            'slug'         => Str::slug($validated['title']),
            'content'      => $validated['content'],
            'published_at' => $validated['published_at'] ?? now(),
            'user_id'      => auth()->id(),
        ]);

        return redirect()->route('editorial.announcements.index')->with('success', 'Announcement created successfully.');
    }

    public function edit(Announcement $announcement)
    {
        return Inertia::render('announcements/Form', [
            'announcement' => $announcement,
        ]);
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required|string',
            'published_at' => 'nullable|date',
        ]);

        $announcement->update([
            'title'        => $validated['title'],
            'slug'         => Str::slug($validated['title']),
            'content'      => $validated['content'],
            'published_at' => $validated['published_at'] ?? $announcement->published_at,
        ]);

        return redirect()->route('editorial.announcements.index')->with('success', 'Announcement updated successfully.');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return redirect()->route('editorial.announcements.index')->with('success', 'Announcement deleted successfully.');
    }
}
