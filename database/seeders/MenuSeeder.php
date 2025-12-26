<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        // MENU: Dashboard
        Menu::updateOrCreate(
            ['title' => 'Dashboard'],
            [
                'icon' => 'Home',
                'route' => '/dashboard',
                'order' => 1,
                'permission_name' => 'dashboard-view',
            ]
        );

        // GROUP: Editorial (Manager, Editor, Reviewer)
        $editorial = Menu::updateOrCreate(
            ['title' => 'Editorial Panel'],
            [
                'icon' => 'BookOpen',
                'route' => '#',
                'order' => 2,
                'permission_name' => 'dashboard-view',
            ]
        );

        Menu::updateOrCreate(
            ['title' => 'Manager Panel', 'parent_id' => $editorial->id],
            [
                'icon' => 'ShieldCheck',
                'route' => '/dashboard/manager',
                'order' => 1,
                'permission_name' => 'manager-dashboard-view',
            ]
        );

        Menu::updateOrCreate(
            ['title' => 'Editor Panel', 'parent_id' => $editorial->id],
            [
                'icon' => 'FileSearch',
                'route' => '/dashboard/editor',
                'order' => 2,
                'permission_name' => 'editor-dashboard-view',
            ]
        );

        Menu::updateOrCreate(
            ['title' => 'Reviewer Panel', 'parent_id' => $editorial->id],
            [
                'icon' => 'ClipboardCheck',
                'route' => '/dashboard/reviewer',
                'order' => 3,
                'permission_name' => 'reviewer-dashboard-view',
            ]
        );

        // GROUP: Author
        Menu::updateOrCreate(
            ['title' => 'Author Panel'],
            [
                'icon' => 'FileText',
                'route' => '/dashboard/author',
                'order' => 3,
                'permission_name' => 'author-dashboard-view',
            ]
        );

        // GROUP: Library (Reader)
        Menu::updateOrCreate(
            ['title' => 'My Library'],
            [
                'icon' => 'Bookmark',
                'route' => '/dashboard/reader',
                'order' => 4,
                'permission_name' => 'reader-dashboard-view',
            ]
        );

        // GROUP: Access
        $access = Menu::updateOrCreate(
            ['title' => 'System Access'],
            [
                'icon' => 'Contact',
                'route' => '#',
                'order' => 10,
                'permission_name' => 'access-view',
            ]
        );

        Menu::updateOrCreate(
            ['title' => 'Users', 'parent_id' => $access->id],
            [
                'icon' => 'Users',
                'route' => '/users',
                'order' => 1,
                'permission_name' => 'users-view',
            ]
        );

        Menu::updateOrCreate(
            ['title' => 'Roles', 'parent_id' => $access->id],
            [
                'icon' => 'ShieldCheck',
                'route' => '/roles',
                'order' => 2,
                'permission_name' => 'roles-view',
            ]
        );

        Menu::updateOrCreate(
            ['title' => 'Permissions', 'parent_id' => $access->id],
            [
                'icon' => 'AlertOctagon',
                'route' => '/permissions',
                'order' => 3,
                'permission_name' => 'permission-view',
            ]
        );

        Menu::updateOrCreate(
            ['title' => 'Menu Manager', 'parent_id' => $access->id],
            [
                'icon' => 'Settings',
                'route' => '/menus',
                'order' => 4,
                'permission_name' => 'menus-view',
            ]
        );

        // GROUP: Settings
        $settings = Menu::updateOrCreate(
            ['title' => 'Settings'],
            [
                'icon' => 'Settings',
                'route' => '#',
                'order' => 11,
                'permission_name' => 'setting.edit',
            ]
        );

        Menu::updateOrCreate(
            ['title' => 'App Settings', 'parent_id' => $settings->id],
            [
                'icon' => 'Settings',
                'route' => '/settingsapp',
                'order' => 1,
                'permission_name' => 'setting.edit',
            ]
        );

        Menu::updateOrCreate(
            ['title' => 'Backup', 'parent_id' => $settings->id],
            [
                'icon' => 'Database',
                'route' => '/backup',
                'order' => 2,
                'permission_name' => 'backup.index',
            ]
        );

        Menu::updateOrCreate(
            ['title' => 'Audit Logs', 'parent_id' => $settings->id],
            [
                'icon' => 'History',
                'route' => '/audit-logs',
                'order' => 3,
                'permission_name' => 'audit-logs.index',
            ]
        );

        // GROUP: Files
        $files = Menu::updateOrCreate(
            ['title' => 'Files Explorer'],
            [
                'icon' => 'Folder',
                'route' => '#',
                'order' => 12,
                'permission_name' => 'files.index',
            ]
        );

        Menu::updateOrCreate(
            ['title' => 'My Files', 'parent_id' => $files->id],
            [
                'icon' => 'FileText',
                'route' => '/files',
                'order' => 1,
                'permission_name' => 'files.index',
            ]
        );

        Menu::updateOrCreate(
            ['title' => 'Media', 'parent_id' => $files->id],
            [
                'icon' => 'Image',
                'route' => '/media',
                'order' => 2,
                'permission_name' => 'media.index',
            ]
        );
    }
}
