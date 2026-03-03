<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JournalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultJournal = \App\Models\Journal::updateOrCreate(
            ['slug' => 'default'],
            [
                'name' => 'Default Journal',
                'description' => 'The default journal created during system migration.',
                'is_active' => true,
            ]
        );

        $tables = [
            \App\Models\Manuscript::class,
            \App\Models\Volume::class,
            \App\Models\Issue::class,
            \App\Models\Announcement::class,
            \App\Models\Visitor::class,
            \App\Models\SettingApp::class,
        ];

        foreach ($tables as $modelClass) {
            $modelClass::whereNull('journal_id')->update(['journal_id' => $defaultJournal->id]);
        }
    }
}
