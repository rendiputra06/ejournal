import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { LoadingButton } from '@/components/loading-button';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';
import { Megaphone } from 'lucide-react';

interface Announcement {
    id?: number;
    title: string;
    content: string;
    published_at: string;
}

interface Props {
    announcement?: Announcement;
}

export default function AnnouncementForm({ announcement }: Props) {
    const isEdit = !!announcement;

    const { data, setData, post, put, processing, errors } = useForm({
        title: announcement?.title || '',
        content: announcement?.content || '',
        published_at: announcement?.published_at ? announcement.published_at.substring(0, 10) : new Date().toISOString().substring(0, 10),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        isEdit ? put(`/editorial/announcements/${announcement?.id}`) : post('/editorial/announcements');
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: '/dashboard' },
        { title: 'Announcements', href: '/editorial/announcements' },
        { title: isEdit ? 'Edit Announcement' : 'Create Announcement', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Announcement' : 'Create Announcement'} />
            <div className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <PageHeader
                        title={isEdit ? 'Update Announcement' : 'New Journal Broadcast'}
                        description={isEdit ? 'Modify existing announcement content and schedule.' : 'Compose a new message to be displayed on the journal public homepage.'}
                        className="mb-8"
                    >
                        <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner">
                            <Megaphone className="size-6" />
                        </div>
                    </PageHeader>

                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800">
                        <CardContent className="pt-8 px-6 md:px-10">
                            <form onSubmit={handleSubmit} className="space-y-8 pb-4">
                                <div className="space-y-6">
                                    {/* Title */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="title" className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">Announcement Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g., Call for Papers: Vol 15 No 2"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className={cn(
                                                "h-12 text-lg font-medium transition-all focus:ring-2 focus:ring-primary/20 bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200",
                                                errors.title && "border-red-500 focus:ring-red-500/20"
                                            )}
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    {/* Content */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="content" className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">Content / Message</Label>
                                        <Textarea
                                            id="content"
                                            placeholder="Detailed announcement details..."
                                            rows={10}
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            className={cn(
                                                "resize-none transition-all focus:ring-2 focus:ring-primary/20 bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200 p-4 leading-relaxed",
                                                errors.content && "border-red-500 focus:ring-red-500/20"
                                            )}
                                        />
                                        <InputError message={errors.content} />
                                        <p className="text-[11px] text-neutral-400 italic">Formatting tip: You can use plain text here. Line breaks will be preserved.</p>
                                    </div>

                                    {/* Published At */}
                                    <div className="grid gap-2 max-w-sm">
                                        <Label htmlFor="published_at" className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">Publish Date</Label>
                                        <Input
                                            id="published_at"
                                            type="date"
                                            value={data.published_at}
                                            onChange={(e) => setData('published_at', e.target.value)}
                                            className={cn(
                                                "h-11 transition-all focus:ring-2 focus:ring-primary/20 bg-neutral-50/50 dark:bg-neutral-900 border-neutral-200",
                                                errors.published_at && "border-red-500 focus:ring-red-500/20"
                                            )}
                                        />
                                        <InputError message={errors.published_at} />
                                    </div>
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-8 border-t border-neutral-100 dark:border-neutral-800">
                                    <Link href="/editorial/announcements" className="w-full sm:w-auto">
                                        <Button type="button" variant="ghost" className="w-full h-11 px-8 hover:bg-neutral-100 rounded-xl transition-colors">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <LoadingButton
                                        type="submit"
                                        loading={processing}
                                        className="w-full sm:w-auto h-11 px-10 shadow-lg shadow-primary/20 rounded-xl"
                                    >
                                        {isEdit ? 'Save Changes' : 'Publish Broadcast'}
                                    </LoadingButton>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
