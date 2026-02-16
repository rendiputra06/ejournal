import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Activity, BookOpen, FileText, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommonData {
    announcements: {
        id: number;
        title: string;
        date: string;
        content: string;
    }[];
    latestArticles: {
        id: number;
        title: string;
        published_at: string;
        author: string;
    }[];
}

export const CommunitySidebar = ({ data }: { data: CommonData }) => (
    <div className="space-y-6">
        <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Activity className="size-5 text-primary" />
                    Latest Updates
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {data?.announcements?.length > 0 ? (
                    data.announcements.map((item) => (
                        <div key={item.id} className="pb-3 border-b border-neutral-100 last:border-0 last:pb-0">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{item.date}</span>
                            <h4 className="font-bold text-sm text-neutral-900 mt-1">{item.title}</h4>
                            <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.content}</p>
                        </div>
                    ))
                ) : (
                    <div className="py-4 text-center">
                        <p className="text-xs text-neutral-400 italic">No recent announcements</p>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <BookOpen className="size-5 text-primary" />
                    Just Published
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {data?.latestArticles?.length > 0 ? (
                    data.latestArticles.map((article) => (
                        <div key={article.id} className="flex items-start gap-3 group cursor-pointer">
                            <div className="mt-1 p-1.5 rounded-lg bg-neutral-100 text-neutral-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <FileText className="size-4" />
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-neutral-900 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h4>
                                <p className="text-[10px] text-neutral-500 mt-0.5">{article.author}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-4 text-center">
                        <p className="text-xs text-neutral-400 italic">No articles published yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
);

export const SystemGuideShortcut = ({ roleIcon: Icon, roleName, colorClass }: { roleIcon: any, roleName: string, colorClass: string }) => (
    <div className="mt-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 px-1">{roleName} Guide</h2>
        <Card className={cn("text-white border-none shadow-xl rounded-2xl overflow-hidden group transition-all hover:shadow-2xl", colorClass)}>
            <CardContent className="p-0">
                <Link href={route('guides.index')} className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
                    <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <Icon className="size-8" />
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold">Comprehensive {roleName} Guide</h3>
                        <p className="text-white/70 font-light max-w-xl">Master the {roleName.toLowerCase()} workflow with our step-by-step instructions and visual system guide.</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 font-bold text-sm bg-white/15 px-6 py-3 rounded-xl hover:bg-white/25 transition-colors">
                        Open Guide
                        <ArrowUpRight className="size-4" />
                    </div>
                </Link>
            </CardContent>
        </Card>
    </div>
);
