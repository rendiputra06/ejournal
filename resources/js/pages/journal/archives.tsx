import React from 'react';
import { Head } from '@inertiajs/react';

export default function Archives() {
    return (
        <div className="min-h-screen bg-background">
            <Head title="Archives" />
            <div className="max-w-7xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-serif font-bold mb-8">Archives</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[2025, 2024, 2023].map((year) => (
                        <div key={year} className="p-8 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-2xl font-bold mb-4">Volume {year - 2013} ({year})</h2>
                            <ul className="space-y-2 text-primary hover:underline cursor-pointer">
                                <li>No 1: Spring</li>
                                <li>No 2: Summer</li>
                                <li>No 3: Fall</li>
                                <li>No 4: Winter</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
