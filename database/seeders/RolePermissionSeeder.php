<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Buat role admin dan user jika belum ada
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $user = Role::firstOrCreate(['name' => 'user']);

        // Journal System Roles
        $manager = Role::firstOrCreate(['name' => 'journal-manager']);
        $editor = Role::firstOrCreate(['name' => 'editor']);
        $reviewer = Role::firstOrCreate(['name' => 'reviewer']);
        $author = Role::firstOrCreate(['name' => 'author']);
        $reader = Role::firstOrCreate(['name' => 'reader']);

        // Daftar permission berdasarkan menu structure
        $permissions = [
            'Dashboard' => [
                'dashboard-view',
                'manager-dashboard-view',
                'editor-dashboard-view',
                'reviewer-dashboard-view',
                'author-dashboard-view',
                'reader-dashboard-view',
            ],
            // ... (rest of the permissions stay same)
            'Access' => [
                'access-view',
                'permission-view',
                'users-view',
                'roles-view',
            ],
            'Settings' => [
                'settings-view',
                'menu-view',
                'app-settings-view',
                'backup-view',
            ],
            'Utilities' => [
                'utilities-view',
                'log-view',
                'filemanager-view',
            ],
        ];

        foreach ($permissions as $group => $perms) {
            foreach ($perms as $name) {
                $permission = Permission::firstOrCreate([
                    'name' => $name,
                    'group' => $group,
                ]);

                // Assign ke admin
                if (!$admin->hasPermissionTo($permission)) {
                    $admin->givePermissionTo($permission);
                }

                // Assign to Journal Manager (All)
                if (!$manager->hasPermissionTo($permission)) {
                    $manager->givePermissionTo($permission);
                }

                // Role-specific assignments
                if ($name === 'editor-dashboard-view' && !$editor->hasPermissionTo($permission)) {
                    $editor->givePermissionTo($permission);
                }
                if ($name === 'reviewer-dashboard-view' && !$reviewer->hasPermissionTo($permission)) {
                    $reviewer->givePermissionTo($permission);
                }
                if ($name === 'author-dashboard-view' && !$author->hasPermissionTo($permission)) {
                    $author->givePermissionTo($permission);
                }
                if ($name === 'reader-dashboard-view' && !$reader->hasPermissionTo($permission)) {
                    $reader->givePermissionTo($permission);
                }
            }
        }
    }
}
