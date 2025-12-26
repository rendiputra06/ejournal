import React from 'react';
import { Head } from '@inertiajs/react';

export default function Announcements() {
    return (
        <div className="min-h-screen bg-background">
            <Head title="Announcements" />
            <div className="max-w-7xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-serif font-bold mb-8">Announcements</h1>
                <div className="space-y-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="pb-8 border-b last:border-0">
                            <span className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Dec {20 - i}, 2025</span>
                            <h2 className="text-2xl font-bold mt-2 hover:text-primary cursor-pointer transition-colors">Important Update for Journal Reviewers</h2>
                            <p className="text-muted-foreground mt-4 leading-relaxed">
                                We have updated our peer review guidelines to include new criteria for data accessibility
                                and methodological transparency. All reviewers are requested to download the updated
                                guide from their dashboard.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
