<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;

class MailTestController extends Controller
{
    public function testConnection(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'mail_transport' => 'required',
            'mail_host' => 'required',
            'mail_port' => 'required',
            'mail_username' => 'required',
            'mail_password' => 'required',
            'mail_encryption' => 'nullable',
            'mail_from_address' => 'required|email',
            'mail_from_name' => 'required',
        ]);

        try {
            // 1. Force clear any existing mailer instances in memory
            Mail::purge('smtp');

            // 2. Temporarily set mail config for this request
            config([
                'mail.default' => 'smtp',
                'mail.mailers.smtp.transport' => $request->mail_transport,
                'mail.mailers.smtp.host' => $request->mail_host,
                'mail.mailers.smtp.port' => $request->mail_port,
                'mail.mailers.smtp.username' => $request->mail_username,
                'mail.mailers.smtp.password' => $request->mail_password,
                'mail.mailers.smtp.encryption' => $request->mail_encryption,
                'mail.from.address' => $request->mail_from_address,
                'mail.from.name' => $request->mail_from_name,
            ]);

            // 3. Send test email
            Mail::raw('This is a test email to verify SMTP configuration for the Journal System.', function ($message) use ($request) {
                $message->to($request->email)
                        ->subject('SMTP Connection Test');
            });

            return response()->json(['message' => 'Test email sent successfully! Please check your inbox.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to send test email: ' . $e->getMessage()], 500);
        }
    }
}
