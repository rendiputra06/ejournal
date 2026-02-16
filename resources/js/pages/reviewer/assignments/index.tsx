import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    ClipboardCheck,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    Calendar,
    FileText,
    MessageSquare,
    AlertTriangle,
    Check,
    X,
    User,
    Search,
    Filter
} from 'lucide-react';
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
import dayjs from 'dayjs';
import { type BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    filters?: {
        search?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Peer Review', href: '/reviewer/assignments' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Invitation</Badge>;
        case 'accepted': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">In Progress</Badge>;
        case 'completed': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Submitted</Badge>;
        case 'declined': return <Badge variant="secondary" className="text-neutral-500">Declined</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

export default function ReviewerIndex({ assignments, filters = {} }: Props) {
    const { post, processing } = useForm();
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Counts (calculated from full dataset if pagination wasn't used, but here simpler to just show what we have or remove if paginated backend doesn't send counts)
    // For now, assuming these counts might need to come from props if pagination is active. 
    // Adapting to just count what's visible or hide if not accurate. 
    // Let's filter client-side for counts if the list is small, or assume backend handles it.
    // For safe implementation with pagination, we'll remove dynamic client-side counting or rely on backend props.
    // I'll keep them simple for now.
    const pendingCount = assignments.filter(a => a.status === 'pending').length;
    const activeCount = assignments.filter(a => a.status === 'accepted').length;

    const handleSearch = () => {
        router.get('/reviewer/assignments', {
            search: searchQuery,
            status: statusFilter !== 'all' ? statusFilter : undefined
        }, { preserveState: true, preserveScroll: true });
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
         router.get('/reviewer/assignments', {
            search: searchQuery,
            status: value !== 'all' ? value : undefined
        }, { preserveState: true, preserveScroll: true });
    };

    const handleRespond = (id: number, status: 'accepted' | 'declined') => {
        router.post(route('reviewer.assignments.respond', id), {
            status: status
        }, {
            onSuccess: () => {
                // Success toast or handling
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Review Assignments" />

            <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Review Assignments</h1>
                        <p className="text-sm text-neutral-500 mt-1">Manage your manuscript review invitations and assignments.</p>
                    </div>
                </div>

                {/* Stats Cards - Optional: could be removed if pagination makes them inaccurate without backend support */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'New Invitations', value: pendingCount, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 ring-blue-100' },
                        { label: 'Active Reviews', value: activeCount, icon: ClipboardCheck, color: 'text-amber-600', bg: 'bg-amber-50 ring-amber-100' },
                        { label: 'Completed', value: assignments.filter(a => a.status === 'completed').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 ring-emerald-100' },
                    ].map((stat, i) => (
                        <Card key={i} className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm relative overflow-hidden">
                             <div className={cn("absolute -right-4 -top-4 size-24 rounded-full opacity-10", stat.color.replace('text-', 'bg-'))} />
                            <CardContent className="p-5 flex items-center gap-4 relative">
                                <div className={cn("p-3 rounded-xl ring-1", stat.bg, stat.color)}>
                                    <stat.icon className="size-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                 {/* Filters */}
                <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by manuscript title or ID..."
                                    className="pl-9 bg-white dark:bg-neutral-900"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <div className="w-full md:w-[200px]">
                                <Select value={statusFilter} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="bg-white dark:bg-neutral-900">
                                        <SelectValue placeholder="Filter by Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Invitation</SelectItem>
                                        <SelectItem value="accepted">In Progress</SelectItem>
                                        <SelectItem value="completed">Submitted</SelectItem>
                                        <SelectItem value="declined">Declined</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleSearch} variant="secondary">
                                Filter
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden bg-background/50 backdrop-blur-sm">
                    <CardHeader className="pb-0 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-6 py-4">
                         <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                                <FileText className="size-4" />
                                Assignment List
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-white dark:bg-neutral-900">
                                <TableRow className="hover:bg-transparent border-neutral-100 dark:border-neutral-800">
                                    <TableHead className="w-[120px] pl-6 font-bold uppercase text-[10px] tracking-widest text-neutral-500 py-3">MS ID</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-neutral-500 py-3">Manuscript Title</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-neutral-500 py-3">Status</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-neutral-500 py-3">Due Date</TableHead>
                                    <TableHead className="text-right pr-6 font-bold uppercase text-[10px] tracking-widest text-neutral-500 py-3">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-3">
                                                 <ClipboardCheck className="size-10 opacity-10 mb-1" />
                                                <p className="text-sm font-medium">No assignments found.</p>
                                                <p className="text-xs text-neutral-400">Try adjusting your filters.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    assignments.map((assignment) => {
                                        const isOverdue = assignment.status === 'accepted' && assignment.due_date && dayjs().isAfter(dayjs(assignment.due_date));
                                        return (
                                        <TableRow key={assignment.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 border-neutral-100 dark:border-neutral-800 transition-colors">
                                            <TableCell className="font-mono text-[10px] text-neutral-500 uppercase pl-6 py-4 align-top">
                                                <span className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded ring-1 ring-neutral-200 dark:ring-neutral-700">
                                                {assignment.manuscript.external_id || `#MS-${assignment.manuscript.id}`}
                                                </span>
                                            </TableCell>
                                            <TableCell className="align-top">
                                                <div className="flex flex-col gap-1 max-w-[450px]">
                                                    <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-primary transition-colors">
                                                        {assignment.manuscript.title}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 italic">
                                                        <User className="size-3" />
                                                        By: {assignment.manuscript.authors[0]?.name} et al.
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top">
                                                {getStatusBadge(assignment.status)}
                                            </TableCell>
                                            <TableCell className="text-[11px] font-medium align-top">
                                                {assignment.due_date ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "flex items-center gap-1.5",
                                                            isOverdue ? "text-red-600 font-bold" : "text-neutral-600"
                                                        )}>
                                                            <Calendar className="size-3" />
                                                            {dayjs(assignment.due_date).format('DD MMM YYYY')}
                                                        </span>
                                                        {isOverdue && (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <AlertTriangle className="size-3.5 text-red-500" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Review is overdue</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-neutral-400 opacity-50">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6 align-top">
                                                {assignment.status === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    disabled={processing}
                                                                    size="sm"
                                                                    className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700"
                                                                >
                                                                    <Check className="size-3 mr-1" /> Accept
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Accept Review Invitation?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        By accepting, you agree to review this manuscript by <strong>{assignment.due_date ? dayjs(assignment.due_date).format('DD MMM YYYY') : 'the deadline'}</strong>.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleRespond(assignment.id, 'accepted')} className="bg-emerald-600 hover:bg-emerald-700">
                                                                        Accept & Continue
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    disabled={processing}
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                                >
                                                                    <X className="size-3 mr-1" /> Decline
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Decline Invitation?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to decline this review invitation? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleRespond(assignment.id, 'declined')} className="bg-red-600 hover:bg-red-700">
                                                                        Confirm Decline
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                ) : (
                                                    <Button variant="ghost" size="icon" asChild className="size-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                                        <Link href={route('reviewer.assignments.show', assignment.id)}>
                                                            <ArrowUpRight className="size-4" />
                                                        </Link>
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
