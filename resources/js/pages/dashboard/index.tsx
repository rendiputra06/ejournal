import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ShieldCheck,
    Scale,
    PenTool,
    BookOpen,
    Zap
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { PageHeader } from '@/components/page-header';

// Shared Components
import { CommunitySidebar } from './components/shared';

// Role-Specific Views
import { ManagerView } from './components/manager-view';
import { EditorView } from './components/editor-view';
import { AuthorView } from './components/author-view';
import { ReviewerView } from './components/reviewer-view';
import { ReaderView } from './components/reader-view';

// --- Interfaces ---

interface CommonData {
    announcements: {
        id: number;
        title: string;
        date: string;
        content: string;
    }[];
    latestArticles: {
        id: number;
        title: string;
        published_at: string;
        author: string;
    }[];
}

interface ManagerData {
    stats: {
        totalUsers: number;
        publishedIssues: number;
        totalSubmissions: number;
        totalVisitors: number;
    };
    activityData: { month: string; activity: number }[];
    visitorData: { country: string; count: number }[];
}

interface EditorData {
    stats: {
        newSubmissions: number;
        underReview: number;
        pendingDecisions: number;
        overdueReviews: number;
    };
    pendingAssignments: {
        id: number;
        title: string;
        received: string;
        author: string;
    }[];
    decisionData: {
        status: string;
        count: number;
        color: string;
    }[];
}

interface AuthorData {
    recentSubmissions: {
        id: number;
        external_id: string;
        title: string;
        status: string;
        created_at: string;
    }[];
    stats: {
        total: number;
        active: number;
        published: number;
        rejected: number;
    };
    activityData: { month: string; activity: number }[];
}

interface ReaderData {
    latestIssues: {
        id: number;
        volume: number;
        number: number;
        year: number;
        published_at: string;
    }[];
    recommendedArticles: {
        id: number;
        title: string;
        abstract: string;
        author: string;
    }[];
}

interface ReviewerData {
    stats: {
        pendingReviews: number;
        completedReviews: number;
        overdueReviews: number;
        activeInvitations: number;
    };
    activeAssignments: {
        id: number;
        manuscript_id: number;
        title: string;
        due_date: string;
        status: string;
    }[];
    activityData: { month: string; activity: number }[];
}

interface DashboardProps {
    roles: string[];
    data: {
        common: CommonData;
        manager?: ManagerData;
        editor?: EditorData;
        author?: AuthorData;
        reader?: ReaderData;
        reviewer?: ReviewerData;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard({ roles, data }: DashboardProps) {
    const primaryRole = roles[0] || 'reader';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-8">
                <PageHeader
                    title="System Overview"
                    description="Personalized workspace and real-time journal activity."
                />

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    <div className="xl:col-span-3 space-y-12">
                        {roles.length > 1 ? (
                            <Tabs defaultValue={primaryRole} className="w-full">
                                <TabsList className="bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl mb-6">
                                    {roles.includes('journal-manager') && <TabsTrigger value="journal-manager" className="rounded-lg gap-2 data-[state=active]:shadow-sm"><ShieldCheck className="size-4" /> Manager</TabsTrigger>}
                                    {roles.includes('editor') && <TabsTrigger value="editor" className="rounded-lg gap-2 data-[state=active]:shadow-sm"><Scale className="size-4" /> Editorial</TabsTrigger>}
                                    {roles.includes('reviewer') && <TabsTrigger value="reviewer" className="rounded-lg gap-2 data-[state=active]:shadow-sm"><Zap className="size-4" /> Reviewer</TabsTrigger>}
                                    {roles.includes('author') && <TabsTrigger value="author" className="rounded-lg gap-2 data-[state=active]:shadow-sm"><PenTool className="size-4" /> Author</TabsTrigger>}
                                    <TabsTrigger value="reader" className="rounded-lg gap-2 data-[state=active]:shadow-sm"><BookOpen className="size-4" /> Reader</TabsTrigger>
                                </TabsList>

                                <TabsContent value="journal-manager">
                                    {data.manager && <ManagerView data={data.manager} />}
                                </TabsContent>
                                <TabsContent value="editor">
                                    {data.editor && <EditorView data={data.editor} />}
                                </TabsContent>
                                <TabsContent value="reviewer">
                                    {data.reviewer && <ReviewerView data={data.reviewer} />}
                                </TabsContent>
                                <TabsContent value="author">
                                    {data.author && <AuthorView data={data.author} />}
                                </TabsContent>
                                <TabsContent value="reader">
                                    {data.reader && <ReaderView data={data.reader} />}
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <>
                                {roles.includes('journal-manager') && data.manager && <ManagerView data={data.manager} />}
                                {roles.includes('editor') && data.editor && <EditorView data={data.editor} />}
                                {roles.includes('reviewer') && data.reviewer && <ReviewerView data={data.reviewer} />}
                                {roles.includes('author') && data.author && <AuthorView data={data.author} />}
                                {roles.includes('reader') && data.reader && <ReaderView data={data.reader} />}
                            </>
                        )}
                    </div>

                    <div className="xl:col-span-1">
                        <CommunitySidebar data={data.common} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

