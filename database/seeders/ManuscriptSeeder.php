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
        // 1. Fetch Key Users
        $authorUser = User::where('email', 'author@journal.com')->first();
        $reviewerUsers = User::role('reviewer')->get();
        $editorUsers = User::role('editor')->get();
        
        if (!$authorUser || $reviewerUsers->isEmpty() || $editorUsers->isEmpty()) {
            return;
        }

        $editorId = $editorUsers->first()->id;

        // 2. Clear Existing Data (Optional but recommended for clean seed)
        // Volume::query()->delete(); // Depends on cascaded deletes

        // 3. Create Historical Volumes & Issues (2024)
        $vol1 = Volume::create([
            'number' => '1',
            'year' => 2024,
            'description' => 'Initial Journal Launch Volume',
            'is_active' => true
        ]);

        $issue1_1 = Issue::create([
            'volume_id' => $vol1->id,
            'number' => '1',
            'title' => 'Emerging Trends in Research',
            'year' => 2024,
            'month' => 'June',
            'status' => 'published'
        ]);

        $issue1_2 = Issue::create([
            'volume_id' => $vol1->id,
            'number' => '2',
            'title' => 'The Future of Technology',
            'year' => 2024,
            'month' => 'December',
            'status' => 'published'
        ]);

        // 4. Create Current Volume & Issue (2025)
        $vol2 = Volume::create([
            'number' => '2',
            'year' => 2025,
            'description' => 'Advances in Interdisciplinary Studies',
            'is_active' => true
        ]);

        $issue2_1 = Issue::create([
            'volume_id' => $vol2->id,
            'number' => '1',
            'title' => 'Open Theme Edition',
            'year' => 2025,
            'month' => 'June',
            'status' => 'draft'
        ]);

        // 5. Sample Research Data
        $researchTopics = [
            [
                'title' => 'Impact of AI on Modern Education Systems',
                'category' => 'research',
                'status' => 'published',
                'issue' => $issue1_1,
                'pages' => ['1', '15']
            ],
            [
                'title' => 'Renewable Energy Solutions for Developing Nations',
                'category' => 'research',
                'status' => 'published',
                'issue' => $issue1_1,
                'pages' => ['16', '32']
            ],
            [
                'title' => 'Cybersecurity Protocols in Healthcare IoT Devices',
                'category' => 'research',
                'status' => 'published',
                'issue' => $issue1_2,
                'pages' => ['1', '12']
            ],
            [
                'title' => 'Economic Resilience in Post-Pandemic Era',
                'category' => 'research',
                'status' => 'published',
                'issue' => $issue1_2,
                'pages' => ['13', '28']
            ],
            [
                'title' => 'Sustainable Architecture in Urban Environments',
                'category' => 'research',
                'status' => 'final_decision',
                'issue' => null
            ],
            [
                'title' => 'Deep Learning for Early Cancer Detection',
                'category' => 'research',
                'status' => 'reviewing',
                'issue' => null
            ],
            [
                'title' => 'Blockchain Applications in Supply Chain Management',
                'category' => 'research',
                'status' => 'screening',
                'issue' => null
            ],
            [
                'title' => 'The Role of Social Media in Political Upheaval',
                'category' => 'review',
                'status' => 'submitted',
                'issue' => null
            ],
        ];

        foreach ($researchTopics as $index => $item) {
            $ms = Manuscript::create([
                'user_id' => $authorUser->id,
                'external_id' => 'JRNL-' . (2024 + ($index % 2)) . '-' . Str::random(5),
                'title' => $item['title'],
                'abstract' => "This paper discusses " . strtolower($item['title']) . " in detail, covering methodology, results, and discussion for future research references in the field.",
                'keywords' => 'Seeded, Research, ' . $item['category'],
                'category' => $item['category'],
                'status' => $item['status'],
                'section_editor_id' => in_array($item['status'], ['screening', 'reviewing', 'final_decision', 'published']) ? $editorId : null,
                'issue_id' => $item['issue'] ? $item['issue']->id : null,
                'page_start' => $item['issue'] ? $item['pages'][0] : null,
                'page_end' => $item['issue'] ? $item['pages'][1] : null,
                'doi' => $item['issue'] ? '10.5555/journal.ms.' . (100 + $index) : null,
                'created_at' => $item['issue'] ? Carbon::now()->subYear() : Carbon::now()
            ]);

            // Add primary author
            $ms->authors()->create([
                'name' => $authorUser->name,
                'email' => $authorUser->email,
                'affiliation' => 'Journal University',
                'orcid' => '0000-0001-2345-6789',
                'is_primary' => true,
                'order' => 0
            ]);

            // Add co-author for some
            if ($index % 2 == 0) {
                $ms->authors()->create([
                    'name' => 'Co-Researcher ' . ($index + 1),
                    'email' => "co" . ($index + 1) . "@example.com",
                    'affiliation' => 'Partner Institute',
                    'is_primary' => false,
                    'order' => 1
                ]);
            }

            // Create assignments and reviews for reviewing/final_decision/published states
            if (in_array($item['status'], ['reviewing', 'final_decision', 'published'])) {
                foreach ($reviewerUsers->take(2) as $revIndex => $reviewer) {
                    $assignment = ManuscriptAssignment::create([
                        'manuscript_id' => $ms->id,
                        'user_id' => $reviewer->id,
                        'role' => 'reviewer',
                        'status' => ($item['status'] === 'reviewing' && $revIndex === 1) ? 'accepted' : 'completed',
                        'due_date' => Carbon::now()->addDays(14),
                    ]);

                    if ($assignment->status === 'completed') {
                        ManuscriptReview::create([
                            'assignment_id' => $assignment->id,
                            'relevance_score' => rand(4, 5),
                            'novelty_score' => rand(3, 5),
                            'methodology_score' => rand(4, 5),
                            'comment_for_author' => "Good work on " . $item['title'] . ". Consider minor edits to methodology section.",
                            'comment_for_editor' => "Solid research. Recommend acceptance.",
                            'recommendation' => 'accept_submission',
                            'submitted_at' => Carbon::now()->subDays(2)
                        ]);
                    }
                }
            }
        }
    }
}
