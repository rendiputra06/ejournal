import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    FileText,
    Search,
    Filter,
    ChevronRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal,
    Mail,
    ArrowUpRight,
    Users,
    Layers,
    BookOpen
} from 'lucide-react';
import dayjs from 'dayjs';
import { type BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

interface Manuscript {
    id: number;
    external_id: string;
    title: string;
    category: string;
    status: string;
    created_at: string;
    user: {
        name: string;
    };
    authors: {
        name: string;
    }[];
}

interface Props {
    manuscripts: Manuscript[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Submissions', href: '/editorial/submissions' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'submitted': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">New Submission</Badge>;
        case 'screening': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Screening</Badge>;
        case 'reviewing': return <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">Peer Review</Badge>;
        case 'final_decision': return <Badge className="bg-green-100 text-green-700 border-green-200">Final Decision</Badge>;
        case 'published': return <Badge className="bg-emerald-500 text-white font-bold">Published</Badge>;
        case 'archived': return <Badge variant="secondary">Archived</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

export default function EditorialIndex({ manuscripts }: Props) {
    const stats = [
        { label: 'Total active', value: manuscripts.filter(m => m.status !== 'archived').length, icon: FileText, color: 'text-primary' },
        { label: 'New', value: manuscripts.filter(m => m.status === 'submitted').length, icon: Mail, color: 'text-blue-500' },
        { label: 'In Review', value: manuscripts.filter(m => m.status === 'reviewing').length, icon: Search, color: 'text-amber-500' },
        { label: 'Published', value: manuscripts.filter(m => m.status === 'published').length, icon: BookOpen, color: 'text-emerald-500' },
    ];

    return (
        <AppLayout title="Editorial Submissions" breadcrumbs={breadcrumbs}>
            <Head title="Manuscript Management" />

            <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manuscript Management</h1>
                        <p className="text-muted-foreground mt-1">Review, assign, and manage journal submissions.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <Card key={i} className="border-sidebar-border/50 shadow-sm overflow-hidden group hover:border-primary/50 transition-colors">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={cn("p-2 rounded-xl bg-muted group-hover:bg-primary/5 transition-colors", stat.color)}>
                                    <stat.icon className="size-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none">{stat.label}</p>
                                    <p className="text-xl font-bold mt-1">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="border-sidebar-border/50 shadow-sm">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Layers className="size-5 text-primary" />
                                Submission Queue
                            </CardTitle>
                            <CardDescription>Listing all manuscripts currently in the editorial workflow.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                                <Input placeholder="Search titles..." className="pl-9 h-9 rounded-full bg-muted/50 border-none focus-visible:ring-1" />
                            </div>
                            <Button variant="outline" size="sm" className="rounded-full h-9">
                                <Filter className="size-4 mr-2" /> Filter
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-sidebar-border/50">
                                    <TableHead className="w-[120px] pl-6 font-bold uppercase text-[10px] tracking-widest">ID</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-left">Article Info</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">Category</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-center">Date</TableHead>
                                    <TableHead className="w-[80px] pr-6"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {manuscripts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                            No manuscripts found in the queue.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    manuscripts.map((ms) => (
                                        <TableRow key={ms.id} className="group hover:bg-muted/5 transition-colors border-sidebar-border/30">
                                            <TableCell className="font-mono text-[10px] text-muted-foreground uppercase pl-6">
                                                {ms.external_id || `#MS-${ms.id}`}
                                            </TableCell>
                                            <TableCell className="text-left">
                                                <div className="flex flex-col gap-0.5 max-w-[400px]">
                                                    <span className="font-bold line-clamp-1 group-hover:text-primary transition-colors">
                                                        {ms.title}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Users className="size-3" />
                                                        {ms.authors[0]?.name}{ms.authors.length > 1 ? ' et al.' : ''}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="text-[9px] uppercase font-medium border-sidebar-border/50 opacity-80">
                                                    {ms.category.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {getStatusBadge(ms.status)}
                                            </TableCell>
                                            <TableCell className="text-center text-xs text-muted-foreground font-medium whitespace-nowrap">
                                                {dayjs(ms.created_at).format('MMM DD, YYYY')}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="icon" asChild className="size-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                                    <Link href={route('editorial.submissions.show', ms.id)}>
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
