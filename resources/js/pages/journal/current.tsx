import React from 'react';
import { Head } from '@inertiajs/react';
import Welcome from '@/pages/welcome'; // We might want to keep the layout consistent

export default function Current() {
    return (
        <div className="min-h-screen bg-background">
            <Head title="Current Issue" />
            <div className="max-w-7xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-serif font-bold mb-8">Current Issue</h1>
                <div className="p-12 border-2 border-dashed rounded-2xl flex items-center justify-center text-muted-foreground bg-slate-50">
                    <p className="text-lg italic text-center">
                        Placeholder for Vol 12 No 4 (2025). <br />
                        Detailed table of contents and full-text PDFs will be displayed here in the final implementation.
                    </p>
                </div>
            </div>
        </div>
    );
}
