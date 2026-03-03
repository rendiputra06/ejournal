import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from '@/components/page-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Edit2, Trash2, Globe, Plus, CheckCircle2, XCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Home', href: '/dashboard' },
  { title: 'Journals', href: '/journals' },
];

interface Journal {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

interface Props {
  journals: Journal[];
}

export default function JournalIndex({ journals }: Props) {
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
    name: '' as string,
    slug: '' as string,
    description: '' as string,
    is_active: true as boolean,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    post('/journals', {
      onSuccess: () => {
        setIsCreateOpen(false);
        reset();
      },
    });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/journals/${editingJournal?.id}`, {
      onSuccess: () => {
        setIsEditOpen(false);
        setEditingJournal(null);
        reset();
      },
    });
  };

  const openEditModal = (journal: Journal) => {
    setEditingJournal(journal);
    setData({
      name: journal.name,
      slug: journal.slug,
      description: journal.description || '',
      is_active: journal.is_active,
    });
    setIsEditOpen(true);
  };

  const handleDelete = (id: number) => {
    destroy(`/journals/${id}`, { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Journal Management" />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Journal Management"
            description="Manage your multiple journals, configure settings, and control publication visibility."
          >
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                    <Button className="gap-2 shadow-lg shadow-primary/10 rounded-full">
                        <Plus className="size-4" />
                        <span>Create New Journal</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleCreate}>
                        <DialogHeader>
                            <DialogTitle>Create Journal</DialogTitle>
                            <DialogDescription>
                                Add a new journal to the system. Fill in the basic information below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Journal Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="e.g. Journal of Technology"
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">URL Slug</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-neutral-400">/</span>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={e => setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                        placeholder="journal-slug"
                                    />
                                </div>
                                {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Brief description of the journal..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing}>Create Journal</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
          </PageHeader>

          <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/50">
                  <TableRow className="hover:bg-transparent border-neutral-100 dark:border-neutral-800">
                    <TableHead className="w-[350px] text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Journal Info</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Public URL</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Status</TableHead>
                    <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-48 text-center text-neutral-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <BookOpen className="size-10 opacity-10 mb-2" />
                          <p className="text-lg font-light italic">No journals found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    journals.map((journal) => (
                      <TableRow key={journal.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 border-neutral-100 dark:border-neutral-800 transition-colors">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-sm font-bold text-primary ring-1 ring-primary/10 shadow-sm">
                              <BookOpen className="size-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50 truncate group-hover:text-primary transition-colors">
                                {journal.name}
                              </span>
                              <span className="text-xs text-neutral-500 truncate">{journal.description || 'No description'}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
                            <Globe className="size-3 opacity-60" />
                            <a href={`/${journal.slug}`} target="_blank" className="hover:text-primary hover:underline">
                                /{journal.slug}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={journal.is_active ? "default" : "secondary"} className={cn(
                              "px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-tight border-none",
                              journal.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                          )}>
                            {journal.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/journals/${journal.id}`}>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 gap-1.5 rounded-lg hover:bg-neutral-100 hover:text-primary dark:hover:bg-neutral-800 px-3 transition-all"
                                >
                                    <Settings className="size-3.5" />
                                    <span className="text-[11px] font-bold uppercase tracking-tight">Configure</span>
                                </Button>
                            </Link>

                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => openEditModal(journal)}
                                className="h-8 gap-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 px-3 transition-all"
                            >
                                <Edit2 className="size-3.5" />
                                <span className="text-[11px] font-bold uppercase tracking-tight">Edit</span>
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 gap-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 px-3 transition-all text-red-600/70 hover:text-red-600">
                                  <Trash2 className="size-3.5" />
                                  <span className="text-[11px] font-bold uppercase tracking-tight">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-2xl border-none shadow-2xl ring-1 ring-neutral-200 dark:ring-neutral-800">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-xl font-bold text-red-600">Permanently Delete Journal?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-sm pt-2">
                                    You are about to delete <span className="font-bold text-neutral-900 dark:text-neutral-100">{journal.name}</span>. All issues, volumes, and manuscripts associated with this journal will also be deleted.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="pt-6">
                                  <AlertDialogCancel className="rounded-xl border-neutral-200">Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(journal.id)}
                                    disabled={processing}
                                    className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all active:scale-95"
                                  >
                                    Delete Journal
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
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleEdit}>
                <DialogHeader>
                    <DialogTitle>Edit Journal</DialogTitle>
                    <DialogDescription>
                        Update the journal information.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">Journal Name</Label>
                        <Input
                            id="edit-name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-slug">URL Slug</Label>
                        <Input
                            id="edit-slug"
                            value={data.slug}
                            onChange={e => setData('slug', e.target.value)}
                        />
                        {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="edit-active"
                            checked={data.is_active}
                            onChange={e => setData('is_active', e.target.checked)}
                        />
                        <Label htmlFor="edit-active">Journal is Active</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" disabled={processing}>Update Journal</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
