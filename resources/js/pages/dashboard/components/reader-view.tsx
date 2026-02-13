import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { BookOpen, FileSearch, Layers, ArrowUpRight } from 'lucide-react';

interface ReaderData {
    latestIssues: {
        id: number;
        volume: number;
        number: number;
        year: number;
        published_at: string;
    }[];
    recommendedArticles: {
        id: number;
        title: string;
        abstract: string;
        author: string;
    }[];
}

export const ReaderView = ({ data }: { data: ReaderData }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-neutral-900 text-neutral-50 overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 size-48 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                    <CardContent className="p-8 relative z-10 flex flex-col justify-center h-full">
                        <Badge className="w-fit bg-white/20 hover:bg-white/30 text-white border-none mb-4">Featured Issue</Badge>
                        <h2 className="text-3xl font-bold leading-tight">Volume 12, Number 3</h2>
                        <p className="text-neutral-300 mt-2 mb-6 max-w-md">Exploring the latest advancements in artificial intelligence and its impact on modern healthcare systems.</p>
                        <Button className="w-fit bg-white text-neutral-900 hover:bg-neutral-100 border-none">
                            Read Issue <ArrowUpRight className="ml-2 size-4" />
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm flex flex-col justify-center items-center text-center p-6">
                        <div className="p-4 rounded-full bg-blue-50 text-blue-600 mb-4">
                            <BookOpen className="size-8" />
                        </div>
                        <h3 className="font-bold text-lg">Browse Archives</h3>
                        <p className="text-sm text-neutral-500 mt-2 mb-4">Access past issues and articles.</p>
                        <Button variant="outline" size="sm">Explore</Button>
                    </Card>
                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm flex flex-col justify-center items-center text-center p-6">
                        <div className="p-4 rounded-full bg-emerald-50 text-emerald-600 mb-4">
                            <FileSearch className="size-8" />
                        </div>
                        <h3 className="font-bold text-lg">Advanced Search</h3>
                        <p className="text-sm text-neutral-500 mt-2 mb-4">Find specific topics or authors.</p>
                        <Button variant="outline" size="sm">Search</Button>
                    </Card>
                </div>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Layers className="size-5 text-primary" />
                        Recommended For You
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.recommendedArticles.map((article) => (
                        <div key={article.id} className="p-4 rounded-xl border border-neutral-100 bg-white hover:border-primary/20 transition-all flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-2">
                                <h4 className="font-bold text-sm text-neutral-900 hover:text-primary transition-colors cursor-pointer">{article.title}</h4>
                                <p className="text-xs text-neutral-500 line-clamp-2">{article.abstract}</p>
                                <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                                    <span>By {article.author}</span>
                                </div>
                            </div>
                            <Button size="sm" variant="secondary" className="self-center shrink-0">Read Abstract</Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};
