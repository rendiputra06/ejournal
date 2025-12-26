import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Upload,
    Users,
    FileText,
    Send,
    Trash2,
    Plus,
    AlertCircle,
    BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

const STEPS = [
    { id: 1, title: 'Persiapan', icon: BookOpen },
    { id: 2, title: 'Metadata', icon: FileText },
    { id: 3, title: 'Kontributor', icon: Users },
    { id: 4, title: 'Unggah File', icon: Upload },
    { id: 5, title: 'Kirim', icon: Send },
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Submissions', href: '/author/submissions' },
    { title: 'New Submission', href: '/author/submissions/create' },
];

export default function Create() {
    const { auth } = usePage().props as any;
    const [currentStep, setCurrentStep] = useState(1);
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        abstract: '',
        keywords: '',
        category: 'research',
        authors: [
            { name: auth.user.name, email: auth.user.email, affiliation: '', orcid: '', is_primary: true as boolean }
        ],
        file: null as File | null,
        agreed: false,
    });

    const nextStep = () => {
        if (currentStep === 1 && !data.agreed) {
            toast.error('Anda harus menyetujui persyaratan untuk melanjutkan.');
            return;
        }
        if (currentStep === 2 && (!data.title || !data.abstract)) {
            toast.error('Judul dan Abstrak wajib diisi.');
            return;
        }
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    };

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleAddAuthor = () => {
        setData('authors', [
            ...data.authors,
            { name: '', email: '', affiliation: '', orcid: '', is_primary: false }
        ]);
    };

    const handleRemoveAuthor = (index: number) => {
        if (data.authors[index].is_primary) {
            toast.error('Penulis utama tidak dapat dihapus.');
            return;
        }
        const newAuthors = [...data.authors];
        newAuthors.splice(index, 1);
        setData('authors', newAuthors);
    };

    const handleAuthorChange = (index: number, field: string, value: any) => {
        const newAuthors = [...data.authors];
        (newAuthors[index] as any)[field] = value;

        // Ensure only one primary author
        if (field === 'is_primary' && value === true) {
            newAuthors.forEach((a, i) => { if (i !== index) a.is_primary = false; });
        }

        setData('authors', newAuthors);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('author.submissions.store'), {
            forceFormData: true,
            onError: (err) => {
                const firstError = Object.values(err)[0];
                toast.error(typeof firstError === 'string' ? firstError : 'Terjadi kesalahan validasi.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} title="Pengajuan Naskah Baru">
            <Head title="Submit Naskah" />

            <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
                {/* Progress Header */}
                <div className="relative flex justify-between">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={cn(
                                    "size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
                                    isActive ? "bg-primary border-primary text-primary-foreground scale-110" :
                                        isCompleted ? "bg-green-500 border-green-500 text-white" :
                                            "bg-background border-muted text-muted-foreground"
                                )}>
                                    {isCompleted ? <CheckCircle2 className="size-5" /> : <Icon className="size-5" />}
                                </div>
                                <span className={cn(
                                    "text-xs font-bold uppercase tracking-wider hidden md:block transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-6">
                    {/* Step 1: Checklist */}
                    {currentStep === 1 && (
                        <Card className="border-sidebar-border/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <CardHeader>
                                <CardTitle>Pernyataan Pra-Pengajuan</CardTitle>
                                <CardDescription>Pastikan naskah Anda memenuhi kriteria berikut sebelum melanjutkan.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-muted-foreground/10">
                                    {[
                                        "Naskah belum pernah diterbitkan sebelumnya, juga tidak sedang dalam pertimbangan oleh jurnal lain.",
                                        "File naskah dalam format dokumen Microsoft Word (OpenOffice, atau RTF).",
                                        "Teks mengikuti persyaratan gaya selingkung dan bibliografi yang digariskan dalam Panduan Penulis.",
                                        "Instruksi untuk blind review telah diikuti (identitas penulis dihapus dari file utama)."
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="mt-1 size-5 rounded border border-primary/30 flex items-center justify-center bg-background">
                                                <CheckCircle2 className="size-3 text-primary" />
                                            </div>
                                            <p className="text-sm leading-relaxed">{item}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 pt-4">
                                    <input
                                        type="checkbox"
                                        id="agreed"
                                        checked={data.agreed}
                                        onChange={(e) => setData('agreed', e.target.checked)}
                                        className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <Label htmlFor="agreed" className="text-sm font-semibold cursor-pointer">
                                        Saya telah membaca dan menyetujui semua persyaratan di atas.
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Metadata */}
                    {currentStep === 2 && (
                        <Card className="border-sidebar-border/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <CardHeader>
                                <CardTitle>Metadata Naskah</CardTitle>
                                <CardDescription>Lengkapi rincian naskah Anda.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul Naskah (Lengkap)</Label>
                                    <Textarea
                                        id="title"
                                        placeholder="Ketik judul lengkap di sini..."
                                        className="min-h-[80px]"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                    />
                                    {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="abstract">Abstrak (Bahasa Inggris)</Label>
                                    <Textarea
                                        id="abstract"
                                        placeholder="Ringkasan naskah Anda..."
                                        className="min-h-[150px]"
                                        value={data.abstract}
                                        onChange={e => setData('abstract', e.target.value)}
                                    />
                                    {errors.abstract && <p className="text-xs text-destructive">{errors.abstract}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="keywords">Kata Kunci</Label>
                                        <Input
                                            id="keywords"
                                            placeholder="Pisahkan dengan koma (misal: AI, Journal, IoT)"
                                            value={data.keywords}
                                            onChange={e => setData('keywords', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Kategori Artikel</Label>
                                        <select
                                            id="category"
                                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                        >
                                            <option value="research">Original Research</option>
                                            <option value="review">Literature Review</option>
                                            <option value="case_report">Case Report</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Contributors */}
                    {currentStep === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Daftar Penulis & Kontributor</h2>
                                    <p className="text-sm text-muted-foreground">Tambahkan rekan penulis jika ada.</p>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={handleAddAuthor} className="gap-2">
                                    <Plus className="size-4" /> Tambah Penulis
                                </Button>
                            </div>

                            {data.authors.map((author, index) => (
                                <Card key={index} className="border-sidebar-border/50 shadow-sm relative overflow-hidden">
                                    {author.is_primary && (
                                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-[10px] font-bold uppercase rounded-bl-lg">
                                            Corresponding Author
                                        </div>
                                    )}
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Nama Lengkap</Label>
                                                <Input
                                                    value={author.name}
                                                    onChange={e => handleAuthorChange(index, 'name', e.target.value)}
                                                    placeholder="Nama Lengkap & Gelar (jika perlu)"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Alamat Email</Label>
                                                <Input
                                                    type="email"
                                                    value={author.email}
                                                    onChange={e => handleAuthorChange(index, 'email', e.target.value)}
                                                    placeholder="email@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Afiliasi / Institusi</Label>
                                                <Input
                                                    value={author.affiliation}
                                                    onChange={e => handleAuthorChange(index, 'affiliation', e.target.value)}
                                                    placeholder="Universitas atau Organisasi"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>ORCID iD (Opsional)</Label>
                                                <Input
                                                    value={author.orcid}
                                                    onChange={e => handleAuthorChange(index, 'orcid', e.target.value)}
                                                    placeholder="0000-0000-0000-0000"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={author.is_primary}
                                                    onChange={e => handleAuthorChange(index, 'is_primary', e.target.checked)}
                                                    className="size-4 rounded border-gray-300 text-primary"
                                                />
                                                <span className="text-xs font-medium">Jadikan penulis korespondensi</span>
                                            </div>
                                            {!author.is_primary && (
                                                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveAuthor(index)} className="text-destructive hover:text-destructive hover:bg-destructive/5 gap-1">
                                                    <Trash2 className="size-4" /> Hapus
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Step 4: Upload */}
                    {currentStep === 4 && (
                        <Card className="border-sidebar-border/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <CardHeader>
                                <CardTitle>Unggah File Naskah</CardTitle>
                                <CardDescription>Unggah file naskah Anda dalam format PDF atau Word.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div
                                    className={cn(
                                        "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all hover:bg-muted/5 cursor-pointer",
                                        data.file ? "border-green-500/50 bg-green-50/10" : "border-muted-foreground/20"
                                    )}
                                    onClick={() => document.getElementById('manuscript_file')?.click()}
                                >
                                    <div className={cn(
                                        "size-16 rounded-full flex items-center justify-center",
                                        data.file ? "bg-green-100 text-green-600" : "bg-primary/5 text-primary"
                                    )}>
                                        <Upload className="size-8" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold">{data.file ? data.file.name : "Klik untuk memilih file"}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Hanya file PDF, DOC, atau DOCX (Max 10MB)</p>
                                    </div>
                                    <input
                                        id="manuscript_file"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                        onChange={e => setData('file', e.target.files?.[0] || null)}
                                    />
                                    {data.file && (
                                        <Button type="button" variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setData('file', null); }} className="mt-2">
                                            Ganti File
                                        </Button>
                                    )}
                                </div>

                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                                    <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                                        <strong>Penting:</strong> Untuk menjamin <em>blind review</em>, pastikan semua identitas penulis (nama, afiliasi) telah dihapus dari properti file dan konten di dalam naskah ini.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 5: Review */}
                    {currentStep === 5 && (
                        <Card className="border-sidebar-border/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <CardHeader>
                                <CardTitle>Tinjauan Akhir</CardTitle>
                                <CardDescription>Periksa kembali data Anda sebelum melakukan pengiriman (final submission).</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Judul Naskah</Label>
                                        <p className="text-sm font-semibold leading-relaxed">{data.title}</p>
                                    </div>
                                    <Separator className="opacity-50" />
                                    <div>
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Abstrak</Label>
                                        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-4 italic">"{data.abstract}"</p>
                                    </div>
                                    <Separator className="opacity-50" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Kategori</Label>
                                            <p className="text-sm font-bold capitalize">{data.category.replace('_', ' ')}</p>
                                        </div>
                                        <div>
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">File Naskah</Label>
                                            <p className="text-sm font-bold flex items-center gap-1">
                                                <Upload className="size-3 text-green-600" />
                                                {data.file?.name}
                                            </p>
                                        </div>
                                    </div>
                                    <Separator className="opacity-50" />
                                    <div>
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Daftar Penulis</Label>
                                        <div className="mt-2 space-y-2">
                                            {data.authors.map((a, i) => (
                                                <div key={i} className="text-xs flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[9px] h-4">P{i + 1}</Badge>
                                                    <span className="font-semibold">{a.name}</span>
                                                    <span className="text-muted-foreground opacity-60">({a.email})</span>
                                                    {a.is_primary && <Badge className="text-[9px] h-4 bg-primary/20 text-primary border-none shadow-none">Korespondensi</Badge>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                                    <p className="text-sm font-medium">Dengan mengeklik tombol di bawah, Anda secara resmi mengajukan naskah ini ke redaksi jurnal kami.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={prevStep}
                            disabled={currentStep === 1 || processing}
                            className="gap-2"
                        >
                            <ChevronLeft className="size-4" /> Kembali
                        </Button>

                        {currentStep < 5 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="gap-2 rounded-full px-8 shadow-lg shadow-primary/20"
                            >
                                Lanjut <ChevronRight className="size-4" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={processing || !data.file}
                                className="gap-2 rounded-full px-10 shadow-xl shadow-primary/30 h-11"
                            >
                                {processing ? "Mengirim..." : "Kirim Naskah"}
                                <Send className="size-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
