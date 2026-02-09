<?php

namespace App\Notifications;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class JournalNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $templateSlug;
    protected $data;
    protected $actionUrl;

    /**
     * Create a new notification instance.
     *
     * @param string $templateSlug The slug of the email template to use.
     * @param array $data Key-value pairs to replace in the template (e.g., ['manuscript_title' => '...']).
     * @param string|null $actionUrl Optional URL for the call-to-action button.
     */
    public function __construct(string $templateSlug, array $data = [], ?string $actionUrl = null)
    {
        $this->templateSlug = $templateSlug;
        $this->data = $data;
        $this->actionUrl = $actionUrl;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $template = EmailTemplate::where('slug', $this->templateSlug)->first();

        if (!$template) {
            Log::warning("Email template not found: {$this->templateSlug}");
            return (new MailMessage)
                ->subject('Journal Notification')
                ->line('You have a new notification from the Journal system.');
        }

        $subject = $template->subject;
        $content = $template->content;

        // Merge common data
        $replacements = array_merge([
            'user_name' => $notifiable->name,
            'action_url' => $this->actionUrl ?? config('app.url'),
        ], $this->data);

        // Perform replacements
        foreach ($replacements as $key => $value) {
            $subject = str_replace('{{' . $key . '}}', $value, $subject);
            $content = str_replace('{{' . $key . '}}', $value, $content);
        }

        // Handle new lines for text-based emails (though we use HTML view mostly)
        // For the view, we pass the content directly.
        
        return (new MailMessage)
            ->subject($subject)
            ->view('emails.dynamic', ['content' => $content]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'template' => $this->templateSlug,
            'data' => $this->data,
        ];
    }
}
