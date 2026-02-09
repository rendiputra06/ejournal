import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import dayjs from 'dayjs';

interface Announcement {
    id: number;
    title: string;
    slug: string;
    content: string;
    published_at: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface AnnouncementsProps {
    announcements: {
        data: Announcement[];
        links: PaginationLinks[];
    };
}

export default function Announcements({ announcements }: AnnouncementsProps) {
    return (
        <PublicLayout>
            <Head title="Announcements" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12 border-b pb-8">
                    <h1 className="text-4xl font-serif font-bold text-primary mb-2">Announcements</h1>
                    <p className="text-xl text-muted-foreground">Stay updated with the latest news and calls from our journal.</p>
                </div>

                <div className="space-y-12">
                    {announcements.data.length > 0 ? (
                        <>
                            <div className="space-y-8">
                                {announcements.data.map((item) => (
                                    <div key={item.id} className="pb-8 border-b last:border-0 group">
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                                            <span className="bg-slate-100 px-3 py-1 rounded-full font-medium">
                                                {dayjs(item.published_at).format('MMMM D, YYYY')}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold group-hover:text-primary transition-colors cursor-pointer capitalize leading-tight">
                                            {item.title}
                                        </h2>
                                        <div className="mt-4 prose prose-slate max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {item.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Simple Pagination */}
                            {announcements.links.length > 3 && (
                                <div className="flex justify-center mt-12 gap-2">
                                    {announcements.links.map((link, i) => (
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
                        <div className="py-24 text-center border-2 border-dashed rounded-2xl bg-slate-50">
                            <p className="text-lg text-muted-foreground italic">No announcements found at this time.</p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
