import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, FileText, CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';

interface Manuscript {
    id: number;
    external_id: string;
    title: string;
    status: string;
    created_at: string;
}

interface Stats {
    total: number;
    active: number;
    published: number;
}

interface Props {
    recentSubmissions: Manuscript[];
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Author Panel', href: '/dashboard/author' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'draft': return <Badge variant="secondary">Draf</Badge>;
        case 'submitted': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Menunggu</Badge>;
        case 'screening': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Prasaring</Badge>;
        case 'reviewing': return <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">Review</Badge>;
        case 'final_decision': return <Badge className="bg-green-100 text-green-700 border-green-200">Selesai</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

export default function AuthorDashboard({ recentSubmissions, stats }: Props) {
    return (
        <AppLayout title="Author Dashboard" breadcrumbs={breadcrumbs}>
            <Head title="Author Dashboard" />

            <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Panel Penulis</h1>
                        <p className="text-muted-foreground mt-1">Selamat datang kembali. Berikut ringkasan aktivitas naskah Anda.</p>
                    </div>
                    <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/20 h-12 px-8">
                        <Link href={route('author.submissions.create')}>
                            <PlusCircle className="mr-2 size-5" />
                            Kirim Naskah Baru
                        </Link>
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-sidebar-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <FileText className="size-16 text-primary" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Submission</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">Naskah yang pernah diajukan</p>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Clock className="size-16 text-amber-500" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Sedang Diproses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.active}</div>
                            <p className="text-xs text-muted-foreground mt-1">Menunggu review & prasaring</p>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <CheckCircle className="size-16 text-emerald-500" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Diterbitkan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.published}</div>
                            <p className="text-xs text-muted-foreground mt-1">Naskah yang sudah selesai</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Submissions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 border-sidebar-border/50 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Pengajuan Terbaru</CardTitle>
                                <CardDescription>Pantau status 5 naskah terakhir Anda.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/5">
                                <Link href={route('author.submissions.index')} className="flex items-center gap-1">
                                    Lihat Semua <ChevronRight className="size-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {recentSubmissions.length === 0 ? (
                                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                                        <AlertCircle className="size-12" />
                                        <p className="text-sm font-medium">Belum ada aktivitas pengajuan.</p>
                                    </div>
                                ) : (
                                    recentSubmissions.map((m) => (
                                        <div
                                            key={m.id}
                                            className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl hover:bg-muted/5 transition-all border border-transparent hover:border-sidebar-border/30 gap-4"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-mono text-muted-foreground uppercase">{m.external_id}</span>
                                                    {getStatusBadge(m.status)}
                                                </div>
                                                <p className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{m.title}</p>
                                                <p className="text-[10px] text-muted-foreground">Dikirim pada {dayjs(m.created_at).format('DD MMMM YYYY')}</p>
                                            </div>
                                            <Button variant="outline" size="sm" asChild className="rounded-full px-4 h-8 shrink-0">
                                                <Link href={route('author.submissions.show', m.id)}>Detail</Link>
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Guidelines Card */}
                    <Card className="border-sidebar-border/50 shadow-sm bg-primary/5 border-primary/10">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="size-5 text-primary" />
                                Panduan Penulis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4">
                                "Kami berkomitmen pada proses peer-review yang adil dan transparan. Pastikan naskah Anda mengikuti standar penulisan kami."
                            </p>
                            <Separator />
                            <ul className="space-y-3">
                                {[
                                    { text: "Template Naskah (DOCX)", icon: FileText },
                                    { text: "Panduan Sitasi (APA)", icon: FileText },
                                    { text: "Kebijakan Plagiarisme", icon: AlertCircle },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-xs font-medium hover:text-primary cursor-pointer transition-colors group">
                                        <item.icon className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                            <Button variant="default" className="w-full h-10 mt-2 bg-primary/90 hover:bg-primary shadow-sm" asChild>
                                <Link href="/journal/guidelines">Pelajari Selengkapnya</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
