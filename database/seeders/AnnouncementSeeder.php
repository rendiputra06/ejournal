<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = \App\Models\User::role('admin')->first();

        if (!$admin) {
            return;
        }

        \App\Models\Announcement::create([
            'user_id' => $admin->id,
            'title' => 'Call for Papers: Special Issue on AI',
            'slug' => 'call-for-papers-special-issue-on-ai',
            'content' => 'We are inviting submissions for our upcoming special issue on Artificial Intelligence in Healthcare. Submit your manuscripts by June 30th.',
            'published_at' => now()->subDays(2),
        ]);

        \App\Models\Announcement::create([
            'user_id' => $admin->id,
            'title' => 'System Maintenance Scheduled',
            'slug' => 'system-maintenance-scheduled',
            'content' => 'The platform will undergo maintenance on Sunday, 12th Feb from 00:00 to 04:00 UTC. Please save your work.',
            'published_at' => now()->subDays(5),
        ]);

        \App\Models\Announcement::create([
            'user_id' => $admin->id,
            'title' => 'New Reviewer Guidelines',
            'slug' => 'new-reviewer-guidelines',
            'content' => 'Updated guidelines for peer review process are now available in the dashboard. All reviewers are requested to read them.',
            'published_at' => now()->subWeeks(1),
        ]);
    }
}
