import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, MessageSquare, CheckCircle } from 'lucide-react';

export default function AuthorDashboard() {
    return (
        <AppLayout title="Author Dashboard">
            <Head title="Author Dashboard" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-serif font-bold tracking-tight">Author Panel</h1>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Submit New Manuscript
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">My Submissions</CardTitle>
                            <FileText className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Peer Review Tasks</CardTitle>
                            <MessageSquare className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-serif">Active Submissions</CardTitle>
                        <CardDescription>Track the status of your current manuscripts in review.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="font-bold">Neural Networks in Bio-Informatics</p>
                                    <p className="text-xs text-muted-foreground uppercase">ID: SUB-2025-001 • Status: Peer Review</p>
                                </div>
                                <Button variant="outline" size="sm">View Details</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
