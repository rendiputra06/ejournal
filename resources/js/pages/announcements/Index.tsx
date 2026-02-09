import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { PageHeader } from '@/components/page-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import Pagination from '@/components/pagination';
import { Megaphone, Edit2, Trash2, Calendar, User } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'Announcements', href: '/editorial/announcements' },
];

interface Announcement {
    id: number;
    title: string;
    content: string;
    published_at: string;
    created_at: string;
    user?: {
        name: string;
    };
}

interface Props {
    announcements: {
        data: Announcement[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function AnnouncementIndex({ announcements }: Props) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number) => {
        destroy(`/editorial/announcements/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Announcement Management" />
            <div className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <PageHeader
                        title="Journal Announcements"
                        description="Broadcast important news, calls for papers, and system updates to the public journal site."
                    >
                        <Button asChild className="gap-2 shadow-lg shadow-primary/10 rounded-full">
                            <Link href="/editorial/announcements/create">
                                <Megaphone className="size-4" />
                                <span>Create Announcement</span>
                            </Link>
                        </Button>
                    </PageHeader>

                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/50">
                                    <TableRow className="hover:bg-transparent border-neutral-100 dark:border-neutral-800">
                                        <TableHead className="w-[400px] text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Announcement Detail</TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Posted By</TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Schedule</TableHead>
                                        <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {announcements.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-48 text-center text-neutral-500">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Megaphone className="size-10 opacity-10 mb-2" />
                                                    <p className="text-lg font-light italic">No announcements found.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        announcements.data.map((item) => (
                                            <TableRow key={item.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 border-neutral-100 dark:border-neutral-800 transition-colors">
                                                <TableCell className="py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-primary transition-colors line-clamp-1 capitalize">
                                                            {item.title}
                                                        </span>
                                                        <p className="text-xs text-neutral-500 line-clamp-1 italic">
                                                            {item.content.substring(0, 100)}...
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <User className="size-3.5 text-neutral-400" />
                                                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                                            {item.user?.name ?? 'System'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                                            <Calendar className="size-3.5 opacity-60" />
                                                            {dayjs(item.published_at).format('MMM D, YYYY')}
                                                        </div>
                                                        <span className="text-[10px] text-neutral-500 font-light">
                                                            Created {dayjs(item.created_at).fromNow()}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button asChild variant="ghost" size="icon" className="size-8 rounded-full hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20">
                                                            <Link href={`/editorial/announcements/${item.id}/edit`}>
                                                                <Edit2 className="size-3.5" />
                                                            </Link>
                                                        </Button>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                                                                    <Trash2 className="size-3.5" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="rounded-2xl border-none shadow-2xl ring-1 ring-neutral-200 dark:ring-neutral-800">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-xl font-bold text-red-600">Delete Announcement?</AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-sm pt-2">
                                                                        Are you sure you want to delete this announcement? This action will immediately remove it from the public homepage.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter className="pt-6">
                                                                    <AlertDialogCancel className="rounded-xl border-neutral-200">Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(item.id)}
                                                                        disabled={processing}
                                                                        className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all active:scale-95"
                                                                    >
                                                                        Delete Announcement
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Pagination links={announcements.links} />
                </div>
            </div>
        </AppLayout>
    );
}
