import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Plus,
    Calendar,
    Layers,
    ChevronDown,
    ChevronUp,
    FileText,
    ArrowUpRight,
    Library,
    Edit2,
    Image as ImageIcon
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';

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
    cover_image_url?: string;
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
    { title: 'Home', href: '/dashboard' },
    { title: 'Publication Archives', href: '/editorial/issues' },
];

export default function IssueIndex({ volumes }: Props) {
    const [expandedVolumes, setExpandedVolumes] = useState<Record<number, boolean>>({});
    const [editingVolume, setEditingVolume] = useState<Volume | null>(null);
    const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

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
        title: '',
        cover_image: null as File | null,
    });

    // Edit Forms
    const editVolumeForm = useForm({
        number: '',
        year: 0,
        description: '' as string | null
    });

    const editIssueForm = useForm({
        number: '',
        year: 0,
        month: '' as string | null,
        title: '' as string | null,
        status: '',
        cover_image: null as File | null,
        _method: 'PUT'
    });

    const toggleVolume = (id: number) => {
        setExpandedVolumes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCreateVolume = (e: React.FormEvent) => {
        e.preventDefault();
        volumeForm.post('/editorial/volumes', {
            onSuccess: () => {
                toast.success('Volume created successfully.');
                volumeForm.reset();
            }
        });
    };

    const handleCreateIssue = (e: React.FormEvent) => {
        e.preventDefault();
        issueForm.post('/editorial/issues', {
            onSuccess: () => {
                toast.success('Issue created successfully.');
                issueForm.reset();
            }
        });
    };

    // Edit Handlers
    const startEditVolume = (volume: Volume, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingVolume(volume);
        editVolumeForm.setData({
            number: volume.number,
            year: volume.year,
            description: volume.description
        });
    };

    const updateVolume = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVolume) return;
        editVolumeForm.put(`/editorial/volumes/${editingVolume.id}`, {
            onSuccess: () => {
                toast.success('Volume updated.');
                setEditingVolume(null);
            }
        });
    };

    const startEditIssue = (issue: Issue) => {
        setEditingIssue(issue);
        editIssueForm.setData({
            number: issue.number,
            year: issue.year,
            month: issue.month,
            title: issue.title,
            status: issue.status,
            cover_image: null,
            _method: 'PUT'
        });
    };

    const updateIssue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingIssue) return;
        
        // Use post with _method: 'PUT' for file uploads in Inertia if needed, 
        // but typically standard router.put works if not strictly multipart/form-data limitation on standard put. 
        // With file uploads, usually POST with _method=PUT is safer in Laravel.
        editIssueForm.post(`/editorial/issues/${editingIssue.id}`, {
            onSuccess: () => {
                toast.success('Issue updated.');
                setEditingIssue(null);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Publication Management" />

            <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                <PageHeader
                    title="Publication Management"
                    description="Organize your journal's growth by managing volumes and scheduling seasonal issues."
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Volume & Issue List */}
                    <div className="lg:col-span-2 space-y-6">
                        {volumes.length === 0 ? (
                            <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                                <CardContent className="h-64 flex flex-col items-center justify-center text-neutral-400 gap-3">
                                    <Library className="size-16 opacity-10 mb-2" />
                                    <p className="text-xl font-light italic">No volumes found.</p>
                                    <p className="text-sm">Start by creating your first volume using the form.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            volumes.map((volume) => (
                                <Card key={volume.id} className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden bg-background">
                                    <div
                                        className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors py-5 px-6 border-b border-neutral-100 dark:border-neutral-800"
                                        onClick={() => toggleVolume(volume.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="size-12 shrink-0 rounded-2xl bg-primary/5 text-primary flex flex-col items-center justify-center ring-1 ring-primary/10 shadow-sm">
                                                    <span className="text-xs font-bold leading-none">{volume.number}</span>
                                                    <span className="text-[8px] font-bold uppercase tracking-tighter opacity-60">Vol</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-tight">Volume {volume.number}</h3>
                                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-500 font-medium">
                                                        <Calendar className="size-3 opacity-60" />
                                                        Academic Year {volume.year}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="size-8 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                                    onClick={(e) => startEditVolume(volume, e)}
                                                >
                                                    <Edit2 className="size-3.5 text-neutral-500" />
                                                </Button>
                                                <Badge variant="secondary" className="px-3 py-0.5 h-6 rounded-full text-[10px] uppercase font-bold tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-none">
                                                    {volume.issues.length} Issues
                                                </Badge>
                                                <div className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                                    {expandedVolumes[volume.id] ? <ChevronUp className="size-5 text-neutral-400" /> : <ChevronDown className="size-5 text-neutral-400" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {expandedVolumes[volume.id] && (
                                        <CardContent className="p-0 animate-in fade-in slide-in-from-top-2 duration-300">
                                            {volume.issues.length === 0 ? (
                                                <div className="p-10 text-center text-neutral-400 text-sm flex flex-col items-center gap-2 bg-neutral-50/30 dark:bg-neutral-900/20">
                                                    <Layers className="size-8 opacity-10 mb-1" />
                                                    <p className="italic">No issues scheduled for this volume.</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                                    {volume.issues.map(issue => (
                                                        <div key={issue.id} className="p-6 space-y-5 hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10 transition-colors">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex gap-4">
                                                                    {issue.cover_image_url && (
                                                                        <img src={issue.cover_image_url} alt="Cover" className="w-16 h-20 object-cover rounded-md shadow-sm border border-neutral-200 dark:border-neutral-800" />
                                                                    )}
                                                                    <div className="space-y-1">
                                                                         <div className="flex items-center gap-3">
                                                                            <Badge className={cn(
                                                                                "px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ring-1",
                                                                                issue.status === 'published'
                                                                                    ? "bg-emerald-100 text-emerald-700 ring-emerald-500/10 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                                                    : "bg-amber-100 text-amber-700 ring-amber-500/10 dark:bg-amber-900/30 dark:text-amber-400"
                                                                            )}>
                                                                                {issue.status}
                                                                            </Badge>
                                                                            <h3 className="font-bold text-neutral-900 dark:text-neutral-100">
                                                                                Issue No. {issue.number}
                                                                                {issue.title && <span className="text-neutral-400 dark:text-neutral-500 font-normal ml-2">— {issue.title}</span>}
                                                                            </h3>
                                                                        </div>
                                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block">
                                                                            {issue.month} {issue.year}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                
                                                                <Button 
                                                                    size="icon" 
                                                                    variant="ghost" 
                                                                    className="size-8 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                                                    onClick={() => startEditIssue(issue)}
                                                                >
                                                                    <Edit2 className="size-3.5 text-neutral-500" />
                                                                </Button>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                                                                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Included Manuscripts ({issue.manuscripts.length})</span>
                                                                </div>
                                                                {issue.manuscripts.length === 0 ? (
                                                                    <p className="text-xs text-neutral-400 italic py-2 pl-2 border-l-2 border-neutral-100 dark:border-neutral-800">No manuscripts assigned yet.</p>
                                                                ) : (
                                                                    <div className="grid gap-2">
                                                                        {issue.manuscripts.map(ms => (
                                                                            <Link
                                                                                key={ms.id}
                                                                                href={`/editorial/submissions/${ms.id}`}
                                                                                className="flex items-center justify-between text-xs p-3 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-800 hover:border-primary/30 hover:bg-white dark:hover:bg-neutral-900 transition-all group/item shadow-sm hover:shadow-md"
                                                                            >
                                                                                <div className="flex items-center gap-3 overflow-hidden">
                                                                                    <div className="p-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm text-neutral-400 group-hover/item:text-primary transition-colors">
                                                                                        <FileText className="size-3.5" />
                                                                                    </div>
                                                                                    <span className="truncate font-semibold text-neutral-700 dark:text-neutral-300 group-hover/item:text-neutral-900 dark:group-hover/item:text-neutral-50">{ms.title}</span>
                                                                                </div>
                                                                                <ArrowUpRight className="size-3.5 text-neutral-300 group-hover/item:text-primary transition-all group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 shrink-0" />
                                                                            </Link>
                                                                        ))}
                                                                    </div>
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
                        <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
                                    <Plus className="size-4" />
                                    New Volume
                                </CardTitle>
                                <CardDescription className="text-xs">Establish a new container for seasonal issues.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateVolume} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold uppercase text-neutral-500 tracking-tight">Volume No.</Label>
                                            <Input
                                                placeholder="e.g. 15"
                                                className="bg-neutral-50 dark:bg-neutral-900 border-none ring-1 ring-neutral-200 dark:ring-neutral-800 focus-visible:ring-primary"
                                                value={volumeForm.data.number}
                                                onChange={e => volumeForm.setData('number', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold uppercase text-neutral-500 tracking-tight">Year</Label>
                                            <Input
                                                type="number"
                                                className="bg-neutral-50 dark:bg-neutral-900 border-none ring-1 ring-neutral-200 dark:ring-neutral-800 focus-visible:ring-primary"
                                                value={volumeForm.data.year}
                                                onChange={e => volumeForm.setData('year', parseInt(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase text-neutral-500 tracking-tight">Description</Label>
                                        <Textarea
                                            placeholder="Overview of this volume..."
                                            className="min-h-[80px] bg-neutral-50 dark:bg-neutral-900 border-none ring-1 ring-neutral-200 dark:ring-neutral-800 focus-visible:ring-primary"
                                            value={volumeForm.data.description}
                                            onChange={e => volumeForm.setData('description', e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full rounded-full font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all" disabled={volumeForm.processing}>
                                        Create Volume
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* New Issue Form */}
                        <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                    <Layers className="size-4" />
                                    New Issue
                                </CardTitle>
                                <CardDescription className="text-xs">Schedule a specific release under a volume.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateIssue} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase text-neutral-500 tracking-tight">Parent Volume</Label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md bg-neutral-50 dark:bg-neutral-900 border-none ring-1 ring-neutral-200 dark:ring-neutral-800 focus-visible:ring-indigo-500 text-sm appearance-none cursor-pointer"
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold uppercase text-neutral-500 tracking-tight">Issue No.</Label>
                                            <Input
                                                placeholder="e.g. 1"
                                                className="bg-neutral-50 dark:bg-neutral-900 border-none ring-1 ring-neutral-200 dark:ring-neutral-800 focus-visible:ring-indigo-500"
                                                value={issueForm.data.number}
                                                onChange={e => issueForm.setData('number', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold uppercase text-neutral-500 tracking-tight">Year</Label>
                                            <Input
                                                type="number"
                                                className="bg-neutral-50 dark:bg-neutral-900 border-none ring-1 ring-neutral-200 dark:ring-neutral-800 focus-visible:ring-indigo-500"
                                                value={issueForm.data.year}
                                                onChange={e => issueForm.setData('year', parseInt(e.target.value))}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase text-neutral-500 tracking-tight">Release Month</Label>
                                        <Input
                                            placeholder="e.g. June"
                                            className="bg-neutral-50 dark:bg-neutral-900 border-none ring-1 ring-neutral-200 dark:ring-neutral-800 focus-visible:ring-indigo-500"
                                            value={issueForm.data.month}
                                            onChange={e => issueForm.setData('month', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase text-neutral-500 tracking-tight">Issue Title (Optional)</Label>
                                        <Input
                                            placeholder="Special Edition..."
                                            className="bg-neutral-50 dark:bg-neutral-900 border-none ring-1 ring-neutral-200 dark:ring-neutral-800 focus-visible:ring-indigo-500"
                                            value={issueForm.data.title}
                                            onChange={e => issueForm.setData('title', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold uppercase text-neutral-500 tracking-tight">Cover Image (Optional)</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="bg-neutral-50 dark:bg-neutral-900 border-none ring-1 ring-neutral-200 dark:ring-neutral-800 focus-visible:ring-indigo-500 file:bg-indigo-50 file:text-indigo-600 file:border-0 file:rounded-md file:px-2 file:py-1 file:text-xs file:font-semibold"
                                                onChange={e => issueForm.setData('cover_image', e.target.files ? e.target.files[0] : null)}
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 active:scale-95 transition-all" disabled={issueForm.processing}>
                                        Schedule Issue
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Edit Volume Dialog */}
                <Dialog open={!!editingVolume} onOpenChange={(open) => !open && setEditingVolume(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Volume</DialogTitle>
                            <DialogDescription>Update volume details.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={updateVolume} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Volume No.</Label>
                                    <Input value={editVolumeForm.data.number} onChange={e => editVolumeForm.setData('number', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Year</Label>
                                    <Input type="number" value={editVolumeForm.data.year} onChange={e => editVolumeForm.setData('year', parseInt(e.target.value))} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={editVolumeForm.data.description || ''} onChange={e => editVolumeForm.setData('description', e.target.value)} />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingVolume(null)}>Cancel</Button>
                                <Button type="submit" disabled={editVolumeForm.processing}>Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Issue Dialog */}
                <Dialog open={!!editingIssue} onOpenChange={(open) => !open && setEditingIssue(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Issue</DialogTitle>
                            <DialogDescription>Update issue details and cover image.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={updateIssue} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Issue No.</Label>
                                    <Input value={editIssueForm.data.number} onChange={e => editIssueForm.setData('number', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Year</Label>
                                    <Input type="number" value={editIssueForm.data.year} onChange={e => editIssueForm.setData('year', parseInt(e.target.value))} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Month</Label>
                                <Input value={editIssueForm.data.month || ''} onChange={e => editIssueForm.setData('month', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={editIssueForm.data.title || ''} onChange={e => editIssueForm.setData('title', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <select
                                    className="w-full h-10 px-3 rounded-md bg-neutral-50 dark:bg-neutral-900 border-none ring-1 ring-neutral-200 dark:ring-neutral-800 focus-visible:ring-primary text-sm appearance-none cursor-pointer"
                                    value={editIssueForm.data.status}
                                    onChange={e => editIssueForm.setData('status', e.target.value)}
                                    required
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Cover Image</Label>
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={e => editIssueForm.setData('cover_image', e.target.files ? e.target.files[0] : null)} 
                                />
                                <p className="text-xs text-muted-foreground">Upload to replace existing cover.</p>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingIssue(null)}>Cancel</Button>
                                <Button type="submit" disabled={editIssueForm.processing}>Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
