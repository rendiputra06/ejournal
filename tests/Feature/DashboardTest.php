<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Journal;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Vite;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private $journal;

    protected function setUp(): void
    {
        parent::setUp();
        Vite::spy();
        $this->seed(RolePermissionSeeder::class);
        $this->journal = Journal::create([
            'name' => 'Test Journal',
            'slug' => 'test-journal',
        ]);
    }

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get("/j/{$this->journal->slug}/dashboard");
        $response->assertRedirect('/login');
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->create();
        setPermissionsTeamId($this->journal->id);
        $user->assignRole('journal-manager');

        $this->actingAs($user);

        $response = $this->get("/j/{$this->journal->slug}/dashboard");
        $response->assertOk();
    }
}
