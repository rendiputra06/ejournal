<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TestMailConfig extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:test {email : The recipient email address}';

    protected $description = 'Test the SMTP configuration stored in the database';

    public function handle()
    {
        $recipient = $this->argument('email');
        $setting = \App\Models\SettingApp::first();

        // Check if we should use DB settings
        if ($setting && $setting->mail_host) {
            $this->info("Using SMTP settings from Database (SettingApp)...");
            
            \Illuminate\Support\Facades\Config::set('mail.mailers.smtp', array_merge(
                \Illuminate\Support\Facades\Config::get('mail.mailers.smtp') ?? [],
                [
                    'transport' => $setting->mail_transport ?? 'smtp',
                    'host' => $setting->mail_host,
                    'port' => $setting->mail_port,
                    'encryption' => $setting->mail_encryption,
                    'username' => $setting->mail_username,
                    'password' => $setting->mail_password,
                ]
            ));
            
            if ($setting->mail_from_address) {
                \Illuminate\Support\Facades\Config::set('mail.from.address', $setting->mail_from_address);
            }
            if ($setting->mail_from_name) {
                \Illuminate\Support\Facades\Config::set('mail.from.name', $setting->mail_from_name);
            }
        } else {
            $this->info("Using SMTP settings from .env file...");
            // No need to set config, it's already loaded from .env
        }

        $this->info("Sending test email to: {$recipient}...");

        try {
            \Illuminate\Support\Facades\Mail::raw('SMTP test from Journal System CLI.', function ($message) use ($recipient) {
                $message->to($recipient)->subject('System SMTP CLI Test');
            });

            $this->info('Success! Test email sent successfully.');
        } catch (\Exception $e) {
            $this->error('Failed to send email: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
