import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

interface AboutProps {
    guidelines?: string;
    aims_scope?: string;
    peer_review_process?: string;
    open_access_policy?: string;
}

export default function About({ guidelines, aims_scope, peer_review_process, open_access_policy }: AboutProps) {
    return (
        <PublicLayout>
            <Head title="About the Journal" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12 border-b pb-8">
                    <h1 className="text-4xl font-serif font-bold text-primary mb-2">About the Journal</h1>
                    <p className="text-xl text-muted-foreground">Our mission, values, and editorial policies.</p>
                </div>

                <div className="prose prose-slate max-w-none space-y-12 text-base leading-relaxed text-muted-foreground">
                    {aims_scope && (
                        <section className="bg-white p-8 border rounded-2xl shadow-sm">
                            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Aims & Scope</h2>
                            <div
                                className="prose-content"
                                dangerouslySetInnerHTML={{ __html: aims_scope }}
                            />
                        </section>
                    )}

                    {peer_review_process && (
                        <section className="bg-white p-8 border rounded-2xl shadow-sm">
                            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Peer Review Process</h2>
                            <div
                                className="prose-content"
                                dangerouslySetInnerHTML={{ __html: peer_review_process }}
                            />
                        </section>
                    )}

                    {open_access_policy && (
                        <section className="bg-white p-8 border rounded-2xl shadow-sm">
                            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Open Access Policy</h2>
                            <div
                                className="prose-content"
                                dangerouslySetInnerHTML={{ __html: open_access_policy }}
                            />
                        </section>
                    )}

                    {guidelines && (
                        <section className="bg-white p-8 border rounded-2xl shadow-sm border-primary/20">
                            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Author Guidelines</h2>
                            <div
                                className="prose-content"
                                dangerouslySetInnerHTML={{ __html: guidelines }}
                            />
                        </section>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
