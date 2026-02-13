import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function ServerError() {
    return (
        <div className="min-h-svh flex flex-col items-center justify-center p-6 text-center bg-slate-50 font-sans">
            <Head title="500 - Server Error" />
            <div className="max-w-md space-y-8">
                <div className="flex justify-center">
                    <div className="p-6 rounded-3xl bg-red-50 text-red-600 shadow-xl shadow-red-200/50">
                        <AlertTriangle className="size-16" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h1 className="text-6xl font-black tracking-tighter text-slate-900">500</h1>
                    <h2 className="text-2xl font-bold text-slate-800">Server Error</h2>
                    <p className="text-slate-500 font-medium">
                        Oops! Something went wrong on our end. We're working to fix it as quickly as possible.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button onClick={() => window.location.reload()} variant="default" className="h-12 px-8 rounded-xl shadow-lg shadow-primary/20">
                        <RefreshCcw className="mr-2 size-4" /> Try Again
                    </Button>
                    <Button asChild variant="outline" className="h-12 px-8 rounded-xl bg-white border-slate-200 hover:bg-slate-50">
                        <Link href="/">Go to Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
