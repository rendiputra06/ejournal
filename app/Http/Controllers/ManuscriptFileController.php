<?php

namespace App\Http\Controllers;

use App\Models\Manuscript;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ManuscriptFileController extends Controller
{
    /**
     * Stream the manuscript PDF file for preview.
     */
    public function view(Manuscript $manuscript)
    {
        // Allow public access if published
        if ($manuscript->status === 'published') {
            return $this->serveFile($manuscript, 'inline');
        }

        $user = Auth::user();
        if (!$user) {
            abort(403, 'Unauthorized access to this manuscript file.');
        }
        
        // Authorization logic
        $isAuthor = $manuscript->user_id === $user->id;
        $isEditor = $user->hasRole(['editor', 'journal-manager']);
        $isReviewer = $manuscript->assignments()
            ->where('user_id', $user->id)
            ->whereIn('status', ['pending', 'accepted', 'completed'])
            ->exists();

        if (!$isAuthor && !$isEditor && !$isReviewer) {
            abort(403, 'Unauthorized access to this manuscript file.');
        }

        return $this->serveFile($manuscript, 'inline');
    }

    /**
     * Download the manuscript file.
     */
    public function download(Manuscript $manuscript)
    {
        // Allow public access if published
        if ($manuscript->status === 'published') {
            return $this->serveFile($manuscript, 'attachment');
        }

        $user = Auth::user();
        if (!$user) {
            abort(403);
        }
        
        // Same authorization
        $isAuthor = $manuscript->user_id === $user->id;
        $isEditor = $user->hasRole(['editor', 'journal-manager']);
        $isReviewer = $manuscript->assignments()
            ->where('user_id', $user->id)
            ->whereIn('status', ['pending', 'accepted', 'completed'])
            ->exists();

        if (!$isAuthor && !$isEditor && !$isReviewer) {
            abort(403);
        }

        return $this->serveFile($manuscript, 'attachment');
    }

    /**
     * Helper to serve the file.
     */
    protected function serveFile(Manuscript $manuscript, $disposition = 'inline')
    {
        $media = $manuscript->getFirstMedia('manuscript_file');
        
        if (!$media) {
            abort(404, 'Manuscript file not found.');
        }

        if ($disposition === 'attachment') {
            return response()->download($media->getPath(), $media->file_name);
        }

        return response()->file($media->getPath(), [
            'Content-Type' => $media->mime_type ?? 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $media->file_name . '"',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
}
