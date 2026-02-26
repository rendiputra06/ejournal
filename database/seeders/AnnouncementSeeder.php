<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Announcement;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $journal = app('current_journal');
        $admin = User::role('admin')->first();

        if (!$admin) {
            return;
        }

        Announcement::create([
            'user_id' => $admin->id,
            'title' => 'Call for Papers: ' . $journal->name,
            'slug' => 'call-for-papers-' . $journal->slug,
            'content' => 'We are inviting submissions for our upcoming issue of ' . $journal->name . '.',
            'published_at' => now()->subDays(2),
        ]);
    }
}
