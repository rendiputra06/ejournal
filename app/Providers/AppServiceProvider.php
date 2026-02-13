<?php

namespace App\Providers;

use App\Models\Menu;
use App\Models\User;
use App\Models\SettingApp;
use Spatie\Permission\Models\Role;
use App\Observers\GlobalActivityLogger;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Models\Permission;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') !== 'local') {
            URL::forceScheme('https');
        }

        User::observe(GlobalActivityLogger::class);
        Role::observe(GlobalActivityLogger::class);
        Permission::observe(GlobalActivityLogger::class);
        Menu::observe(GlobalActivityLogger::class);
        SettingApp::observe(GlobalActivityLogger::class);

        // Load Mail Config from Database
        try {
            if (!app()->runningUnitTests() && Schema::hasTable('settingapp')) {
                $setting = SettingApp::first();
                if ($setting && $setting->mail_host) {
                    $config = [
                        'transport' => $setting->mail_transport ?? 'smtp',
                        'host' => $setting->mail_host,
                        'port' => $setting->mail_port,
                        'encryption' => $setting->mail_encryption,
                        'username' => $setting->mail_username,
                        'password' => $setting->mail_password,
                        'timeout' => null,
                        'local_domain' => env('MAIL_EHLO_DOMAIN'),
                    ];
                    Config::set('mail.mailers.smtp', array_merge(Config::get('mail.mailers.smtp') ?? [], $config));
                    
                    if ($setting->mail_from_address) {
                        Config::set('mail.from.address', $setting->mail_from_address);
                    }
                    if ($setting->mail_from_name) {
                        Config::set('mail.from.name', $setting->mail_from_name);
                    }
                }
            }
        } catch (\Exception $e) {
            // Silently fail if DB is not ready or settings are incomplete
        }
    }
}
