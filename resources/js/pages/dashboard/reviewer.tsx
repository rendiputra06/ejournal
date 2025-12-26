import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, History, Info } from 'lucide-react';

export default function ReviewerDashboard() {
    return (
        <AppLayout title="Reviewer Dashboard">
            <Head title="Reviewer Dashboard" />
            <div className="p-6 space-y-6 font-sans">
                <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Reviewer Panel</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-primary/20 bg-primary/[0.02]">
                        <CardHeader>
                            <CardTitle className="font-serif flex items-center gap-2">
                                <ClipboardCheck className="w-5 h-5 text-primary" />
                                Pending Reviews
                            </CardTitle>
                            <CardDescription>Articles assigned to you for assessment.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 border rounded-xl bg-white space-y-3">
                                <h4 className="font-bold">Sustainable Architecture in High-Density Cities</h4>
                                <p className="text-xs text-muted-foreground">Due Date: Jan 15, 2026 (20 days remaining)</p>
                                <div className="flex gap-2">
                                    <Button size="sm">Accept Request</Button>
                                    <Button size="sm" variant="ghost">Decline</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-serif flex items-center gap-2">
                                <History className="w-5 h-5 text-muted-foreground" />
                                Completed Reviews
                            </CardTitle>
                            <CardDescription>Your contribution history.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground italic">You have completed 12 reviews in this journal since 2024.</p>
                        </CardContent>
                    </Card>
                </div>

                <section className="p-6 bg-slate-900 text-slate-100 rounded-2xl flex items-center gap-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <Info className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold">Reviewer Guidelines Updated</h4>
                        <p className="text-sm text-slate-400">Please read our latest policy on AI-assisted review tools before submitting your reports.</p>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
