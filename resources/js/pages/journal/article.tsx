import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    FileText, 
    Download, 
    Eye, 
    ArrowLeft, 
    Calendar, 
    Quote, 
    User,
    BookOpen
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import dayjs from 'dayjs';

interface Author {
    id: number;
    name: string;
}

interface Issue {
    id: number;
    volume_id: number;
    number: string;
    year: number;
    title: string;
    volume?: {
        id: number;
        number: string;
    };
}

interface Manuscript {
    id: number;
    title: string;
    abstract: string;
    keywords: string;
    created_at: string;
    authors: Author[];
    issue?: Issue;
}

interface ArticleProps {
    article: Manuscript;
}

export default function ArticleDetail({ article }: ArticleProps) {
    return (
        <PublicLayout>
            <Head title={article.title} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <div className="mb-8">
                    <Link
                        href={route('journal.current')}
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
                    >
                        <ArrowLeft className="mr-2 size-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Current Issue
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        <section className="space-y-6">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-4" />
                                    <span>Published: {dayjs(article.created_at).format('MMMM D, YYYY')}</span>
                                </div>
                                {article.issue && (
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="size-4" />
                                        <span>
                                            Vol. {article.issue.volume_id} No. {article.issue.number} ({article.issue.year})
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {article.authors.map((author) => (
                                    <Badge key={author.id} variant="secondary" className="px-3 py-1 bg-secondary/10 text-secondary-foreground border-secondary/20 hover:bg-secondary/20 transition-colors">
                                        <User className="size-3 mr-1.5 opacity-70" />
                                        {author.name}
                                    </Badge>
                                ))}
                            </div>
                        </section>

                        <Separator className="opacity-60" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-serif font-bold flex items-center gap-2 text-primary">
                                <Quote className="size-5" />
                                Abstract
                            </h2>
                            <div className="text-base leading-relaxed text-muted-foreground font-serif italic text-justify bg-muted/20 p-6 md:p-8 rounded-2xl border border-muted-foreground/10">
                                {article.abstract}
                            </div>
                        </section>

                        {article.keywords && (
                            <section className="space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Keywords</h3>
                                <div className="flex flex-wrap gap-2">
                                    {article.keywords.split(',').map((keyword, index) => (
                                        <Badge key={index} variant="outline" className="px-3 py-1 font-medium text-xs">
                                            {keyword.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <Card className="border-primary/10 shadow-lg shadow-primary/5 overflow-hidden">
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-bold text-lg mb-2">Article Full-Text</h3>
                                
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl shadow-md">
                                            <Eye className="size-5" />
                                            Preview PDF
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

                                <Button variant="outline" className="w-full gap-2 h-12 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-semibold" asChild>
                                    <a href={route('manuscripts.file.download', article.id)}>
                                        <Download className="size-5" />
                                        Download PDF
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        {article.issue && (
                            <Card className="border-sidebar-border/50 bg-muted/10">
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Issue Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="shrink-0 w-24 h-32 bg-muted rounded border overflow-hidden shadow-sm">
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
                                                    <BookOpen className="size-8 opacity-20" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Link 
                                                    href={route('journal.current')} 
                                                    className="font-bold text-sm hover:text-primary transition-colors leading-tight block"
                                                >
                                                    {article.issue.title || `Vol ${article.issue.volume_id} No ${article.issue.number}`}
                                                </Link>
                                                <p className="text-xs text-muted-foreground">({article.issue.year})</p>
                                                <div className="pt-2">
                                                    <Badge variant="secondary" className="text-[10px] font-bold uppercase bg-primary/10 text-primary border-none">
                                                        Current Issue
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        
                        <Card className="border-sidebar-border/50">
                            <CardContent className="p-6 space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Article Metrics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold">--</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Views</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold">--</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Downloads</p>
                                    </div>
                                </div>
                                <Separator className="opacity-50" />
                                <p className="text-[10px] italic text-muted-foreground">
                                    Metrics are updated periodically.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
