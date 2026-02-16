<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'slug' => 'email_verification',
                'name' => 'Email Verification',
                'subject' => 'Verify Your Email Address',
                'content' => 'Hello {{user_name}},\n\nPlease click the button below to verify your email address.\n\n<a href="{{verification_link}}" style="display:inline-block;padding:10px 20px;background-color:#3b82f6;color:white;text-decoration:none;border-radius:5px;">Verify Email Address</a>\n\nIf you did not create an account, no further action is required.',
                'variables' => ['user_name', 'verification_link'],
            ],
            [
                'slug' => 'password_reset',
                'name' => 'Password Reset',
                'subject' => 'Reset Your Password',
                'content' => 'Hello {{user_name}},\n\nYou are receiving this email because we received a password reset request for your account.\n\n<a href="{{reset_link}}" style="display:inline-block;padding:10px 20px;background-color:#3b82f6;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>\n\nThis password reset link will expire in 60 minutes.\n\nIf you did not request a password reset, no further action is required.',
                'variables' => ['user_name', 'reset_link'],
            ],
            // Journal Workflow Templates
            [
                'slug' => 'journal_submission_ack',
                'name' => 'Submission Acknowledgement',
                'subject' => 'Submission Acknowledgement',
                'content' => 'Dear {{author_name}},\n\nThank you for submitting your manuscript, "{{manuscript_title}}", to our journal. We have successfully received your submission.\n\nYou can track the progress of your manuscript by logging into your account:\n<a href="{{action_url}}">View Submission</a>\n\nBest regards,\nJournal Editorial Team',
                'variables' => ['author_name', 'manuscript_title', 'action_url'],
            ],
            [
                'slug' => 'journal_new_submission',
                'name' => 'New Submission Alert',
                'subject' => '[Editor] New Submission Received',
                'content' => 'Hello Editor,\n\nA new manuscript has been submitted to the journal.\n\n<strong>Title:</strong> {{manuscript_title}}\n<strong>Author:</strong> {{author_name}}\n\nPlease log in to the editorial dashboard to review it:\n<a href="{{action_url}}">View Submission</a>',
                'variables' => ['manuscript_title', 'author_name', 'action_url'],
            ],
            [
                'slug' => 'journal_decision_screening_reject',
                'name' => 'Screening Decision: Reject',
                'subject' => 'Decision on your manuscript',
                'content' => 'Dear {{author_name}},\n\nThank you for submitting your manuscript, "{{manuscript_title}}".\n\nAfter a preliminary review, we regret to inform you that your manuscript is not suitable for publication in our journal at this time.\n\nBest regards,\nJournal Editorial Team',
                'variables' => ['author_name', 'manuscript_title'],
            ],
            [
                'slug' => 'journal_decision_screening_revise',
                'name' => 'Screening Decision: Revision Required',
                'subject' => 'Revision Requested: {{manuscript_title}}',
                'content' => 'Dear {{author_name}},\n\nWe have reviewed your submission, "{{manuscript_title}}", and determined that revisions are required before it can proceed to peer review.\n\nPlease log in to view the detailed comments and submit a revised version:\n<a href="{{action_url}}">View Details</a>',
                'variables' => ['author_name', 'manuscript_title', 'action_url'],
            ],
            [
                'slug' => 'journal_review_invitation',
                'name' => 'Review Invitation',
                'subject' => 'Invitation to Review: {{manuscript_title}}',
                'content' => 'Dear {{reviewer_name}},\n\nWe would like to invite you to review the manuscript entitled "{{manuscript_title}}".\n\nAbstract: {{abstract}}\n\nPlease accept or decline this invitation by {{due_date}} via the link below:\n<a href="{{action_url}}">Respond to Invitation</a>\n\nBest regards,\nJournal Editorial Team',
                'variables' => ['reviewer_name', 'manuscript_title', 'abstract', 'due_date', 'action_url'],
            ],
            [
                'slug' => 'journal_review_completed',
                'name' => 'Review Completed Alert',
                'subject' => '[Editor] Review Submitted',
                'content' => 'Hello Editor,\n\nA review has been submitted for the manuscript "{{manuscript_title}}" by {{reviewer_name}}.\n\nPlease log in to view the review report:\n<a href="{{action_url}}">View Review</a>',
                'variables' => ['manuscript_title', 'reviewer_name', 'action_url'],
            ],
            [
                'slug' => 'journal_screening_proceed',
                'name' => 'Screening Decision: Proceed to Review',
                'subject' => 'Update on your manuscript: "{{manuscript_title}}"',
                'content' => 'Dear {{author_name}},\n\nWe are pleased to inform you that your manuscript, "{{manuscript_title}}", has passed the initial screening and is now proceeding to peer review.\n\nYou can track the progress here:\n<a href="{{action_url}}">View Submission</a>\n\nBest regards,\nJournal Editorial Team',
                'variables' => ['author_name', 'manuscript_title', 'action_url'],
            ],
            [
                'slug' => 'journal_decision_accept',
                'name' => 'Final Decision: Accepted',
                'subject' => 'Acceptance Notification: {{manuscript_title}}',
                'content' => 'Dear {{author_name}},\n\nCongratulations! We are delighted to inform you that your manuscript, "{{manuscript_title}}", has been accepted for publication in our journal.\n\nOur production team will contact you soon regarding the next steps.\n\nBest regards,\nJournal Editorial Team',
                'variables' => ['author_name', 'manuscript_title'],
            ],
            [
                'slug' => 'journal_published',
                'name' => 'Manuscript Published',
                'subject' => 'Your manuscript has been published: {{manuscript_title}}',
                'content' => 'Dear {{author_name}},\n\nWe are pleased to announce that your manuscript, "{{manuscript_title}}", has been officially published.\n\nYou can view and share your article here:\n<a href="{{action_url}}">View Article</a>\n\nThank you for choosing to publish with us.\n\nBest regards,\nJournal Editorial Team',
                'variables' => ['author_name', 'manuscript_title', 'action_url'],
            ],
        ];

        foreach ($templates as $template) {
            \App\Models\EmailTemplate::updateOrCreate(['slug' => $template['slug']], $template);
        }
    }
}
