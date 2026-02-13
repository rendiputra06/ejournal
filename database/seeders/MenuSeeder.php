<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate table to ensure a clean state
        $this->cleanup();

        $menus = [
            [
                'title' => 'Dashboard',
                'icon' => 'Home',
                'route' => '/dashboard',
                'order' => 1,
                'permission_name' => 'dashboard-view',
            ],
            [
                'title' => 'Editorial',
                'icon' => 'BookOpen',
                'route' => '#',
                'order' => 2,
                'permission_name' => 'dashboard-view',
                'children' => [
                    [
                        'title' => 'Submission Queue',
                        'icon' => 'Gavel',
                        'route' => '/editorial/submissions',
                        'order' => 1,
                        'permission_name' => 'editorial-submissions-view',
                    ],
                    [
                        'title' => 'Reviewer Tasks',
                        'icon' => 'CheckCircle',
                        'route' => '/reviewer/assignments',
                        'order' => 2,
                        'permission_name' => 'reviewer-dashboard-view',
                    ],
                    [
                        'title' => 'Issue Management',
                        'icon' => 'BookCopy',
                        'route' => '/editorial/issues',
                        'order' => 3,
                        'permission_name' => 'editorial-issues-view',
                    ],
                    [
                        'title' => 'Announcements',
                        'icon' => 'Megaphone',
                        'route' => '/editorial/announcements',
                        'order' => 4,
                        'permission_name' => 'editorial-issues-view', // Using existing editorial permission
                    ],
                    [
                        'title' => 'Visitor Analytics',
                        'icon' => 'BarChart2',
                        'route' => '/analytics/visitors',
                        'order' => 5,
                        'permission_name' => 'analytics.visitors',
                    ],
                ]
            ],
            [
                'title' => 'Author Panel',
                'icon' => 'UserEdit',
                'route' => '#',
                'order' => 3,
                'permission_name' => 'author-dashboard-view',
                'children' => [
                    [
                        'title' => 'My Submissions',
                        'icon' => 'FileText',
                        'route' => '/author/submissions',
                        'order' => 1,
                        'permission_name' => 'author-dashboard-view',
                    ],
                    [
                        'title' => 'New Submission',
                        'icon' => 'PlusCircle',
                        'route' => '/author/submissions/create',
                        'order' => 2,
                        'permission_name' => 'author-dashboard-view',
                    ],
                ]
            ],
            [
                'title' => 'Access Control',
                'icon' => 'Contact',
                'route' => '#',
                'order' => 10,
                'permission_name' => 'access-view',
                'children' => [
                    [
                        'title' => 'Users',
                        'icon' => 'Users',
                        'route' => '/users',
                        'order' => 1,
                        'permission_name' => 'users-view',
                    ],
                    [
                        'title' => 'Roles',
                        'icon' => 'ShieldCheck',
                        'route' => '/roles',
                        'order' => 2,
                        'permission_name' => 'roles-view',
                    ],
                    [
                        'title' => 'Permissions',
                        'icon' => 'AlertOctagon',
                        'route' => '/permissions',
                        'order' => 3,
                        'permission_name' => 'permission-view',
                    ],
                    [
                        'title' => 'Menu Manager',
                        'icon' => 'Settings',
                        'route' => '/menus',
                        'order' => 4,
                        'permission_name' => 'menus-view',
                    ],
                ]
            ],
            [
                'title' => 'Settings',
                'icon' => 'Settings',
                'route' => '#',
                'order' => 11,
                'permission_name' => 'setting.edit',
                'children' => [
                    [
                        'title' => 'App Settings',
                        'icon' => 'Settings',
                        'route' => '/settingsapp',
                        'order' => 1,
                        'permission_name' => 'setting.edit',
                    ],
                    [
                        'title' => 'Email Templates',
                        'icon' => 'Mail',
                        'route' => '/email-templates',
                        'order' => 2,
                        'permission_name' => 'setting.edit',
                    ],
                    [
                        'title' => 'Backup',
                        'icon' => 'Database',
                        'route' => '/backup',
                        'order' => 3,
                        'permission_name' => 'backup.index',
                    ],
                    [
                        'title' => 'Audit Logs',
                        'icon' => 'History',
                        'route' => '/audit-logs',
                        'order' => 4,
                        'permission_name' => 'audit-logs.index',
                    ],
                ]
            ],
            [
                'title' => 'File Manager',
                'icon' => 'Folder',
                'route' => '#',
                'order' => 12,
                'permission_name' => 'files.index',
                'children' => [
                    [
                        'title' => 'My Files',
                        'icon' => 'FileText',
                        'route' => '/files',
                        'order' => 1,
                        'permission_name' => 'files.index',
                    ],
                    [
                        'title' => 'Media',
                        'icon' => 'Image',
                        'route' => '/media',
                        'order' => 2,
                        'permission_name' => 'media.index',
                    ],
                ]
            ]
        ];

        $this->createMenus($menus);
    }

    /**
     * Recursively create menus.
     */
    private function createMenus(array $menus, ?int $parentId = null): void
    {
        foreach ($menus as $menuData) {
            $children = $menuData['children'] ?? [];
            unset($menuData['children']);

            $menuData['parent_id'] = $parentId;

            $menu = Menu::create($menuData);

            if (!empty($children)) {
                $this->createMenus($children, $menu->id);
            }
        }
    }

    /**
     * Clean up existing data.
     */
    private function cleanup(): void
    {
        Schema::disableForeignKeyConstraints();
        Menu::truncate();
        Schema::enableForeignKeyConstraints();
    }
}
