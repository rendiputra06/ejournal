import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { FileText, Zap, FileSearch, Gavel, Users, Clock } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from './stat-card';

interface EditorData {
    stats: {
        newSubmissions: number;
        underReview: number;
        pendingDecisions: number;
        overdueReviews: number;
    };
    pendingAssignments: {
        id: number;
        title: string;
        received: string;
        author: string;
    }[];
    decisionData: {
        status: string;
        count: number;
        color: string;
    }[];
}

export const EditorView = ({ data }: { data: EditorData }) => {
    const statCards = [
        { label: 'New Submissions', value: data.stats.newSubmissions.toString(), icon: Zap, trend: 'Primary', color: 'blue' as const },
        { label: 'Under Review', value: data.stats.underReview.toString(), icon: FileSearch, trend: 'Secondary', color: 'indigo' as const },
        { label: 'Pending Decisions', value: data.stats.pendingDecisions.toString(), icon: Gavel, trend: 'Action', color: 'emerald' as const },
        { label: 'Overdue Reviews', value: data.stats.overdueReviews.toString(), icon: AlertCircle, trend: 'Alert', color: 'red' as const },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Card className="lg:col-span-3 border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Users className="size-5 text-primary" />
                            Pending Assignments
                        </CardTitle>
                        <Button variant="outline" size="sm" className="gap-2">
                            <FileText className="size-4" /> Export Report
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.pendingAssignments.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground italic text-sm">No pending assignments.</div>
                        ) : (
                            data.pendingAssignments.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 bg-white hover:border-primary/20 transition-all">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-sm text-neutral-900">{item.title}</h4>
                                        <div className="flex items-center gap-3 text-xs text-neutral-500">
                                            <span className="flex items-center gap-1"><Users className="size-3" /> {item.author}</span>
                                            <span className="flex items-center gap-1"><Clock className="size-3" /> {item.received}</span>
                                        </div>
                                    </div>
                                    <Button size="sm" asChild>
                                        <Link href={`/editorial/submissions/${item.id}`}>Assign</Link>
                                    </Button>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Gavel className="size-5 text-primary" />
                            Decisions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.decisionData} layout="vertical" margin={{ left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e5e5" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="status" type="category" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 11, fontWeight: 600 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                                        {data.decisionData.map((entry, index) => (
                                            <Cell key={`cell - ${index} `} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

import { AlertCircle } from 'lucide-react';
