import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSearch, Users, Star, AlertCircle } from 'lucide-react';

export default function EditorDashboard() {
    return (
        <AppLayout title="Editor Dashboard">
            <Head title="Editor Dashboard" />
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Editor-in-Chief Panel</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">New Submissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-[10px] text-amber-600 font-bold mt-1 uppercase tracking-tighter">Requires Assignment</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Under Review</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">48</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Revision Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">7</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Decision Needed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-serif">Assignment Needed</CardTitle>
                            <CardDescription>Assign editors or reviewers to these new manuscripts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="flex items-center justify-between border-b last:border-0 pb-3">
                                    <div>
                                        <p className="font-bold text-sm">Quantifying Soil Degradation in Tropical Climates</p>
                                        <p className="text-xs text-muted-foreground">Received: {i} day(s) ago</p>
                                    </div>
                                    <Button size="sm">Assign</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-serif text-amber-600 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" /> Overdue Reviews
                            </CardTitle>
                            <CardDescription>Reviewers that have missed their deadlines.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm">
                                Total 3 reviews are currently overdue. Notifications have been sent.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
