import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Edit2, Info, ArrowUpRight } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { type BreadcrumbItem } from '@/types';

interface EmailTemplate {
    id: number;
    slug: string;
    name: string;
    subject: string;
}

interface Props {
    templates: EmailTemplate[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'Email Templates', href: '/email-templates' },
];

export default function TemplateIndex({ templates }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Email Templates" />
            <div className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto">
                    <PageHeader
                        title="Email Templates"
                        description="Manage and customize the content of automated system emails."
                    />

                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/50">
                                    <TableRow className="hover:bg-transparent border-neutral-100 dark:border-neutral-800">
                                        <TableHead className="w-[200px] text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Template Name</TableHead>
                                        <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Default Subject</TableHead>
                                        <TableHead className="w-[100px] text-right text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4 sr-only">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {templates.map((template) => (
                                        <TableRow key={template.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 border-neutral-100 dark:border-neutral-800 transition-colors">
                                            <TableCell className="py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/5 text-primary rounded-lg ring-1 ring-primary/10">
                                                        <Mail className="size-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{template.name}</span>
                                                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-tighter">{template.slug}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 italic">"{template.subject}"</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild className="h-9 gap-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all font-bold text-xs uppercase tracking-tight">
                                                    <Link href={`/email-templates/${template.id}/edit`}>
                                                        <Edit2 className="size-3.5" />
                                                        Customize
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="mt-8 p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 flex items-start gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                            <Info className="size-5" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">System Placeholder Guide</h4>
                            <p className="text-xs text-blue-700/70 dark:text-blue-400/70 leading-relaxed font-light">
                                Use placeholders like <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded font-bold text-blue-900 dark:text-blue-100">{'{{user_name}}'}</code> to dynamically insert data into the emails. Each template has its own set of compatible variables.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
