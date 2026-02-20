import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    ChevronLeft,
    FileText,
    Users,
    Calendar,
    ExternalLink,
    Download,
    Clock,
    CheckCircle2,
    AlertCircle,
    Info
} from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';

interface Author {
    id: number;
    name: string;
    email: string;
    affiliation: string;
    orcid: string;
    is_primary: boolean;
}

interface Manuscript {
    id: number;
    external_id: string;
    title: string;
    abstract: string;
    keywords: string;
    category: string;
    status: string;
    screening_notes: string | null;
    created_at: string;
    authors: Author[];
}

interface Props {
    manuscript: Manuscript;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Submissions', href: '/author/submissions' },
    { title: 'Details', href: '#' },
];

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'draft':
            return { label: 'Perlu Revisi', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', icon: AlertCircle };
        case 'submitted':
            return { label: 'Menunggu Review', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Clock };
        case 'screening':
            return { label: 'Prasaring', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Info };
        case 'reviewing':
            return { label: 'Dalam Peninjauan', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: Users };
        case 'final_decision':
            return { label: 'Selesai', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle2 };
        default:
            return { label: status, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: AlertCircle };
    }
};

export default function Show({ manuscript }: Props) {
    const status = getStatusConfig(manuscript.status);
    const StatusIcon = status.icon;

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Detail Naskah">
            <Head title={`Detail - ${manuscript.external_id || manuscript.id}`} />

            <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="rounded-full">
                            <Link href={route('author.submissions.index')}>
                                <ChevronLeft className="size-5" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{manuscript.external_id}</span>
                                <Badge className={cn("px-2 py-0 h-5 text-[10px] font-bold uppercase", status.bg, status.color, status.border)}>
                                    {status.label}
                                </Badge>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight line-clamp-1">{manuscript.title}</h1>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-sidebar-border/50 shadow-sm">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="size-4 text-primary" />
                                    Informasi Naskah
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Judul Lengkap</Label>
                                    <p className="text-sm font-semibold leading-relaxed">{manuscript.title}</p>
                                </div>

                                <Separator className="opacity-50" />

                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Abstrak</Label>
                                    <p className="text-sm leading-relaxed text-muted-foreground italic whitespace-pre-line">
                                        {manuscript.abstract}
                                    </p>
                                </div>

                                <Separator className="opacity-50" />

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Kategori</Label>
                                        <p className="text-sm font-bold capitalize">{manuscript.category.replace('_', ' ')}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Kata Kunci</Label>
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            {manuscript.keywords?.split(',').map((kw, i) => (
                                                <Badge key={i} variant="secondary" className="text-[10px] font-medium bg-muted/50 border-none">
                                                    {kw.trim()}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-sidebar-border/50 shadow-sm">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Users className="size-4 text-primary" />
                                    Daftar Penulis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {manuscript.authors.map((author, i) => (
                                        <div key={author.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border bg-muted/5 border-sidebar-border/30 gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 uppercase">
                                                    {author.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-sm">{author.name}</p>
                                                        {author.is_primary && (
                                                            <Badge className="bg-primary/20 text-primary border-none text-[9px] h-4 shadow-none">Korespondensi</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{author.email}</p>
                                                    <p className="text-[11px] text-muted-foreground opacity-70 mt-1">{author.affiliation}</p>
                                                </div>
                                            </div>
                                            {author.orcid && (
                                                <a href={`https://orcid.org/${author.orcid}`} target="_blank" className="flex items-center gap-1.5 text-[11px] font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 transition-colors hover:bg-green-100 w-fit">
                                                    <ExternalLink className="size-3" />
                                                    ORCID: {author.orcid}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-sidebar-border/50 shadow-sm overflow-hidden">
                            <CardHeader className={cn("pb-4", status.bg)}>
                                <div className="flex items-center justify-between">
                                    <Label className={cn("text-[10px] uppercase font-bold tracking-widest", status.color)}>Status Saat Ini</Label>
                                    <StatusIcon className={cn("size-4", status.color)} />
                                </div>
                                <CardTitle className={cn("text-xl pt-2", status.color)}>{status.label}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="size-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Tanggal Kirim</span>
                                        <span className="font-semibold">{dayjs(manuscript.created_at).format('DD MMMM YYYY')}</span>
                                    </div>
                                </div>
                                <Separator />
                                {manuscript.status === 'draft' && manuscript.screening_notes && (
                                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2 shadow-sm">
                                        <div className="flex items-center gap-2 text-rose-700">
                                            <AlertCircle className="size-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Catatan Editor / Keperluan Revisi</span>
                                        </div>
                                        <p className="text-sm text-rose-900 leading-relaxed italic border-l-2 border-rose-300 pl-3">
                                            "{manuscript.screening_notes}"
                                        </p>
                                    </div>
                                )}

                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Naskah Anda sedang berada dalam tahap <strong>{status.label}</strong>. Kami akan memberitahu Anda melalui email ketika ada perubahan status atau diperlukan tindakan lebih lanjut.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-sidebar-border/50 shadow-sm">
                            <CardHeader className="bg-muted/30 pb-3">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">File Naskah</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start h-12 gap-3 border-dashed border-primary/30 hover:bg-primary/5 hover:border-primary/50 text-left px-3 group transition-all">
                                                <div className="p-1.5 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                                                    <ExternalLink className="size-4 text-primary" />
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-sm font-bold truncate">Pratinjau</span>
                                                    <span className="text-[9px] text-muted-foreground">Lihat PDF</span>
                                                </div>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col">
                                            <div className="p-4 border-b bg-muted/30">
                                                <h3 className="font-bold flex items-center gap-2">
                                                    <FileText className="size-4 text-primary" />
                                                    Pratinjau Naskah
                                                </h3>
                                            </div>
                                            <div className="flex-1 bg-muted/20">
                                                <iframe
                                                    src={route('manuscripts.file.view', manuscript.id)}
                                                    className="w-full h-full border-none"
                                                    title="PDF Preview"
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Button variant="outline" className="w-full justify-start h-12 gap-3 border-dashed border-primary/30 hover:bg-primary/5 hover:border-primary/50 text-left px-3 group transition-all" asChild>
                                        <a href={route('manuscripts.file.download', manuscript.id)}>
                                            <div className="p-1.5 bg-primary/10 rounded group-hover:bg-primary/20 transition-colors">
                                                <Download className="size-4 text-primary" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-sm font-bold truncate">Unduh</span>
                                                <span className="text-[9px] text-muted-foreground">Simpan File</span>
                                            </div>
                                        </a>
                                    </Button>
                                </div>

                                <p className="text-[10px] text-center text-muted-foreground italic">
                                    Hanya penulis yang sah yang memiliki akses ke file ini.
                                </p>
                            </CardContent>
                        </Card>

                        {manuscript.status === 'submitted' && (
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 shadow-sm">
                                <AlertCircle className="size-5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                    Naskah sedang menunggu pengecekan awal oleh Editor-In-Chief. Biasanya memakan waktu 2-3 hari kerja.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
