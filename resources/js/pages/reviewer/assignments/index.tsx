import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    ClipboardCheck,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    Calendar,
    FileText,
    MessageSquare
} from 'lucide-react';
import dayjs from 'dayjs';
import { type BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

interface Manuscript {
    id: number;
    title: string;
    external_id: string;
    authors: { name: string }[];
}

interface Assignment {
    id: number;
    manuscript: Manuscript;
    status: string;
    due_date: string | null;
    created_at: string;
}

interface Props {
    assignments: Assignment[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Peer Review', href: '/reviewer/assignments' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">New Invitation</Badge>;
        case 'accepted': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Active</Badge>;
        case 'completed': return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
        case 'declined': return <Badge variant="secondary">Declined</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

export default function ReviewerIndex({ assignments }: Props) {
    const pendingCount = assignments.filter(a => a.status === 'pending').length;
    const activeCount = assignments.filter(a => a.status === 'accepted').length;

    return (
        <AppLayout title="Peer Review Assignments" breadcrumbs={breadcrumbs}>
            <Head title="Review Assignments" />

            <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Review Assignments</h1>
                        <p className="text-muted-foreground mt-1">Manage your manuscript review invitations and assignments.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'New Invitations', value: pendingCount, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Active Reviews', value: activeCount, icon: ClipboardCheck, color: 'text-amber-500', bg: 'bg-amber-50' },
                        { label: 'Completed', value: assignments.filter(a => a.status === 'completed').length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
                    ].map((stat, i) => (
                        <Card key={i} className="border-sidebar-border/50 shadow-sm">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                                    <stat.icon className="size-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</p>
                                    <p className="text-xl font-bold">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="border-sidebar-border/50 shadow-sm">
                    <CardHeader className="pb-0 pt-6">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="size-5 text-primary" />
                            Assignment List
                        </CardTitle>
                        <CardDescription>All peer review tasks assigned to you.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-sidebar-border/50">
                                    <TableHead className="w-[120px] pl-6 font-bold uppercase text-[10px] tracking-widest">MS ID</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Manuscript Title</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Due Date</TableHead>
                                    <TableHead className="text-right pr-6 font-bold uppercase text-[10px] tracking-widest">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            You have no review assignments.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    assignments.map((assignment) => (
                                        <TableRow key={assignment.id} className="group hover:bg-muted/5 transition-colors border-sidebar-border/30">
                                            <TableCell className="font-mono text-[10px] text-muted-foreground uppercase pl-6">
                                                {assignment.manuscript.external_id || `#MS-${assignment.manuscript.id}`}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5 max-w-[450px]">
                                                    <span className="font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                                        {assignment.manuscript.title}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground italic">
                                                        By: {assignment.manuscript.authors[0]?.name} et al.
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(assignment.status)}
                                            </TableCell>
                                            <TableCell className="text-[11px] font-medium">
                                                {assignment.due_date ? (
                                                    <span className={cn(
                                                        "flex items-center gap-1.5",
                                                        dayjs().isAfter(dayjs(assignment.due_date)) && "text-destructive"
                                                    )}>
                                                        <Calendar className="size-3" />
                                                        {dayjs(assignment.due_date).format('DD MMM YYYY')}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground opacity-50">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="icon" asChild className="size-8 rounded-full hover:bg-primary/5 hover:text-primary transition-all">
                                                    <Link href={route('reviewer.assignments.show', assignment.id)}>
                                                        <ArrowUpRight className="size-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
