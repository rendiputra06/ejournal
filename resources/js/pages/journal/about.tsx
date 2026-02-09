import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

interface AboutProps {
    guidelines?: string;
}

export default function About({ guidelines }: AboutProps) {
    return (
        <PublicLayout>
            <Head title="About the Journal" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12 border-b pb-8">
                    <h1 className="text-4xl font-serif font-bold text-primary mb-2">About the Journal</h1>
                    <p className="text-xl text-muted-foreground">Our mission, values, and editorial policies.</p>
                </div>

                <div className="prose prose-slate max-w-none space-y-12 text-lg leading-relaxed text-muted-foreground">
                    {guidelines && (
                        <section className="bg-white p-8 border rounded-2xl shadow-sm border-primary/20">
                            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Author Guidelines</h2>
                            <div className="whitespace-pre-wrap">
                                {guidelines}
                            </div>
                        </section>
                    )}

                    <section className="bg-white p-8 border rounded-2xl shadow-sm">
                        <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Aims & Scope</h2>
                        <p>
                            The Journal System is a premier open-access platform committed to the rapid dissemination of
                            significant findings in all areas of Science and Humanities. Our mission is to bridge
                            the gap between theoretical research and practical application. We welcome original research,
                            reviews, and case studies that push the boundaries of current knowledge.
                        </p>
                    </section>

                    <section className="bg-white p-8 border rounded-2xl shadow-sm">
                        <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Peer Review Process</h2>
                        <p>
                            All research articles in this journal undergo rigorous peer review, based on initial
                            editor screening and anonymized refereeing by at least two independent expert reviewers.
                            Our target is to provide a first decision within 4-6 weeks of submission.
                        </p>
                    </section>

                    <section className="bg-white p-8 border rounded-2xl shadow-sm">
                        <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Open Access Policy</h2>
                        <p>
                            This journal provides immediate open access to its content on the principle that
                            making research freely available to the public supports a greater global exchange of knowledge.
                            We believe that knowledge should be a public good, available to everyone, regardless of their
                            affiliation or financial status.
                        </p>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
