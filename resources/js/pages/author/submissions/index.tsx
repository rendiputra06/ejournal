import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, FileText, CheckCircle2, Inbox, Calendar, User, ArrowUpRight, Sparkles, Search, Filter } from 'lucide-react';
import dayjs from 'dayjs';
import { type BreadcrumbItem } from '@/types';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import Pagination from '@/components/pagination';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Author {
    id: number;
    name: string;
    email: string;
    is_primary: boolean;
}

interface Manuscript {
    id: number;
    external_id: string;
    title: string;
    category: string;
    status: string;
    created_at: string;
    authors: Author[];
}

interface Props {
    manuscripts: {
        data: Manuscript[];
        links: { url: string | null; label: string; active: boolean }[];
        active_count: number;
        finished_count: number;
    };
    filters?: {
        search?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'My Manuscripts', href: '/author/submissions' },
];

export default function AuthorIndex({ manuscripts, filters = {} }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const handleSearch = () => {
        router.get('/author/submissions', {
            search: searchQuery,
            status: statusFilter !== 'all' ? statusFilter : undefined
        }, { preserveState: true, preserveScroll: true });
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        router.get('/author/submissions', {
            search: searchQuery,
            status: value !== 'all' ? value : undefined
        }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manuscript Submission" />

            <div className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <PageHeader
                            title="My Manuscripts"
                            description="Monitor the progress of your scientific contributions and manage your submissions."
                            className="mb-0"
                        />
                        <Button asChild className="gap-2 shadow-lg shadow-primary/10 rounded-full group">
                            <Link href="/author/submissions/create">
                                <PlusCircle className="size-4 group-hover:rotate-90 transition-transform" />
                                <span>Submit New Manuscript</span>
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-blue-200 dark:ring-blue-900/30 bg-blue-50/20 dark:bg-blue-950/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <FileText className="size-24 -mr-8 -mt-8" />
                            </div>
                            <CardContent className="pt-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-2xl text-blue-600 dark:text-blue-400 ring-1 ring-blue-200/50 dark:ring-blue-800/50">
                                        <FileText className="size-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Total Submissions</p>
                                        <p className="text-3xl font-black text-neutral-900 dark:text-neutral-50">{manuscripts.data.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-amber-200 dark:ring-amber-900/30 bg-amber-50/20 dark:bg-amber-950/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Sparkles className="size-24 -mr-8 -mt-8" />
                            </div>
                            <CardContent className="pt-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-600 dark:text-amber-400 ring-1 ring-amber-200/50 dark:ring-amber-800/50">
                                        <Inbox className="size-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Active Review</p>
                                        <p className="text-3xl font-black text-neutral-900 dark:text-neutral-50">{manuscripts.active_count || 0}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-900/30 bg-emerald-50/20 dark:bg-emerald-950/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <CheckCircle2 className="size-24 -mr-8 -mt-8" />
                            </div>
                            <CardContent className="pt-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200/50 dark:ring-emerald-800/50">
                                        <CheckCircle2 className="size-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Completed</p>
                                        <p className="text-3xl font-black text-neutral-900 dark:text-neutral-50">{manuscripts.finished_count || 0}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by title or ID..."
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
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="submitted">Submitted</SelectItem>
                                            <SelectItem value="review">In Review</SelectItem>
                                            <SelectItem value="accepted">Accepted</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
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
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/50">
                                    <TableRow className="hover:bg-transparent border-neutral-100 dark:border-neutral-800">
                                        <TableHead className="w-[140px] text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Submission ID</TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Manuscript Information</TableHead>
                                        <TableHead className="w-[180px] text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4 text-center">Status</TableHead>
                                        <TableHead className="w-[180px] text-right text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Last Modified</TableHead>
                                        <TableHead className="w-[100px] text-right text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4 sr-only">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {manuscripts.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-72 text-center text-muted-foreground italic">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Inbox className="size-12 opacity-10 mb-2" />
                                                    <p className="text-xl font-light">No manuscripts found.</p>
                                                    <Button asChild variant="outline" size="sm" className="rounded-full">
                                                        <Link href="/author/submissions/create">Submit Your First Manuscript</Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        manuscripts.data.map((manuscript) => (
                                            <TableRow key={manuscript.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 border-neutral-100 dark:border-neutral-800 transition-colors">
                                                <TableCell className="py-5">
                                                    <span className="font-mono text-[10px] font-bold uppercase text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded ring-1 ring-neutral-200 dark:ring-neutral-700">
                                                        {manuscript.external_id || `#${manuscript.id}`}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1 max-w-[500px]">
                                                        <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                            {manuscript.title}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium uppercase tracking-tighter">
                                                            <FileText className="size-3 opacity-60" />
                                                            {manuscript.category.replace(/_/g, ' ')}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center">
                                                        <StatusBadge status={manuscript.status} />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                            <Calendar className="size-3 opacity-60" />
                                                            {dayjs(manuscript.created_at).format('MMM D, YYYY')}
                                                        </div>
                                                        <span className="text-[10px] font-light text-neutral-500 uppercase tracking-widest">Update</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" asChild className="size-9 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                                        <Link href={`/author/submissions/${manuscript.id}`}>
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

                    <Pagination links={manuscripts.links} />
                </div>
            </div>
        </AppLayout>
    );
}
