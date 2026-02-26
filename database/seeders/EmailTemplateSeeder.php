<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmailTemplate;

class EmailTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'key' => 'journal_submission_ack',
                'subject' => 'Submission Acknowledgement',
                'body' => 'Dear {{author_name}},\n\nThank you for submitting your manuscript to {{journal_name}}.',
            ],
            // Add more as needed, but for now this is enough for the demo
        ];

        foreach ($templates as $template) {
            EmailTemplate::create($template);
        }
    }
}
