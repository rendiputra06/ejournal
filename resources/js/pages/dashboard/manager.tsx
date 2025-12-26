import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, BookOpen, BarChart3, ShieldCheck } from 'lucide-react';

export default function ManagerDashboard() {
    return (
        <AppLayout title="Manager Dashboard">
            <Head title="Manager Dashboard" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Journal Management Panel</h1>
                    <Button variant="outline">
                        <Settings className="mr-2 h-4 w-4" />
                        Journal Settings
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Users', value: '1,240', icon: Users, color: 'text-blue-500' },
                        { label: 'Published Issues', value: '48', icon: BookOpen, color: 'text-emerald-500' },
                        { label: 'Submissions Rate', value: '+14%', icon: BarChart3, color: 'text-purple-500' },
                        { label: 'Security Status', value: 'Optimal', icon: ShieldCheck, color: 'text-teal-500' },
                    ].map((item, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">{item.label}</CardTitle>
                                <item.icon className={`h-4 w-4 ${item.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{item.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-serif">Global Journal Activity</CardTitle>
                            <CardDescription>Submissions, reviews and publication activity across all systems.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-slate-50 text-muted-foreground italic">
                            Global activity chart placeholder
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-serif">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Button variant="ghost" className="justify-start">Configure Editorial Board</Button>
                            <Button variant="ghost" className="justify-start">Update Submission Guidelines</Button>
                            <Button variant="ghost" className="justify-start">Review System Logs</Button>
                            <Button variant="ghost" className="justify-start">Manage Announcements</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
