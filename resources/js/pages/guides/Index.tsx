import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
    ShieldCheck,
    UserCog,
    PenTool,
    BookOpen,
    Search,
    Zap,
    Scale,
    FileText,
    Settings,
    MessageCircle,
    Layers
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'System Guide', href: '/guides' },
];

export default function UserManual({ userRole = 'author' }: { userRole?: string }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Guide - User Manual" />
            <div className="flex-1 p-4 md:p-6 lg:p-8 bg-neutral-50/50 dark:bg-transparent">
                <div className="max-w-6xl mx-auto">
                    <PageHeader
                        title="Comprehensive System Guide"
                        description="Learn how to navigate and utilize the Journal System effectively based on your assigned role."
                    />

                    <Tabs defaultValue={userRole} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1 bg-white dark:bg-neutral-900 shadow-sm border rounded-2xl mb-8">
                            <TabsTrigger value="author" className="flex flex-col gap-1 py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                                <PenTool className="size-4" />
                                <span className="text-xs font-semibold">Author</span>
                            </TabsTrigger>
                            <TabsTrigger value="reviewer" className="flex flex-col gap-1 py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                                <Search className="size-4" />
                                <span className="text-xs font-semibold">Reviewer</span>
                            </TabsTrigger>
                            <TabsTrigger value="editor" className="flex flex-col gap-1 py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                                <Scale className="size-4" />
                                <span className="text-xs font-semibold">Editor</span>
                            </TabsTrigger>
                            <TabsTrigger value="manager" className="flex flex-col gap-1 py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                                <UserCog className="size-4" />
                                <span className="text-xs font-semibold">Manager</span>
                            </TabsTrigger>
                            <TabsTrigger value="admin" className="flex flex-col gap-1 py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                                <ShieldCheck className="size-4" />
                                <span className="text-xs font-semibold">Admin</span>
                            </TabsTrigger>
                            <TabsTrigger value="reader" className="flex flex-col gap-1 py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                                <BookOpen className="size-4" />
                                <span className="text-xs font-semibold">Reader</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="author">
                            <GuideCard title="Author's Journey" icon={PenTool} color="text-blue-600">
                                <div className="space-y-6">
                                    <Step
                                        title="1. Preparing Your Manuscript"
                                        description="Ensure your manuscript follows the journal's template. Prepare title page, abstract, and blinded manuscript files."
                                        image="/images/guides/author_submission_form.png"
                                    />
                                    <Step
                                        title="2. Making a Submission"
                                        description="Go to the Submit page, fill in the metadata (title, abstract, authors), and upload your files."
                                        image="/images/guides/author_submissions_list.png"
                                    />
                                    <Step title="3. Tracking Progress" description="Monitor your dashboard for status updates: 'In Review', 'Revisions Required', or 'Accepted'." />
                                    <Step title="4. Submitting Revisions" description="If revisions are requested, address the reviewer comments and upload the revised manuscript along with a response letter." />
                                </div>
                            </GuideCard>
                        </TabsContent>

                        <TabsContent value="reviewer">
                            <GuideCard title="Reviewer's Guide" icon={Search} color="text-emerald-600">
                                <div className="space-y-6">
                                    <Step
                                        title="1. Accepting Invitations"
                                        description="Check your email or dashboard for review requests. You can accept or decline based on your availability and expertise."
                                        image="/images/guides/reviewer_assignments_list.png"
                                    />
                                    <Step
                                        title="2. Performing the Review"
                                        description="Access the manuscript files and use the review form to provide constructive feedback to the authors."
                                        image="/images/guides/reviewer_detail.png"
                                    />
                                    <Step title="3. Making a Recommendation" description="Select your recommendation: 'Accept', 'Minor Revisions', 'Major Revisions', or 'Decline'." />
                                </div>
                            </GuideCard>
                        </TabsContent>

                        <TabsContent value="editor">
                            <GuideCard title="Editorial Workflow" icon={Scale} color="text-amber-600">
                                <div className="space-y-6">
                                    <Step
                                        title="1. Initial Screening"
                                        description="Review new submissions for scope and basic quality. Assign to 'In Review' status or 'Desk Reject'."
                                        image="/images/guides/editor_submissions_list.png"
                                    />
                                    <Step
                                        title="2. Assigning Reviewers"
                                        description="Find and invite suitable reviewers for each manuscript. Aim for at least 2 consistent reviews."
                                        image="/images/guides/editor_manuscript_detail.png"
                                    />
                                    <Step title="3. Making Decisions" description="Evaluate reviewer feedback and recommend a decision to the Section Editor or Editor-in-Chief." />
                                    <Step title="4. Issue Planning" description="Assign accepted manuscripts to upcoming issues and coordinate the publication process." />
                                </div>
                            </GuideCard>
                        </TabsContent>

                        <TabsContent value="manager">
                            <GuideCard title="Journal Management" icon={UserCog} color="text-purple-600">
                                <div className="space-y-6">
                                    <Step
                                        title="1. Team Coordination"
                                        description="Manage the editorial board members and assign roles."
                                        image="/images/guides/manager_user_directory.png"
                                    />
                                    <Step
                                        title="2. Announcement Management"
                                        description="Publish news, calls for papers, and updates to the journal's public homepage."
                                        image="/images/guides/manager_announcements.png"
                                    />
                                    <Step title="3. Issue Management" description="Create volumes and issues, and manage the table of contents."
                                        image="/images/guides/manager_publication_management.png"
                                    />
                                </div>
                            </GuideCard>
                        </TabsContent>

                        {/* Admin Guide */}
                        <TabsContent value="admin">
                            <GuideCard title="System Administration" icon={ShieldCheck} color="text-rose-600">
                                <div className="space-y-6">
                                    <Step title="1. User Management" description="Create, edit, and deactivate user accounts. Reset passwords when necessary." />
                                    <Step title="2. Role & Permissions" description="Define and manage application roles and specific permissions for each feature." />
                                    <Step title="3. System Settings" description="Configure journal title, metadata, email SMTP settings, and dynamic guidelines." />
                                    <Step title="4. Maintenance" description="Monitor system logs (Audit Trail) and manage database backups." />
                                </div>
                            </GuideCard>
                        </TabsContent>

                        {/* Reader Guide */}
                        <TabsContent value="reader">
                            <GuideCard title="Reader's Experience" icon={BookOpen} color="text-indigo-600">
                                <div className="space-y-6">
                                    <Step title="1. Browsing Issues" description="Access the 'Current' and 'Archives' pages to read published research." />
                                    <Step title="2. Advanced Search" description="Use the search tool to find articles by keywords, authors, or issue details." />
                                    <Step title="3. PDF Access" description="Download PDF versions of articles for offline reading and citation." />
                                </div>
                            </GuideCard>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-primary/5 border-none shadow-none rounded-3xl">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Zap className="size-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm">Quick Tips</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed">Use the dashboard shortcuts to access frequent tasks faster. Sidebar menu is your primary navigation.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-amber-500/5 border-none shadow-none rounded-3xl">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="size-10 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                                    <MessageCircle className="size-5 text-amber-600" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm">Need Help?</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed">Contact your editorial manager if you encounter any technical issues or have workflow questions.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-emerald-500/5 border-none shadow-none rounded-3xl">
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="size-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <FileText className="size-5 text-emerald-600" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm">Policies</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed">Review the journal's publication ethics and plagiarism policies on the public 'About' page.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function GuideCard({ title, icon: Icon, color, children }: { title: string, icon: any, color: string, children: React.ReactNode }) {
    return (
        <Card className="border-none shadow-xl shadow-neutral-200/50 dark:shadow-none rounded-3xl overflow-hidden ring-1 ring-neutral-200 dark:ring-neutral-800">
            <CardHeader className="bg-white dark:bg-neutral-900 border-b p-6 md:p-8">
                <div className="flex items-center gap-4">
                    <div className={cn("size-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center", color)}>
                        <Icon className="size-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6 md:p-10 bg-white dark:bg-neutral-900/50">
                {children}
            </CardContent>
        </Card>
    );
}

function Step({ title, description, image }: { title: string, description: string, image?: string }) {
    return (
        <div className="flex gap-4 group">
            <div className="flex flex-col items-center">
                <div className="size-2.5 rounded-full bg-primary ring-4 ring-primary/10 mt-2" />
                <div className="w-px flex-1 bg-neutral-200 dark:bg-neutral-800 my-2 group-last:hidden" />
            </div>
            <div className="pb-8 space-y-4 flex-1">
                <div className="space-y-1">
                    <h5 className="font-bold text-neutral-900 dark:text-neutral-50">{title}</h5>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">{description}</p>
                </div>
                {image && (
                    <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-800/50 overflow-hidden shadow-sm max-w-2xl ring-1 ring-neutral-200 dark:ring-neutral-800">
                        <img src={image} alt={title} className="w-full h-auto object-cover" />
                    </div>
                )}
            </div>
        </div>
    );
}
