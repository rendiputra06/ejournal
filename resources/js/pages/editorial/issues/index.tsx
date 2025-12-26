import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    BookCopy,
    Plus,
    Calendar,
    Hash,
    Layers,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    FileText,
    ExternalLink,
    AlertCircle,
    Info,
    MoreHorizontal,
    Trash2,
    Edit
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Manuscript {
    id: number;
    title: string;
    external_id: string;
}

interface Issue {
    id: number;
    volume_id: number;
    number: string;
    title: string | null;
    year: number;
    month: string | null;
    status: string;
    manuscripts: Manuscript[];
}

interface Volume {
    id: number;
    number: string;
    year: number;
    description: string | null;
    is_active: boolean;
    issues: Issue[];
}

interface Props {
    volumes: Volume[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Issue Management', href: '/editorial/issues' },
];

export default function IssueIndex({ volumes }: Props) {
    const [expandedVolumes, setExpandedVolumes] = useState<Record<number, boolean>>({});

    const volumeForm = useForm({
        number: '',
        year: new Date().getFullYear(),
        description: ''
    });

    const issueForm = useForm({
        volume_id: '',
        number: '',
        year: new Date().getFullYear(),
        month: '',
        title: ''
    });

    const toggleVolume = (id: number) => {
        setExpandedVolumes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCreateVolume = (e: React.FormEvent) => {
        e.preventDefault();
        volumeForm.post(route('editorial.volumes.store'), {
            onSuccess: () => {
                toast.success('Volume created successfully.');
                volumeForm.reset();
            }
        });
    };

    const handleCreateIssue = (e: React.FormEvent) => {
        e.preventDefault();
        issueForm.post(route('editorial.issues.store'), {
            onSuccess: () => {
                toast.success('Issue created successfully.');
                issueForm.reset();
            }
        });
    };

    return (
        <AppLayout title="Issue Management" breadcrumbs={breadcrumbs}>
            <Head title="Publication & Issues" />

            <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Publication Management</h1>
                        <p className="text-muted-foreground mt-1">Organize manuscripts into volumes and issues.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Volume & Issue List */}
                    <div className="lg:col-span-2 space-y-6">
                        {volumes.length === 0 ? (
                            <Card className="border-sidebar-border/50 border-dashed">
                                <CardContent className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-3">
                                    <BookCopy className="size-12 opacity-10" />
                                    <p>No volumes created yet. Start by creating a new Volume.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            volumes.map((volume) => (
                                <Card key={volume.id} className="border-sidebar-border/50 shadow-sm overflow-hidden">
                                    <CardHeader
                                        className="cursor-pointer hover:bg-muted/30 transition-colors py-4 px-6 border-b border-sidebar-border/30"
                                        onClick={() => toggleVolume(volume.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                    V{volume.number}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">Volume {volume.number} ({volume.year})</CardTitle>
                                                    <CardDescription className="text-xs line-clamp-1">{volume.description || 'No description provided'}</CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="px-2 font-mono text-[10px] uppercase">
                                                    {volume.issues.length} Issues
                                                </Badge>
                                                {expandedVolumes[volume.id] ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {expandedVolumes[volume.id] && (
                                        <CardContent className="p-0 animate-in slide-in-from-top-2 duration-300">
                                            {volume.issues.length === 0 ? (
                                                <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                                                    <Layers className="size-6 opacity-20" />
                                                    No issues created for this volume yet.
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-sidebar-border/30">
                                                    {volume.issues.map(issue => (
                                                        <div key={issue.id} className="p-6 space-y-4 hover:bg-muted/5 transition-colors">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <Badge className={cn(
                                                                        "font-bold text-[10px] h-5",
                                                                        issue.status === 'published' ? "bg-emerald-500" : "bg-amber-500"
                                                                    )}>
                                                                        {issue.status.toUpperCase()}
                                                                    </Badge>
                                                                    <h3 className="font-bold">Issue No. {issue.number} {issue.title && <span className="text-muted-foreground font-normal ml-1">- {issue.title}</span>}</h3>
                                                                </div>
                                                                <span className="text-xs text-muted-foreground font-medium">{issue.month} {issue.year}</span>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Included Manuscripts ({issue.manuscripts.length})</Label>
                                                                {issue.manuscripts.length === 0 ? (
                                                                    <p className="text-xs text-muted-foreground italic">No manuscripts assigned to this issue.</p>
                                                                ) : (
                                                                    <ul className="space-y-1.5">
                                                                        {issue.manuscripts.map(ms => (
                                                                            <li key={ms.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/40 group">
                                                                                <div className="flex items-center gap-2 overflow-hidden">
                                                                                    <FileText className="size-3 text-primary opacity-50 shrink-0" />
                                                                                    <span className="truncate font-medium">{ms.title}</span>
                                                                                </div>
                                                                                <Link href={route('editorial.submissions.show', ms.id)} className="text-primary hover:underline flex items-center gap-1 shrink-0 ml-2 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                    Edit <ExternalLink className="size-2.5" />
                                                                                </Link>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    )}
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Right: Creation Forms */}
                    <div className="space-y-6">
                        {/* New Volume Form */}
                        <Card className="border-sidebar-border/50 shadow-sm border-t-4 border-t-primary">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Plus className="size-4 text-primary" />
                                    New Volume
                                </CardTitle>
                                <CardDescription>Create a new container for seasonal issues.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateVolume} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label>Volume No.</Label>
                                            <Input
                                                placeholder="e.g. 15"
                                                value={volumeForm.data.number}
                                                onChange={e => volumeForm.setData('number', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Year</Label>
                                            <Input
                                                type="number"
                                                value={volumeForm.data.year}
                                                onChange={e => volumeForm.setData('year', parseInt(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            placeholder="Brief overview of this volume..."
                                            className="min-h-[80px]"
                                            value={volumeForm.data.description}
                                            onChange={e => volumeForm.setData('description', e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full rounded-full font-bold shadow-lg shadow-primary/20" disabled={volumeForm.processing}>
                                        Create Volume
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* New Issue Form */}
                        <Card className="border-sidebar-border/50 shadow-sm border-t-4 border-t-indigo-600">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-indigo-600">
                                    <Layers className="size-4" />
                                    New Issue
                                </CardTitle>
                                <CardDescription>Create a specific issue under a volume.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateIssue} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Parent Volume</Label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                            value={issueForm.data.volume_id}
                                            onChange={e => issueForm.setData('volume_id', e.target.value)}
                                            required
                                        >
                                            <option value="">-- Select Volume --</option>
                                            {volumes.map(v => (
                                                <option key={v.id} value={v.id}>Volume {v.number} ({v.year})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label>Issue No.</Label>
                                            <Input
                                                placeholder="e.g. 1"
                                                value={issueForm.data.number}
                                                onChange={e => issueForm.setData('number', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Issue Year</Label>
                                            <Input
                                                type="number"
                                                value={issueForm.data.year}
                                                onChange={e => issueForm.setData('year', parseInt(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Release Month</Label>
                                        <Input
                                            placeholder="e.g. June"
                                            value={issueForm.data.month}
                                            onChange={e => issueForm.setData('month', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Issue Title (Optional)</Label>
                                        <Input
                                            placeholder="Special Edition: AI in Ethics"
                                            value={issueForm.data.title}
                                            onChange={e => issueForm.setData('title', e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-full font-bold shadow-lg shadow-indigo-100" disabled={issueForm.processing}>
                                        Create Issue
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
