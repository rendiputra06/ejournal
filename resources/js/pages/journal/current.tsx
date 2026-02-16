import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Author {
    id: number;
    name: string;
}

interface Manuscript {
    id: number;
    title: string;
    abstract: string;
    authors: Author[];
}

interface Issue {
    id: number;
    volume_id: number;
    number: string;
    year: number;
    title: string;
    cover_image_url?: string;
    manuscripts: Manuscript[];
}

interface CurrentProps {
    issue?: Issue;
}

export default function Current({ issue }: CurrentProps) {
    return (
        <PublicLayout>
            <Head title={issue ? `Vol ${issue.volume_id} No ${issue.number} (${issue.year})` : "Current Issue"} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12 border-b pb-8">
                    <h1 className="text-4xl font-serif font-bold text-primary mb-2">Current Issue</h1>
                    {issue ? (
                        <p className="text-xl text-muted-foreground">
                            Vol. {issue.volume_id} No. {issue.number} ({issue.year}): {issue.title || 'Table of Contents'}
                        </p>
                    ) : (
                        <p className="text-xl text-muted-foreground">No published issue available at this time.</p>
                    )}
                </div>

                {issue ? (
                    <div className="space-y-12">
                        {/* Cover & Info Section */}
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {issue.cover_image_url && (
                                <div className="shrink-0">
                                    <img 
                                        src={issue.cover_image_url} 
                                        alt={`Cover of Vol ${issue.volume_id} No ${issue.number}`} 
                                        className="w-full md:w-64 rounded-lg shadow-lg border"
                                    />
                                </div>
                            )}
                            <div className="flex-grow">
                                <section>
                                    <h2 className="text-2xl font-serif font-bold mb-6 border-l-4 border-secondary pl-4">Articles</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {issue.manuscripts.length > 0 ? (
                                    issue.manuscripts.map((article) => (
                                        <div key={article.id} className="p-8 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="flex-grow space-y-3">
                                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                                        <Link href={route('journal.article', article.id)}>
                                                            {article.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        {article.authors.map(a => a.name).join(', ')}
                                                    </p>
                                                    <div className="pt-2">
                                                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                                            {article.abstract}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm" className="gap-2">
                                                                <FileText className="w-4 h-4" />
                                                                Abstract
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle>{article.title}</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground max-h-[60vh] overflow-y-auto pr-2">
                                                                <p className="font-bold text-foreground">Abstract</p>
                                                                {article.abstract}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button size="sm" className="gap-2 bg-secondary hover:bg-secondary/90 text-white">
                                                                <Eye className="w-4 h-4" />
                                                                PDF
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col">
                                                            <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                                                                <DialogTitle className="line-clamp-1 flex-1 mr-4">PDF Preview: {article.title}</DialogTitle>
                                                                <Button variant="outline" size="sm" asChild className="shrink-0 mr-8 rounded-full h-8">
                                                                    <a href={route('manuscripts.file.download', article.id)}>
                                                                        <Download className="w-4 h-4 mr-2" /> Download
                                                                    </a>
                                                                </Button>
                                                            </DialogHeader>
                                                            <div className="flex-1 bg-muted/20">
                                                                <iframe
                                                                    src={route('manuscripts.file.view', article.id)}
                                                                    className="w-full h-full border-none"
                                                                    title="PDF Preview"
                                                                />
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="italic text-muted-foreground">No articles published in this issue.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        ) : (
                    <div className="p-12 border-2 border-dashed rounded-2xl flex items-center justify-center text-muted-foreground bg-slate-50">
                        <p className="text-lg italic text-center">
                            The journal is currently preparing the next issue. <br />
                            Please check back later or browse our <Link href={route('journal.archives')} className="text-primary hover:underline">Archives</Link>.
                        </p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
