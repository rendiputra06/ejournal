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

            // Force default mailer to smtp to ensure DB settings are used
            \Illuminate\Support\Facades\Config::set('mail.default', 'smtp');
        } else {
            $this->info("Using SMTP settings from .env file...");
        }

        // Display current configuration
        $this->comment("--- Configuration Summary ---");
        $this->line("Default Mailer: " . config('mail.default'));
        $this->line("Transport:      " . config('mail.mailers.smtp.transport'));
        $this->line("SMTP Host:     " . config('mail.mailers.smtp.host'));
        $this->line("SMTP Port:     " . config('mail.mailers.smtp.port'));
        $this->line("Encryption:    " . config('mail.mailers.smtp.encryption'));
        $this->line("Username:      " . config('mail.mailers.smtp.username'));
        
        // Safety check for password
        $pass = config('mail.mailers.smtp.password');
        $this->line("Password Set:  " . ($pass ? 'YES (Length: '.strlen($pass).')' : 'NO (EMPTY)'));
        
        $this->line("From Address:  " . config('mail.from.address'));
        $this->line("From Name:     " . config('mail.from.name'));
        $this->comment("-----------------------------");

        // FORCE PURGE: This is critical. It forces Laravel to recreate the transport with new config.
        \Illuminate\Support\Facades\Mail::purge('smtp');

        $this->info("Sending test email to: {$recipient}...");

        try {
            // Using implicit default mailer (which we might have forced to 'smtp')
            \Illuminate\Support\Facades\Mail::raw('SMTP test from Journal System CLI.', function ($message) use ($recipient) {
                $message->to($recipient)->subject('System SMTP CLI Test');
            });

            $this->info('Success! Test email sent successfully.');
        } catch (\Exception $e) {
            $this->error('Failed to send email: ' . $e->getMessage());
            $this->line('Error Trace: ' . $e->getTraceAsString());
            return 1;
        }

        return 0;
    }
}
