<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Manuscript;
use App\Models\ManuscriptAuthor;
use App\Models\ManuscriptAssignment;
use App\Models\ManuscriptReview;
use App\Models\Volume;
use App\Models\Issue;
use App\Models\User;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ManuscriptSeeder extends Seeder
{
    public function run(): void
    {
        $journal = app('current_journal');

        // 1. Fetch Key Users for this journal
        $authorUser = User::where('email', "author@{$journal->slug}.com")->first();
        $reviewerUsers = User::role('reviewer')->get(); // Spatie role filter should respect team ID already set
        $editorUsers = User::role('editor')->get();
        
        if (!$authorUser || $reviewerUsers->isEmpty() || $editorUsers->isEmpty()) {
            return;
        }

        $editorId = $editorUsers->first()->id;

        // 3. Create Historical Volumes & Issues (2024)
        $vol1 = Volume::create([
            'number' => '1',
            'year' => 2024,
            'description' => 'Initial Volume for ' . $journal->name,
            'is_active' => true
        ]);

        $issue1_1 = Issue::create([
            'volume_id' => $vol1->id,
            'number' => '1',
            'title' => 'Emerging Trends in ' . strtoupper($journal->slug),
            'year' => 2024,
            'month' => 'June',
            'status' => 'published'
        ]);

        // 4. Create Current Volume & Issue (2025)
        $vol2 = Volume::create([
            'number' => '2',
            'year' => 2025,
            'description' => 'Current Studies in ' . strtoupper($journal->slug),
            'is_active' => true
        ]);

        $issue2_1 = Issue::create([
            'volume_id' => $vol2->id,
            'number' => '1',
            'title' => 'Open Theme Edition',
            'year' => 2025,
            'month' => 'June',
            'status' => 'published'
        ]);

        // 5. Sample Research Data
        $researchTopics = [
            [
                'title' => 'Innovative Research in ' . $journal->name,
                'category' => 'research',
                'status' => 'published',
                'issue' => $issue1_1,
                'pages' => ['1', '15']
            ],
            [
                'title' => 'A Study on ' . strtoupper($journal->slug) . ' Paradigms',
                'category' => 'research',
                'status' => 'published',
                'issue' => $issue2_1,
                'pages' => ['1', '20']
            ],
            [
                'title' => 'Under Review Paper for ' . $journal->slug,
                'category' => 'research',
                'status' => 'reviewing',
                'issue' => null
            ],
        ];

        foreach ($researchTopics as $index => $item) {
            $ms = Manuscript::create([
                'user_id' => $authorUser->id,
                'external_id' => strtoupper($journal->slug) . '-' . (2025) . '-' . Str::random(5),
                'title' => $item['title'],
                'abstract' => "This paper discusses " . strtolower($item['title']) . " in detail.",
                'keywords' => 'Seeded, Research, ' . $item['category'],
                'category' => $item['category'],
                'status' => $item['status'],
                'section_editor_id' => in_array($item['status'], ['screening', 'reviewing', 'final_decision', 'published']) ? $editorId : null,
                'issue_id' => $item['issue'] ? $item['issue']->id : null,
                'page_start' => $item['issue'] ? $item['pages'][0] : null,
                'page_end' => $item['issue'] ? $item['pages'][1] : null,
                'doi' => $item['issue'] ? '10.5555/' . $journal->slug . '.ms.' . (100 + $index) : null,
            ]);

            // Add primary author
            $ms->authors()->create([
                'name' => $authorUser->name,
                'email' => $authorUser->email,
                'affiliation' => $journal->name . ' University',
                'is_primary' => true,
                'order' => 0
            ]);

            // Create assignments and reviews
            if ($item['status'] === 'reviewing' || $item['status'] === 'published') {
                foreach ($reviewerUsers->take(2) as $reviewer) {
                    $assignment = ManuscriptAssignment::create([
                        'manuscript_id' => $ms->id,
                        'user_id' => $reviewer->id,
                        'role' => 'reviewer',
                        'status' => $item['status'] === 'published' ? 'completed' : 'accepted',
                        'due_date' => Carbon::now()->addDays(14),
                    ]);

                    if ($assignment->status === 'completed') {
                        ManuscriptReview::create([
                            'assignment_id' => $assignment->id,
                            'relevance_score' => 5,
                            'novelty_score' => 5,
                            'methodology_score' => 5,
                            'comment_for_author' => "Excellent contribution to " . $journal->name,
                            'comment_for_editor' => "Strongly recommend.",
                            'recommendation' => 'accept_submission',
                            'submitted_at' => Carbon::now()
                        ]);
                    }
                }
            }
        }
    }
}
