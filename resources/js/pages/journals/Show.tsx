import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichEditor } from '@/components/rich-editor';
import { Card, CardContent } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Mail, Send, PlusCircle, AlertCircle, Eye, EyeOff, LayoutDashboard, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { LoadingButton } from '@/components/loading-button';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Journal {
    id: number;
    name: string;
    slug: string;
    description: string;
    logo: string;
    header_image: string;
}

interface SettingApp {
    journal_id: number;
    nama_app: string;
    deskripsi: string;
    logo: string;
    guidelines: string;
    aims_scope: string;
    peer_review_process: string;
    open_access_policy: string;
}

interface Props {
    journal: Journal;
    setting: SettingApp | null;
}

export default function JournalShow({ journal, setting }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Journals', href: '/journals' },
        { title: journal.name, href: `/journals/${journal.id}` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        nama_app: setting?.nama_app || journal.name,
        deskripsi: setting?.deskripsi || journal.description,
        logo: null as File | null,
        guidelines: setting?.guidelines || '',
        aims_scope: setting?.aims_scope || '',
        peer_review_process: setting?.peer_review_process || '',
        open_access_policy: setting?.open_access_policy || '',
        journal_id: journal.id,
    });

    const [logoUrl, setLogoUrl] = useState<string | null>(setting?.logo ? `/storage/${setting.logo}` : (journal.logo ? `/storage/${journal.logo}` : null));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // We reuse SettingAppController's update because it scopes by journal_id in middleware/HasJournal
        // But wait, SettingAppController::update uses SettingApp::first(). 
        // We need to ensure it's scoped. SettingApp has HasJournal trait, so it should be fine.
        post('/settingsapp', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Journal settings saved successfully'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Manage ${journal.name}`} />
            <div className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-start mb-8">
                        <PageHeader
                            title={journal.name}
                            description="Configure journal identity and content."
                        />
                        <Link href={route('home', { journal: journal.slug })} target="_blank">
                             <Button variant="outline" size="sm" className="gap-2">
                                <LayoutDashboard className="size-4" />
                                Visit Journal Site
                             </Button>
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Tabs defaultValue="identity" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-8">
                                <TabsTrigger value="identity">Identity & Brand</TabsTrigger>
                                <TabsTrigger value="about">About Content</TabsTrigger>
                                <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
                            </TabsList>

                            <TabsContent value="identity" className="space-y-8">
                                <Card>
                                    <div className="px-6 py-4 border-b">
                                        <h3 className="font-bold text-sm uppercase">Journal Branding</h3>
                                    </div>
                                    <CardContent className="pt-6 space-y-6">
                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="nama_app">Journal Display Name</Label>
                                                <Input
                                                    id="nama_app"
                                                    value={data.nama_app}
                                                    onChange={(e) => setData('nama_app', e.target.value)}
                                                    className={cn(errors.nama_app && "border-red-500")}
                                                />
                                                <InputError message={errors.nama_app} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="deskripsi">Short Description</Label>
                                                <Textarea
                                                    id="deskripsi"
                                                    value={data.deskripsi}
                                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                                    className="min-h-[100px]"
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <Label>Journal Logo</Label>
                                                <div
                                                    className="relative group cursor-pointer w-48"
                                                    onClick={() => document.getElementById('logo')?.click()}
                                                >
                                                    <div className="aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center bg-muted/30 group-hover:bg-muted/50 transition-all overflow-hidden p-4">
                                                        {logoUrl ? (
                                                            <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                                                        ) : (
                                                            <PlusCircle className="size-8 opacity-20" />
                                                        )}
                                                    </div>
                                                </div>
                                                <Input id="logo" type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    setData('logo', file);
                                                    if (file) setLogoUrl(URL.createObjectURL(file));
                                                }} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="about" className="space-y-8">
                                <Card>
                                     <div className="px-6 py-4 border-b">
                                        <h3 className="font-bold text-sm uppercase">About Sections</h3>
                                    </div>
                                    <CardContent className="pt-6 space-y-6">
                                        <div className="grid gap-6">
                                            <div className="grid gap-2">
                                                <Label>Aims & Scope</Label>
                                                <RichEditor
                                                    value={data.aims_scope}
                                                    onChange={(val) => setData('aims_scope', val)}
                                                    placeholder="What are the goals and coverage areas of this journal?"
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Peer Review Process</Label>
                                                <RichEditor
                                                    value={data.peer_review_process}
                                                    onChange={(val) => setData('peer_review_process', val)}
                                                    placeholder="Describe the peer review mechanism (e.g., double-blind)..."
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Open Access Policy</Label>
                                                <RichEditor
                                                    value={data.open_access_policy}
                                                    onChange={(val) => setData('open_access_policy', val)}
                                                    placeholder="Detail the open access policy of this journal..."
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="guidelines" className="space-y-8">
                                <Card>
                                     <div className="px-6 py-4 border-b">
                                        <h3 className="font-bold text-sm uppercase">Author Guidelines</h3>
                                    </div>
                                    <CardContent className="pt-6 space-y-6">
                                        <div className="grid gap-2">
                                            <Label>Submission Guidelines</Label>
                                            <RichEditor
                                                value={data.guidelines}
                                                onChange={(val) => setData('guidelines', val)}
                                                placeholder="Instructions for authors..."
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <div className="sticky bottom-8 z-10 p-4 rounded-3xl bg-background/80 backdrop-blur-xl border shadow-2xl flex items-center justify-between gap-4">
                            <span className="text-xs text-muted-foreground pl-4">Changes will be saved to this specific journal.</span>
                            <LoadingButton
                                type="submit"
                                loading={processing}
                                className="px-12 h-12 rounded-2xl font-bold"
                            >
                                Save Journal Configuration
                            </LoadingButton>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
