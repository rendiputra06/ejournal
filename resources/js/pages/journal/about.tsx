import React from 'react';
import { Head } from '@inertiajs/react';

export default function About() {
    return (
        <div className="min-h-screen bg-background">
            <Head title="About the Journal" />
            <div className="max-w-3xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-serif font-bold mb-8 uppercase tracking-widest text-primary border-b-2 border-primary pb-4">About the Journal</h1>
                <div className="prose prose-slate max-w-none space-y-6 text-lg leading-relaxed text-muted-foreground">
                    <section>
                        <h2 className="text-2xl font-serif font-bold text-foreground">Aims & Scope</h2>
                        <p>
                            The Journal System is a premier open-access platform committed to the rapid dissemination of
                            significant findings in all areas of Science and Humanities. Our mission is to bridge
                            the gap between theoretical research and practical application.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-serif font-bold text-foreground">Peer Review Process</h2>
                        <p>
                            All research articles in this journal undergo rigorous peer review, based on initial
                            editor screening and anonymized refereeing by at least two independent expert reviewers.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-serif font-bold text-foreground">Open Access Policy</h2>
                        <p>
                            This journal provides immediate open access to its content on the principle that
                            making research freely available to the public supports a greater global exchange of knowledge.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
