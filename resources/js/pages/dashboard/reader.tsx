import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Search, Clock, Bell } from 'lucide-react';

export default function ReaderDashboard() {
    return (
        <AppLayout title="My Library">
            <Head title="Reader Dashboard" />
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">My Library</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-serif flex items-center justify-between">
                                    Recent Article Alerts
                                    <Bell className="w-5 h-5 text-amber-500" />
                                </CardTitle>
                                <CardDescription>Based on your research interests.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex gap-4 border-b last:border-0 pb-4">
                                        <div className="w-16 h-20 bg-muted flex-shrink-0 rounded flex items-center justify-center text-[10px] font-bold text-center p-2 border">PDF</div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-sm leading-tight hover:text-primary cursor-pointer">
                                                Advanced Quantum Computing Algorithms for Financial Modeling
                                            </h4>
                                            <p className="text-xs text-muted-foreground">Published: Dec 20, 2025 • vol 12 no 4</p>
                                            <Button variant="link" size="sm" className="p-0 h-auto text-secondary">Read Article</Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-serif flex items-center gap-2 text-sm">
                                    <Bookmark className="w-4 h-4 text-primary" />
                                    Saved for Later
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground italic">You have no saved articles at the moment.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-serif flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-primary" />
                                    Reading History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-xs font-medium truncate italic hover:underline cursor-pointer">Impact of AI in Healthcare...</p>
                                <p className="text-xs font-medium truncate italic hover:underline cursor-pointer">Sustainable Urban Dev...</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
