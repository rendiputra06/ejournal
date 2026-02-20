import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Book } from 'lucide-react';

interface Issue {
    id: number;
    volume_id: number;
    number: number;
    year: number;
    month: string;
    title: string;
}

interface ArchivesProps {
    archives: Record<string, Issue[]>;
}

export default function Archives({ archives }: ArchivesProps) {
    const years = Object.keys(archives).sort((a, b) => parseInt(b) - parseInt(a));

    return (
        <PublicLayout>
            <Head title="Archives" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12 border-b pb-8">
                    <h1 className="text-4xl font-serif font-bold text-primary mb-2">Archives</h1>
                    <p className="text-xl text-muted-foreground">Explore our collection of past volumes and issues.</p>
                </div>

                <div className="space-y-16">
                    {years.length > 0 ? (
                        years.map((year) => (
                            <section key={year}>
                                <h2 className="text-3xl font-serif font-bold mb-8 flex items-center gap-3">
                                    <span className="bg-secondary text-white px-4 py-1 rounded-lg text-2xl">{year}</span>
                                    <div className="h-px bg-slate-200 flex-grow"></div>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {archives[year].map((issue) => (
                                        <Link
                                            key={issue.id}
                                            href={route('journal.issue', issue.id)}
                                            className="group"
                                        >
                                            <div className="p-8 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group-hover:border-primary/50 flex items-start gap-4">
                                                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                                    <Book className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                                        Vol {issue.volume_id} No {issue.number}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                                        {issue.month} {issue.year}
                                                    </p>
                                                    {issue.title && (
                                                        <p className="text-sm italic mt-2 text-slate-500 line-clamp-1">
                                                            "{issue.title}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="py-24 text-center">
                            <p className="text-lg text-muted-foreground italic">No archived issues found.</p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
