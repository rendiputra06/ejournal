<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
        ]);

        $user = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
        ]);

        $user->assignRole('admin');

        // Create Journal Users
        $roles = ['journal-manager', 'editor', 'reviewer', 'author', 'reader'];
        foreach ($roles as $roleName) {
            $u = User::factory()->create([
                'name' => ucwords(str_replace('-', ' ', $roleName)),
                'email' => "$roleName@journal.com",
                'password' => Hash::make('password'),
            ]);
            $u->assignRole($roleName);
        }

        $this->call([
            MenuSeeder::class,
        ]);
    }
}
