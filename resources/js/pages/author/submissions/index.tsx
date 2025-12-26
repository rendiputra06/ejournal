import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, FileText, Clock, CheckCircle2, AlertCircle, MoreHorizontal } from 'lucide-react';
import dayjs from 'dayjs';
import { type BreadcrumbItem } from '@/types';

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
    manuscripts: Manuscript[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Author', href: '/dashboard/author' },
    { title: 'Submissions', href: '/author/submissions' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'draft':
            return <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200">Draf</Badge>;
        case 'submitted':
            return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Menunggu Review</Badge>;
        case 'screening':
            return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Prasaring</Badge>;
        case 'reviewing':
            return <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-100">Sedang Direview</Badge>;
        case 'final_decision':
            return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Selesai</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function Index({ manuscripts }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Daftar Pengajuan">
            <Head title="Naskah Saya" />

            <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Naskah Saya</h1>
                        <p className="text-muted-foreground">Kelola dan pantau status naskah yang Anda ajukan.</p>
                    </div>
                    <Button asChild className="gap-2 shadow-lg shadow-primary/20 rounded-full h-11 px-6">
                        <Link href={route('author.submissions.create')}>
                            <PlusCircle className="size-4" />
                            Ajukan Naskah Baru
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-blue-50/50 border-blue-100">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <FileText className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-600/80 uppercase tracking-wider">Total Naskah</p>
                                    <p className="text-2xl font-bold">{manuscripts.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-amber-50/50 border-amber-100">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                    <Clock className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-amber-600/80 uppercase tracking-wider">Sedang Diproses</p>
                                    <p className="text-2xl font-bold">
                                        {manuscripts.filter(m => ['submitted', 'screening', 'reviewing'].includes(m.status)).length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-50/50 border-green-100">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <CheckCircle2 className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-green-600/80 uppercase tracking-wider">Selesai</p>
                                    <p className="text-2xl font-bold">
                                        {manuscripts.filter(m => m.status === 'final_decision').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-sidebar-border/50 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-lg">Riwayat Pengajuan</CardTitle>
                        <CardDescription>Daftar lengkap naskah yang pernah Anda kirimkan ke jurnal kami.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="relative overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/10">
                                    <TableRow>
                                        <TableHead className="w-[120px]">ID Naskah</TableHead>
                                        <TableHead>Judul Naskah</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Tanggal Kirim</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {manuscripts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <AlertCircle className="size-8 opacity-20" />
                                                    <p>Belum ada naskah yang diajukan.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        manuscripts.map((manuscript) => (
                                            <TableRow key={manuscript.id} className="group hover:bg-muted/5 transition-colors">
                                                <TableCell className="font-mono text-xs text-muted-foreground uppercase">
                                                    {manuscript.external_id || `#${manuscript.id}`}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5 max-w-[400px]">
                                                        <span className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                                            {manuscript.title}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 line-clamp-1">
                                                            Kontributor: {manuscript.authors.map(a => a.name).join(', ')}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="capitalize text-sm font-medium">
                                                    {manuscript.category.replace('_', ' ')}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(manuscript.status)}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {dayjs(manuscript.created_at).format('DD MMM YYYY')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" asChild className="size-8 rounded-full hover:bg-muted">
                                                        <Link href={route('author.submissions.show', manuscript.id)}>
                                                            <MoreHorizontal className="size-4" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
