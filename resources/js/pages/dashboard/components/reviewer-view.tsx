import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { ClipboardCheck, Calendar, History, AlertCircle, CheckCircle2, Timer, Star, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from './stat-card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

export const ReviewerView = ({ data }: { data: ReviewerData }) => {
    const { post, processing } = useForm();

    const stats = [
        { label: 'Pending Reviews', value: data.stats.pendingReviews.toString(), icon: ClipboardCheck, trend: 'Action', color: 'blue' as const, desc: 'Awaiting your review' },
        { label: 'Completed', value: data.stats.completedReviews.toString(), icon: History, trend: 'Done', color: 'emerald' as const, desc: 'Total contributions' },
        { label: 'Overdue', value: data.stats.overdueReviews.toString(), icon: AlertCircle, trend: 'Urgent', color: 'red' as const, desc: 'Past deadline' },
        { label: 'Invitations', value: data.stats.activeInvitations.toString(), icon: Star, trend: 'New', color: 'amber' as const, desc: 'Review requests' },
    ];

    const handleAccept = (assignmentId: number) => {
        post(route('reviewer.assignments.accept', assignmentId));
    };

    const handleDecline = (assignmentId: number) => {
        post(route('reviewer.assignments.decline', assignmentId));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <ClipboardCheck className="size-5 text-primary" />
                                Assigned Manuscripts
                            </CardTitle>
                            <CardDescription>Articles currently awaiting your review.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.activeAssignments.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                                <ClipboardCheck className="size-12" />
                                <p className="text-sm font-medium">No assigned manuscripts to review.</p>
                            </div>
                        ) : (
                            data.activeAssignments.map((review) => (
                                <div key={review.id} className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-primary/20 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                                                    <Calendar className="size-3" />
                                                    Due: {review.due_date}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100 max-w-xl">
                                                {review.title}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {review.status === 'pending' ? (
                                                <>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="outline" className="w-full md:w-auto">Decline</Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Decline Review Invitation?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to decline this review invitation? You can provide a reason in the next step.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDecline(review.id)} className="bg-red-600 hover:bg-red-700">
                                                                    Confirm Decline
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" className="w-full md:w-auto bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
                                                                Accept Invitation
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Accept Review Invitation?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    By accepting, you agree to review this manuscript by <strong>{review.due_date}</strong>. You will gain access to the full manuscript after accepting.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleAccept(review.id)}>
                                                                    Accept & Continue
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            ) : (
                                                <Button size="sm" className="w-full md:w-auto bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" asChild>
                                                    <Link href={`/reviewer/assignments/${review.id}`}>Start Review</Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <History className="size-5 text-primary" />
                                Review Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.activityData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#888' }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="activity" radius={[4, 4, 0, 0]} barSize={24} fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
