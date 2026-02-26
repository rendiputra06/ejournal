<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Journal;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // 1. Create Default Journal (JST)
        $journal1 = Journal::create([
            'name' => 'Journal of System Transformation',
            'slug' => 'jst',
            'description' => 'A journal dedicated to system architecture and transformation.',
            'theme_color' => '#0ea5e9',
        ]);

        // 2. Create Second Journal (JSS)
        $journal2 = Journal::create([
            'name' => 'Journal of Software Science',
            'slug' => 'jss',
            'description' => 'Focusing on the latest advancements in software engineering.',
            'theme_color' => '#10b981',
        ]);

        // Set context to first journal for admin assignment
        setPermissionsTeamId($journal1->id);

        $user = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
        ]);
        $user->assignRole('admin');

        $journals = [$journal1, $journal2];
        $roles = ['journal-manager', 'editor', 'reviewer', 'author', 'reader'];

        foreach ($journals as $journal) {
            // Set context for this journal
            app()->instance('current_journal', $journal);
            setPermissionsTeamId($journal->id);

            foreach ($roles as $roleName) {
                $email = "$roleName@{$journal->slug}.com";
                $u = User::where('email', $email)->first();
                if (!$u) {
                    $u = User::factory()->create([
                        'name' => ucwords(str_replace('-', ' ', $roleName)) . ' (' . strtoupper($journal->slug) . ')',
                        'email' => $email,
                        'password' => Hash::make('password'),
                    ]);
                }
                $u->assignRole($roleName);
            }

            // Seed content for this journal
            $this->call([
                MenuSeeder::class,
                AnnouncementSeeder::class,
                EmailTemplateSeeder::class,
                ManuscriptSeeder::class,
            ]);
        }
    }
}
