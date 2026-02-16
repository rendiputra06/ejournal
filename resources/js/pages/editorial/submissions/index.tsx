import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    FileText,
    MoreHorizontal,
    Inbox,
    Calendar,
    User,
    ArrowUpRight,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { type BreadcrumbItem } from '@/types';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import Pagination from '@/components/pagination';
import { cn } from '@/lib/utils';
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
    updated_at: string;
    authors: Author[];
}

interface Props {
    manuscripts: {
        data: Manuscript[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number;
        to: number;
        total: number;
    };
    filters?: {
        search?: string;
        status?: string;
        category?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'Editorial Dashboard', href: '/editorial/submissions' },
];

export default function EditorialIndex({ manuscripts, filters = {} }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Debounce search could be implemented here, but for now we'll rely on Enter key or explicit search button
    const handleSearch = () => {
        router.get('/editorial/submissions', {
            search: searchQuery,
            status: statusFilter !== 'all' ? statusFilter : undefined
        }, { preserveState: true, preserveScroll: true });
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        router.get('/editorial/submissions', {
            search: searchQuery,
            status: value !== 'all' ? value : undefined
        }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editorial Workflow" />

            <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <PageHeader
                            title="Editorial Workflow"
                            description="Manage submissions and peer-review process."
                            className="mb-0"
                        />
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-9 gap-2">
                                <Download className="size-4" />
                                Export CSV
                            </Button>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by title, ID, or author..."
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
                                                <SelectItem value="submitted">Submitted</SelectItem>
                                                <SelectItem value="screening">Screening</SelectItem>
                                                <SelectItem value="reviewing">Peer Review</SelectItem>
                                                <SelectItem value="final_decision">Decision</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleSearch} variant="secondary">
                                    Apply Filters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden bg-background/50 backdrop-blur-sm">
                        <CardHeader className="pb-0 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                                    Submissions ({manuscripts.total})
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-white dark:bg-neutral-900">
                                    <TableRow className="hover:bg-transparent border-neutral-100 dark:border-neutral-800">
                                        <TableHead className="w-[100px] text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-3">ID</TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-3">Manuscript</TableHead>
                                        <TableHead className="w-[200px] text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-3">Authors</TableHead>
                                        <TableHead className="w-[140px] text-center text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-3">Status</TableHead>
                                        <TableHead className="w-[140px] text-right text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-3">Date</TableHead>
                                        <TableHead className="w-[50px] text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-3 text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {manuscripts.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-64 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Inbox className="size-12 opacity-10 mb-2" />
                                                    <p className="text-lg font-medium">No submissions found</p>
                                                    <p className="text-sm text-neutral-400">Try adjusting your filters or search query.</p>
                                                    {(searchQuery || statusFilter !== 'all') && (
                                                        <Button
                                                            variant="link"
                                                            onClick={() => {
                                                                setSearchQuery('');
                                                                setStatusFilter('all');
                                                                router.get('/editorial/submissions');
                                                            }}
                                                        >
                                                            Clear all filters
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        manuscripts.data.map((manuscript) => (
                                            <TableRow key={manuscript.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 border-neutral-100 dark:border-neutral-800 transition-colors">
                                                <TableCell className="py-4 align-top">
                                                    <span className="font-mono text-[10px] font-bold uppercase text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded ring-1 ring-neutral-200 dark:ring-neutral-700">
                                                        {manuscript.external_id || `#${manuscript.id}`}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className="flex flex-col gap-1 pr-4">
                                                        <Link
                                                            href={`/editorial/submissions/${manuscript.id}`}
                                                            className="font-bold text-sm text-neutral-900 dark:text-neutral-100 leading-snug hover:text-primary transition-colors line-clamp-2"
                                                        >
                                                            {manuscript.title}
                                                        </Link>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-medium uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800/50 px-2 py-0.5 rounded-full">
                                                                <FileText className="size-3 opacity-60" />
                                                                {manuscript.category.replace(/_/g, ' ')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className="flex flex-col gap-1">
                                                        {manuscript.authors.slice(0, 2).map((author, i) => (
                                                            <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                                                                <User className="size-3 opacity-60" />
                                                                <span className={cn(author.is_primary && "font-semibold")}>
                                                                    {author.name}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {manuscript.authors.length > 2 && (
                                                            <span className="text-[10px] text-neutral-400 pl-4.5">
                                                                +{manuscript.authors.length - 2} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top text-center">
                                                    <StatusBadge status={manuscript.status} />
                                                </TableCell>
                                                <TableCell className="align-top text-right">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                            {dayjs(manuscript.created_at).format('MMM D, YYYY')}
                                                        </div>
                                                        <span className="text-[10px] text-neutral-400">
                                                            {dayjs(manuscript.created_at).fromNow()}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top text-right">
                                                    <Button variant="ghost" size="sm" asChild className="h-8 gap-1.5 text-neutral-500 hover:text-primary hover:bg-primary/5 rounded-full px-3 transition-all">
                                                        <Link href={`/editorial/submissions/${manuscript.id}`}>
                                                            <Eye className="size-4" />
                                                            <span className="text-xs font-bold">View Details</span>
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
