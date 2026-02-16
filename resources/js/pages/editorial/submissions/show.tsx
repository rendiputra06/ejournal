import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
    FileText,
    Users,
    Clock,
    CheckCircle2,
    AlertCircle,
    Download,
    Mail,
    UserPlus,
    ShieldCheck,
    ArrowLeft,
    Calendar,
    ChevronRight,
    Info,
    Gavel,
    ClipboardCheck,
    Search,
    Star,
    MessageSquare,
    XCircle,
    BookOpen,
    Hash,
    ExternalLink,
    Eye
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

interface Author {
    id: number;
    name: string;
    email: string;
    affiliation: string;
    orcid: string;
    is_primary: boolean;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Review {
    id: number;
    relevance_score: number;
    novelty_score: number;
    methodology_score: number;
    comment_for_author: string;
    comment_for_editor: string;
    recommendation: string;
    submitted_at: string;
}

interface Assignment {
    id: number;
    user: User;
    role: string;
    status: string;
    due_date: string;
    review: Review | null;
}

interface Volume {
    id: number;
    number: string;
    year: number;
}

interface Issue {
    id: number;
    volume_id: number;
    number: string;
    title: string | null;
    year: number;
    volume: Volume;
}

interface Manuscript {
    id: number;
    external_id: string;
    title: string;
    abstract: string;
    keywords: string;
    category: string;
    status: string;
    created_at: string;
    user: User;
    authors: Author[];
    assignments: Assignment[];
    section_editor: User | null;
    page_start: string | null;
    page_end: string | null;
    doi: string | null;
    issue: Issue | null;
}

interface Props {
    manuscript: Manuscript;
    editors: User[];
    reviewers: User[];
    issues: Issue[];
    auth_user_role: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Editorial Management', href: '/editorial/submissions' },
    { title: 'Manuscript Details', href: '#' },
];

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'submitted': return { label: 'Submitted', bg: 'bg-blue-50', color: 'text-blue-700', border: 'border-blue-200', icon: Mail };
        case 'screening': return { label: 'In Screening', bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200', icon: Clock };
        case 'reviewing': return { label: 'Peer Review', bg: 'bg-indigo-50', color: 'text-indigo-700', border: 'border-indigo-200', icon: Search };
        case 'final_decision': return { label: 'Final Decision', bg: 'bg-green-50', color: 'text-green-700', border: 'border-green-200', icon: CheckCircle2 };
        case 'published': return { label: 'Published', bg: 'bg-emerald-500 text-white', color: 'text-white', border: 'border-emerald-600', icon: BookOpen };
        case 'archived': return { label: 'Archived', bg: 'bg-gray-50', color: 'text-gray-700', border: 'border-gray-200', icon: AlertCircle };
        default: return { label: status, bg: 'bg-muted', color: 'text-muted-foreground', border: 'border-muted', icon: Info };
    }
};

