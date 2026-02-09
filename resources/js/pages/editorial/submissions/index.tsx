import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, MoreHorizontal, Inbox, Calendar, User, ArrowUpRight } from 'lucide-react';
import dayjs from 'dayjs';
import { type BreadcrumbItem } from '@/types';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import Pagination from '@/components/pagination';
import { cn } from '@/lib/utils';

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
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'Editorial Dashboard', href: '/editorial/submissions' },
];

export default function EditorialIndex({ manuscripts }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editorial Workflow" />

            <div className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <PageHeader
                        title="Editorial Workflow"
                        description="Review new submissions, manage the peer-review process, and make final publication decisions."
                    />

                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/50">
                                    <TableRow className="hover:bg-transparent border-neutral-100 dark:border-neutral-800">
                                        <TableHead className="w-[140px] text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Submission ID</TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Manuscript Details</TableHead>
                                        <TableHead className="w-[180px] text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4 text-center">Current Status</TableHead>
                                        <TableHead className="w-[180px] text-right text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Timeline</TableHead>
                                        <TableHead className="w-[100px] text-right text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4 sr-only">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {manuscripts.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-72 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Inbox className="size-12 opacity-10 mb-2" />
                                                    <p className="text-xl font-light">Your editorial inbox is clear.</p>
                                                    <p className="text-sm text-neutral-400">No manuscripts currently require your attention.</p>
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
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium">
                                                                <User className="size-3 opacity-60" />
                                                                {manuscript.authors.find(a => a.is_primary)?.name || manuscript.authors[0]?.name || 'Unknown Author'}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium uppercase tracking-tighter">
                                                                <FileText className="size-3 opacity-60" />
                                                                {manuscript.category.replace(/_/g, ' ')}
                                                            </div>
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
                                                        <span className="text-[10px] font-light text-neutral-500 uppercase tracking-widest">Received</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" asChild className="size-9 rounded-full hover:bg-primary/10 hover:text-primary transition-all group/btn">
                                                        <Link href={`/editorial/submissions/${manuscript.id}`}>
                                                            <ArrowUpRight className="size-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
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
