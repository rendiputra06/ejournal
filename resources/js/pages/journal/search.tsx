import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { FileText, Download, Search as SearchIcon } from 'lucide-react';

interface Author {
    id: number;
    name: string;
}

interface Issue {
    id: number;
    volume_id: number;
    number: number;
    year: number;
}

interface Manuscript {
    id: number;
    title: string;
    abstract: string;
    authors: Author[];
    issue?: Issue;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface SearchProps {
    results: {
        data: Manuscript[];
        links: PaginationLinks[];
        total: number;
    };
    query: string;
}

export default function Search({ results, query }: SearchProps) {
    return (
        <PublicLayout>
            <Head title={`Search Results for "${query}"`} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12 border-b pb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <SearchIcon className="w-8 h-8 text-primary" />
                        <h1 className="text-4xl font-serif font-bold text-primary">Search Results</h1>
                    </div>
                    <p className="text-xl text-muted-foreground">
                        Found {results.total} articles for <span className="text-foreground font-bold italic">"{query}"</span>
                    </p>
                </div>

                <div className="space-y-12">
                    {results.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-8">
                                {results.data.map((article) => (
                                    <div key={article.id} className="p-8 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-grow space-y-3">
                                                <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-widest">
                                                    {article.issue ? (
                                                        <span>Vol {article.issue.volume_id} No {article.issue.number} ({article.issue.year})</span>
                                                    ) : (
                                                        <span>Online First</span>
                                                    )}
                                                </div>
                                                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors cursor-pointer leading-tight">
                                                    {article.title}
                                                </h3>
                                                <p className="text-sm font-medium text-muted-foreground flex gap-1">
                                                    By {article.authors.map((a, i) => (
                                                        <span key={a.id}>{a.name}{i < article.authors.length - 1 ? ',' : ''} </span>
                                                    ))}
                                                </p>
                                                <div className="pt-2">
                                                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                                        {article.abstract}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-row md:flex-col gap-2 shrink-0">
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <FileText className="w-4 h-4" />
                                                    Abstract
                                                </Button>
                                                <Button size="sm" className="gap-2 bg-secondary hover:bg-secondary/90 text-white">
                                                    <Download className="w-4 h-4" />
                                                    PDF
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {results.links.length > 3 && (
                                <div className="flex justify-center mt-12 gap-2">
                                    {results.links.map((link, i) => (
                                        <button
                                            key={i}
                                            disabled={!link.url}
                                            className={`px-4 py-2 rounded-md border text-sm transition-colors ${link.active
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-white hover:bg-slate-50 text-slate-600'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            onClick={() => link.url && (window.location.href = link.url)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-24 text-center border-2 border-dashed rounded-2xl bg-slate-100/50">
                            <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-xl text-muted-foreground">No matching articles found.</p>
                            <p className="text-sm text-muted-foreground mt-2">Try different keywords or browse our current issue.</p>
                            <div className="mt-8">
                                <Link href="/">
                                    <Button variant="outline">Back to Home</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