export default function EditorialShow({ manuscript, editors, reviewers, issues, auth_user_role }: Props) {
    const status = getStatusConfig(manuscript.status);
    const StatusIcon = status.icon;

    const screeningForm = useForm({
        decision: '' as '' | 'proceed' | 'reject' | 'revision',
        notes: ''
    });

    const assignmentForm = useForm({
        editor_id: manuscript.section_editor?.id?.toString() || ''
    });

    const reviewerForm = useForm({
        user_id: '',
        due_date: dayjs().add(14, 'day').format('YYYY-MM-DD')
    });

    const publishForm = useForm({
        issue_id: manuscript.issue?.id?.toString() || '',
        page_start: manuscript.page_start || '',
        page_end: manuscript.page_end || '',
        doi: manuscript.doi || ''
    });

    const handleScreening = (e: React.FormEvent) => {
        e.preventDefault();
        screeningForm.post(route('editorial.submissions.screening', manuscript.id), {
            onSuccess: () => toast.success('Decision saved successfully.'),
        });
    };

    const handleAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        assignmentForm.post(route('editorial.submissions.assign-editor', manuscript.id), {
            onSuccess: () => toast.success('Section Editor assigned successfully.'),
        });
    };

    const handleInviteReviewer = (e: React.FormEvent) => {
        e.preventDefault();
        reviewerForm.post(route('editorial.submissions.invite-reviewer', manuscript.id), {
            onSuccess: () => {
                toast.success('Reviewer invitation sent.');
                reviewerForm.reset('user_id');
            },
        });
    };

    const handlePublish = (e: React.FormEvent) => {
        e.preventDefault();
        publishForm.post(route('editorial.submissions.publish', manuscript.id), {
            onSuccess: () => toast.success('Manuscript published successfully.'),
        });
    };

    const reviewerAssignments = manuscript.assignments.filter(a => a.role === 'reviewer');

    return (
        <AppLayout title="Editorial Manuscript View" breadcrumbs={breadcrumbs}>
            <Head title={`Editorial: ${manuscript.title}`} />

            <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4 max-w-3xl">
                        <Link
                            href={route('editorial.submissions.index')}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                        >
                            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Submissions
                        </Link>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{manuscript.external_id}</span>
                                <Badge className={cn("px-2 py-0 h-5 text-[10px] font-bold uppercase", status.bg, status.color, status.border)}>
                                    {status.label}
                                </Badge>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight">{manuscript.title}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="shadow-sm gap-1.5 h-9 rounded-full px-4 border-primary/20 text-primary hover:bg-primary/5">
                                    <Eye className="size-4" /> Preview
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col">
                                <DialogHeader className="p-4 border-b">
                                    <DialogTitle>Manuscript Preview: {manuscript.title}</DialogTitle>
                                </DialogHeader>
                                <div className="flex-1 bg-muted/20">
                                    <iframe
                                        src={route('manuscripts.file.view', manuscript.id)}
                                        className="w-full h-full border-none"
                                        title="PDF Preview"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button variant="outline" className="shadow-sm gap-1.5 h-9 rounded-full px-4" asChild>
                            <a href={route('manuscripts.file.download', manuscript.id)}>
                                <Download className="size-4" /> Download
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Reviewer Result Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ClipboardCheck className="size-5 text-indigo-600" />
                                Peer Review Results
                            </h2>

                            <div className="grid grid-cols-1 gap-4">
                                {reviewerAssignments.length === 0 ? (
                                    <Card className="border-sidebar-border/50 shadow-sm border-dashed">
                                        <CardContent className="h-32 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                            <Users className="size-8 opacity-20" />
                                            <p className="text-sm">No reviewers assigned yet.</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    reviewerAssignments.map((invite) => (
                                        <Card key={invite.id} className="border-sidebar-border/50 shadow-sm overflow-hidden">
                                            <CardHeader className="bg-muted/10 pb-4 border-b border-sidebar-border/30">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                            <Mail className="size-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold leading-none">{invite.user.name}</p>
                                                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight font-medium">Due: {dayjs(invite.due_date).format('MMM DD, YYYY')}</p>
                                                        </div>
                                                    </div>
                                                    <Badge className={cn(
                                                        "text-[9px] uppercase font-bold",
                                                        invite.status === 'pending' ? "bg-blue-50 text-blue-600" :
                                                            invite.status === 'accepted' ? "bg-amber-50 text-amber-600" :
                                                                invite.status === 'completed' ? "bg-green-50 text-green-600" :
                                                                    "bg-gray-50 text-gray-600"
                                                    )}>
                                                        {invite.status}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-6">
                                                {invite.review ? (
                                                    <div className="space-y-6">
                                                        <div className="grid grid-cols-3 gap-4">
                                                            {[
                                                                { label: 'Relevance', score: invite.review.relevance_score },
                                                                { label: 'Novelty', score: invite.review.novelty_score },
                                                                { label: 'Methodology', score: invite.review.methodology_score },
                                                            ].map((s, idx) => (
                                                                <div key={idx} className="bg-muted/30 p-2 rounded-lg text-center font-bold">
                                                                    <p className="text-[9px] uppercase text-muted-foreground">{s.label}</p>
                                                                    <p className="text-lg text-primary">{s.score}/5</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="space-y-1.5">
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Comments for Author</Label>
                                                                <p className="text-xs leading-relaxed italic border-l-2 border-primary/20 pl-3 font-serif">"{invite.review.comment_for_author}"</p>
                                                            </div>
                                                            {invite.review.comment_for_editor && (
                                                                <div className="space-y-1.5 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                                                                    <Label className="text-[10px] uppercase font-bold text-amber-600 tracking-widest flex items-center gap-1">
                                                                        <MessageSquare className="size-3" /> Confidential Note for Editor
                                                                    </Label>
                                                                    <p className="text-xs leading-relaxed text-amber-900/80 italic font-serif">"{invite.review.comment_for_editor}"</p>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center justify-between pt-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 capitalize font-bold text-[10px] px-3">
                                                                        Recommendation: {invite.review.recommendation.replace('_', ' ')}
                                                                    </Badge>
                                                                </div>
                                                                <span className="text-[10px] text-muted-foreground font-medium italic">Submitted on {dayjs(invite.review.submitted_at).format('MMM DD, YYYY')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="py-4 flex flex-col items-center justify-center text-center gap-2 opacity-50">
                                                        <Clock className="size-6 mb-1" />
                                                        <p className="text-xs font-medium">Awaiting reviewer response or manuscript evaluation...</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Abstract Card */}
                        <Card className="border-sidebar-border/50 shadow-sm overflow-hidden mt-8">
                            <CardHeader className="bg-muted/30 border-b border-sidebar-border/30">
                                <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="size-4 text-primary" />
                                    Abstract & Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase text-justify">Abstract</Label>
                                    <p className="text-sm leading-relaxed text-foreground/90 italic font-serif text-justify">
                                        {manuscript.abstract}
                                    </p>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase">Keywords</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {manuscript.keywords ? manuscript.keywords.split(',').map((k, i) => (
                                                <Badge key={i} variant="secondary" className="font-medium">{k.trim()}</Badge>
                                            )) : (
                                                <span className="text-xs text-muted-foreground italic">No keywords provided.</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-muted-foreground uppercase">Section / Category</Label>
                                        <p className="text-sm font-semibold capitalize">{manuscript.category.replace('_', ' ')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Actions & Meta */}
                    <div className="space-y-6">
                        {/* Publication Card (Only if accepted) */}
                        {manuscript.status === 'final_decision' || manuscript.status === 'published' ? (
                            <Card className="border-emerald-500/50 shadow-xl shadow-emerald-500/5 overflow-hidden border-t-4 border-t-emerald-600">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-emerald-600">
                                        <BookOpen className="size-4" />
                                        Publication Details
                                    </CardTitle>
                                    <CardDescription>Assign manuscript to an active issue and set identifiers.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handlePublish} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Select Issue</Label>
                                            <select
                                                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                                value={publishForm.data.issue_id}
                                                onChange={e => publishForm.setData('issue_id', e.target.value)}
                                                required
                                            >
                                                <option value="">-- Choose Issue --</option>
                                                {issues.map(iss => (
                                                    <option key={iss.id} value={iss.id}>
                                                        Vol {iss.volume.number}, Issue {iss.number} ({iss.year})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label>Start Page</Label>
                                                <Input
                                                    placeholder="e.g. 12"
                                                    value={publishForm.data.page_start}
                                                    onChange={e => publishForm.setData('page_start', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>End Page</Label>
                                                <Input
                                                    placeholder="e.g. 24"
                                                    value={publishForm.data.page_end}
                                                    onChange={e => publishForm.setData('page_end', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>DOI (Digital Object Identifier)</Label>
                                            <Input
                                                placeholder="10.1234/journal.ms.001"
                                                value={publishForm.data.doi}
                                                onChange={e => publishForm.setData('doi', e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 h-10 rounded-full font-bold shadow-lg shadow-emerald-200"
                                            disabled={publishForm.processing}
                                        >
                                            <CheckCircle2 className="mr-2 size-4" />
                                            {manuscript.status === 'published' ? 'Update Publication' : 'Confirm Publication'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        ) : (
                            /* Final Decision Action Card */
                            <Card className="border-sidebar-border/50 shadow-sm overflow-hidden border-l-4 border-l-primary">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-primary">
                                        <Gavel className="size-4" />
                                        Editorial Decision
                                    </CardTitle>
                                    <CardDescription>Finalize the manuscript based on evaluation.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleScreening} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Decision Action</Label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {[
                                                    { id: 'proceed', label: 'Accept for Publication', desc: 'Passes all criteria' },
                                                    { id: 'revision', label: 'Revision Needed', desc: 'Request changes from author' },
                                                    { id: 'reject', label: 'Decline Submission', desc: 'Archive this manuscript' },
                                                ].map((opt) => (
                                                    <div
                                                        key={opt.id}
                                                        onClick={() => screeningForm.setData('decision', opt.id as any)}
                                                        className={cn(
                                                            "p-3 rounded-xl border transition-all cursor-pointer hover:border-primary/50",
                                                            screeningForm.data.decision === opt.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-sidebar-border/50"
                                                        )}
                                                    >
                                                        <p className="text-sm font-bold">{opt.label}</p>
                                                        <p className="text-[10px] text-muted-foreground leading-none mt-1">{opt.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-10 rounded-full font-bold shadow-lg shadow-primary/20"
                                            disabled={!screeningForm.data.decision || screeningForm.processing}
                                        >
                                            Save Final Decision
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* Invitation Card */}
                        <Card className="border-sidebar-border/50 shadow-sm overflow-hidden border-l-4 border-l-indigo-600">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-indigo-600">
                                    <UserPlus className="size-4" />
                                    Invite Peer Reviewers
                                </CardTitle>
                                <CardDescription>Search experts and set deadlines.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleInviteReviewer} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Expert Selection</Label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                            value={reviewerForm.data.user_id}
                                            onChange={e => reviewerForm.setData('user_id', e.target.value)}
                                            required
                                        >
                                            <option value="">-- Choose Reviewer --</option>
                                            {reviewers.filter(r => !manuscript.assignments.some(a => a.user.id === r.id && a.role === 'reviewer')).map(r => (
                                                <option key={r.id} value={r.id}>{r.name} ({r.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Submission Deadline</Label>
                                        <Input
                                            type="date"
                                            value={reviewerForm.data.due_date}
                                            onChange={e => reviewerForm.setData('due_date', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 h-10 rounded-full font-bold shadow-lg shadow-indigo-200"
                                        disabled={reviewerForm.processing}
                                    >
                                        Send Invitation
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Section Editor Assignment */}
                        {auth_user_role !== 'editor' && (
                            <Card className="border-sidebar-border/50 shadow-sm overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground opacity-50">
                                        <ShieldCheck className="size-4" />
                                        Accountable Editor
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {manuscript.section_editor ? (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-sidebar-border/50">
                                            <div className="size-8 rounded-full bg-background flex items-center justify-center font-bold text-[10px] border shadow-sm">
                                                {manuscript.section_editor.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold leading-none">{manuscript.section_editor.name}</p>
                                                <p className="text-[9px] text-muted-foreground mt-0.5">Section Editor</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleAssignment} className="space-y-4">
                                            <select
                                                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                                value={assignmentForm.data.editor_id}
                                                onChange={e => assignmentForm.setData('editor_id', e.target.value)}
                                            >
                                                <option value="">-- Choose Editor --</option>
                                                {editors.map(editor => (
                                                    <option key={editor.id} value={editor.id}>{editor.name}</option>
                                                ))}
                                            </select>
                                            <Button type="submit" variant="outline" className="w-full h-10 rounded-full text-xs" disabled={!assignmentForm.data.editor_id}>
                                                Assign Now
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
