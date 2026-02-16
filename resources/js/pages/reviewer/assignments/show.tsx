import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
    Info,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Calendar,
    FileText,
    Send,
    Download,
    MessageSquare,
    AlertCircle,
    Star,
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
}

interface Manuscript {
    id: number;
    title: string;
    abstract: string;
    keywords: string;
    external_id: string;
    authors: Author[];
}

interface Review {
    id: number;
    relevance_score: number;
    novelty_score: number;
    methodology_score: number;
    comment_for_author: string;
    comment_for_editor: string;
    recommendation: string;
}

interface Assignment {
    id: number;
    manuscript: Manuscript;
    status: string;
    due_date: string | null;
    review: Review | null;
}

interface Props {
    assignment: Assignment;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reviewer Assignments', href: '/reviewer/assignments' },
    { title: 'Assignment Details', href: '#' },
];

export default function ReviewerShow({ assignment }: Props) {
    const { manuscript } = assignment;
    const [isAccepted, setIsAccepted] = useState(assignment.status === 'accepted');

    const responseForm = useForm({
        status: '' as 'accepted' | 'declined'
    });

    const reviewForm = useForm({
        relevance_score: assignment.review?.relevance_score || 0,
        novelty_score: assignment.review?.novelty_score || 0,
        methodology_score: assignment.review?.methodology_score || 0,
        comment_for_author: assignment.review?.comment_for_author || '',
        comment_for_editor: assignment.review?.comment_for_editor || '',
        recommendation: assignment.review?.recommendation || ''
    });

    const handleResponse = (status: 'accepted' | 'declined') => {
        responseForm.setData('status', status);
        responseForm.post(route('reviewer.assignments.respond', assignment.id), {
            onSuccess: () => {
                if (status === 'accepted') setIsAccepted(true);
            }
        });
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post(route('reviewer.assignments.submit', assignment.id), {
            onSuccess: () => toast.success('Manuscript review submitted successfully.'),
        });
    };

    const ScoreSelector = ({ label, field, value }: { label: string, field: string, value: number }) => (
        <div className="space-y-2">
            <Label className="text-sm font-semibold">{label}</Label>
            <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                    <button
                        key={s}
                        type="button"
                        disabled={assignment.status === 'completed'}
                        onClick={() => reviewForm.setData(field as any, s)}
                        className={cn(
                            "size-10 rounded-xl border-2 transition-all flex items-center justify-center font-bold text-sm",
                            value === s ? "border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20" :
                                "border-sidebar-border/50 hover:border-primary/50 text-muted-foreground"
                        )}
                    >
                        {s}
                    </button>
                ))}
            </div>
            <p className="text-[10px] text-muted-foreground italic">(1 = Poor, 5 = Excellent)</p>
        </div>
    );

    return (
        <AppLayout title="Manuscript Review" breadcrumbs={breadcrumbs}>
            <Head title={`Review: ${manuscript.title}`} />

            <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <Link
                        href={route('reviewer.assignments.index')}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Assignment List
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{manuscript.external_id}</span>
                                <Badge className={cn(
                                    "px-2 py-0 h-5 text-[10px] font-bold uppercase",
                                    assignment.status === 'pending' ? "bg-blue-100 text-blue-700" :
                                        assignment.status === 'accepted' ? "bg-amber-100 text-amber-700" :
                                            "bg-green-100 text-green-700"
                                )}>
                                    {assignment.status === 'pending' ? 'Invitation' : assignment.status === 'accepted' ? 'Reviewing' : 'Completed'}
                                </Badge>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight">{manuscript.title}</h1>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                <Calendar className="size-3.5" />
                                Deadline:
                                <span className="text-foreground font-bold">{assignment.due_date ? dayjs(assignment.due_date).format('DD MMM YYYY') : '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="rounded-full h-8 px-4 border-primary/20 text-primary hover:bg-primary/5">
                                            <Eye className="size-3.5 mr-2" /> Preview
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
                                <Button variant="outline" size="sm" className="rounded-full h-8 px-4" asChild>
                                    <a href={route('manuscripts.file.download', manuscript.id)}>
                                        <Download className="size-3.5 mr-2" /> Download Manuscript
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {assignment.status === 'pending' && (
                    <Card className="border-primary/20 bg-primary/5 shadow-xl shadow-primary/5 animate-in fade-in zoom-in-95 duration-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Info className="size-5" />
                                Review Invitation Confirmation
                            </CardTitle>
                            <CardDescription className="text-primary/70">
                                You have been invited to perform a peer review for this manuscript. Please let us know if you are able to do so.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex gap-3">
                            <Button
                                onClick={() => handleResponse('accepted')}
                                className="rounded-full px-8 shadow-lg shadow-primary/20 font-bold"
                                disabled={responseForm.processing}
                            >
                                <CheckCircle2 className="mr-2 size-4" /> Accept Invitation
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleResponse('declined')}
                                className="rounded-full px-6 border-primary/20 text-primary hover:bg-primary/10 font-bold"
                                disabled={responseForm.processing}
                            >
                                <XCircle className="mr-2 size-4" /> Decline Invitation
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {(assignment.status === 'accepted' || assignment.status === 'completed') && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                        {/* Left: Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border-sidebar-border/50 shadow-sm">
                                <CardHeader className="bg-muted/30 pb-4 border-b border-sidebar-border/30">
                                    <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                                        <FileText className="size-4 text-primary" />
                                        Manuscript Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Abstract</Label>
                                        <p className="text-sm leading-relaxed text-foreground italic font-serif">
                                            {manuscript.abstract}
                                        </p>
                                    </div>
                                    <Separator className="opacity-50" />
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Keywords</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {manuscript.keywords?.split(',').map((k, i) => (
                                                <Badge key={i} variant="secondary" className="px-3 py-0.5 rounded-full text-[10px] font-medium opacity-80">{k.trim()}</Badge>
                                            ))}
                                            {!manuscript.keywords && <span className="text-xs text-muted-foreground italic">No keywords available</span>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Review Form */}
                            <form onSubmit={handleReviewSubmit} className="space-y-6">
                                <Card className={cn(
                                    "border-sidebar-border/50 shadow-sm overflow-hidden",
                                    assignment.status === 'completed' && "opacity-80 pointer-events-none"
                                )}>
                                    <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                                        <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2 text-primary">
                                            <Star className="size-4" />
                                            Manuscript Evaluation Form
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <ScoreSelector label="Subject Relevance" field="relevance_score" value={reviewForm.data.relevance_score} />
                                            <ScoreSelector label="Novelty" field="novelty_score" value={reviewForm.data.novelty_score} />
                                            <ScoreSelector label="Methodology & Analysis" field="methodology_score" value={reviewForm.data.methodology_score} />
                                        </div>

                                        <Separator className="opacity-50" />

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold">Comments for Authors</Label>
                                                <CardDescription>Provide constructive feedback to help authors improve their manuscript.</CardDescription>
                                                <Textarea
                                                    className="min-h-[150px] font-serif"
                                                    placeholder="Type your comments here..."
                                                    value={reviewForm.data.comment_for_author}
                                                    onChange={e => reviewForm.setData('comment_for_author', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="font-bold flex items-center gap-2">
                                                    Comments for Editors
                                                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter opacity-70">Private</Badge>
                                                </Label>
                                                <CardDescription>Secret feedback visible only to the editorial team.</CardDescription>
                                                <Textarea
                                                    className="min-h-[100px] bg-muted/20"
                                                    placeholder="Type secret notes for editors (optional)..."
                                                    value={reviewForm.data.comment_for_editor}
                                                    onChange={e => reviewForm.setData('comment_for_editor', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    {assignment.status !== 'completed' && (
                                        <CardFooter className="bg-muted/30 border-t border-sidebar-border/30 flex items-center justify-between p-6">
                                            <div className="space-y-1">
                                                <Label className="text-sm font-bold">Your Recommendation</Label>
                                                <select
                                                    className="h-10 px-4 rounded-full border-2 border-primary/20 bg-background text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                                    value={reviewForm.data.recommendation}
                                                    onChange={e => reviewForm.setData('recommendation', e.target.value)}
                                                    required
                                                >
                                                    <option value="">-- Choose Decision --</option>
                                                    <option value="accept">Accept</option>
                                                    <option value="minor_revision">Minor Revision</option>
                                                    <option value="major_revision">Major Revision</option>
                                                    <option value="reject">Reject</option>
                                                </select>
                                            </div>
                                            <Button type="submit" className="rounded-full px-10 h-11 font-bold shadow-xl shadow-primary/30" disabled={reviewForm.processing}>
                                                {reviewForm.processing ? 'Sending...' : 'Submit Review'}
                                                <Send className="ml-2 size-4" />
                                            </Button>
                                        </CardFooter>
                                    )}
                                </Card>
                            </form>
                        </div>

                        {/* Right: Meta */}
                        <div className="space-y-6">
                            <Card className="border-sidebar-border/50 shadow-sm border-t-4 border-t-amber-500">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <AlertCircle className="size-3.5" />
                                        Reviewer Instructions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-[12px] leading-relaxed space-y-3">
                                    <p>1. Reviews should be objective, constructive, and professional.</p>
                                    <p>2. Your identity is kept confidential from the authors (blind review).</p>
                                    <p>3. Please pay attention to data integrity and potential plagiarism.</p>
                                    <p>4. Complete the evaluation before the specified deadline.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
