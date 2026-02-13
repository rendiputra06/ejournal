import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-svh flex flex-col items-center justify-center p-6 text-center bg-slate-50 font-sans">
            <Head title="404 - Page Not Found" />
            <div className="max-w-md space-y-8">
                <div className="flex justify-center">
                    <div className="p-6 rounded-3xl bg-amber-50 text-amber-600 shadow-xl shadow-amber-200/50">
                        <FileQuestion className="size-16" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h1 className="text-6xl font-black tracking-tighter text-slate-900">404</h1>
                    <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
                    <p className="text-slate-500 font-medium">
                        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button asChild variant="default" className="h-12 px-8 rounded-xl shadow-lg shadow-primary/20">
                        <Link href="/">
                            <ArrowLeft className="mr-2 size-4" /> Go to Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 px-8 rounded-xl bg-white border-slate-200 hover:bg-slate-50">
                        <Link href={route('journal.current')}>Browse Archive</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
