import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Code, Info, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { LoadingButton } from '@/components/loading-button';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

interface EmailTemplate {
    id: number;
    slug: string;
    name: string;
    subject: string;
    content: string;
    variables: string[];
}

interface Props {
    template: EmailTemplate;
}

export default function TemplateForm({ template }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        subject: template.subject,
        content: template.content,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/email-templates/${template.id}`, {
            onSuccess: () => toast.success('Template updated successfully'),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: '/dashboard' },
        { title: 'Email Templates', href: '/email-templates' },
        { title: `Edit ${template.name}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${template.name}`} />
            <div className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex items-center justify-between">
                        <Button variant="ghost" asChild className="rounded-full gap-2 text-neutral-500">
                            <Link href="/email-templates">
                                <ArrowLeft className="size-4" />
                                Back to List
                            </Link>
                        </Button>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                            <Code className="size-3" />
                            Current Template: {template.slug}
                        </div>
                    </div>

                    <PageHeader
                        title={`Customize ${template.name}`}
                        description={`Refine the way your users receive the ${template.name.toLowerCase()} notification.`}
                    />

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                        {/* Editor Area */}
                        <div className="lg:col-span-7 space-y-6">
                            <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden bg-background/50 backdrop-blur-sm">
                                <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-neutral-500">Subject & Content</CardTitle>
                                        <span className="text-[10px] text-neutral-400 font-mono">HTML Supported</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="subject" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Email Subject Line</Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            className="h-11 font-medium bg-white dark:bg-neutral-900"
                                            placeholder="e.g. Verify your account..."
                                        />
                                        <InputError message={errors.subject} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="content" className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Message Body</Label>
                                        <Textarea
                                            id="content"
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            className="min-h-[400px] font-mono text-sm leading-relaxed p-4 bg-white dark:bg-neutral-900 focus-visible:ring-primary"
                                            placeholder="<p>Hello {{user_name}},</p>..."
                                        />
                                        <InputError message={errors.content} />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <LoadingButton
                                    type="submit"
                                    loading={processing}
                                    className="px-8 h-12 rounded-xl shadow-lg shadow-primary/20 bg-primary font-bold tracking-tight hover:bg-primary/90 transition-all"
                                >
                                    Save Changes
                                </LoadingButton>
                            </div>
                        </div>

                        {/* Preview & Help Sidebar */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Live Preview */}
                            <Card className="border-none shadow-md ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden bg-white dark:bg-neutral-950">
                                <CardHeader className="bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/20 pb-4">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                        <Sparkles className="size-4" />
                                        Live Preview
                                    </CardTitle>
                                    <CardDescription className="text-xs text-blue-600/60 dark:text-blue-400/60">
                                        How this email might look to a user.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="bg-neutral-100 dark:bg-neutral-900/50 p-4 min-h-[400px]">
                                        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-sm ring-1 ring-black/5 overflow-hidden max-w-sm mx-auto">
                                            {/* Fake Email Header */}
                                            <div className="border-b border-neutral-100 dark:border-neutral-800 p-4 bg-neutral-50/50 dark:bg-neutral-900/30">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 break-words">
                                                        {data.subject || <span className="text-neutral-300 italic">No subject...</span>}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                                                        <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">J</div>
                                                        <span>Journal System &lt;noreply@journal.com&gt;</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Preview Content */}
                                            <div className="p-6 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed break-words prose-sm dark:prose-invert">
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: (data.content || '')
                                                            .replace(/{{user_name}}/g, '<strong>Dr. Jane Doe</strong>')
                                                            .replace(/{{verification_link}}/g, '<a href="#" class="text-blue-600 underline">Verify Email</a>')
                                                            .replace(/{{reset_link}}/g, '<a href="#" class="text-blue-600 underline">Reset Password</a>')
                                                            .replace(/{{manuscript_title}}/g, '<em>"Impact of AI on Modern Healthcare"</em>')
                                                            .replace(/{{author_name}}/g, '<strong>Dr. Jane Doe</strong>')
                                                            .replace(/{{action_url}}/g, '<a href="#" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-md no-underline text-xs font-bold">View Submission</a>')
                                                            .replace(/{{reviewer_name}}/g, '<strong>Prof. Alan Smith</strong>')
                                                            .replace(/{{due_date}}/g, '<strong>2024-12-31</strong>')
                                                            .replace(/\n/g, '<br/>')
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-center text-neutral-400 mt-4">
                                            Preview uses dummy data for variables.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden bg-background">
                                <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
                                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-neutral-500">Available Variables</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        {template.variables.map((variable) => (
                                            <div key={variable} className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 flex flex-col gap-0.5 transition-all hover:ring-1 hover:ring-primary/20 group cursor-help" title={`Click to copy {{${variable}}}`}>
                                                <code className="text-[10px] font-bold text-primary truncate">{'{{'}{variable}{'}}'}</code>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
