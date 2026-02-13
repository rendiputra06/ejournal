import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { FileText, Clock, CheckCircle2, History, Layers, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatusBadge } from './status-badge';
import { StatCard } from './stat-card';

interface AuthorData {
    recentSubmissions: {
        id: number;
        external_id: string;
        title: string;
        status: string;
        created_at: string;
    }[];
    stats: {
        total: number;
        active: number;
        published: number;
        rejected: number;
    };
    activityData: { month: string; activity: number }[];
}

export const AuthorView = ({ data }: { data: AuthorData }) => {
    const statCards = [
        { label: 'Total Submissions', value: data.stats.total.toString(), icon: FileText, color: 'blue' as const },
        { label: 'Active Process', value: data.stats.active.toString(), icon: Clock, color: 'amber' as const },
        { label: 'Published Works', value: data.stats.published.toString(), icon: CheckCircle2, color: 'emerald' as const },
        { label: 'Rejected', value: data.stats.rejected.toString(), icon: History, color: 'red' as const },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Layers className="size-5 text-primary" />
                            My Submissions
                        </CardTitle>
                        <Button variant="ghost" className="text-xs uppercase" asChild>
                            <Link href="/author/submissions">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.recentSubmissions.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                                <Layers className="size-12" />
                                <p className="text-sm font-medium">No submission activity found.</p>
                            </div>
                        ) : (
                            data.recentSubmissions.map((m) => (
                                <div key={m.id} className="group p-4 rounded-xl border border-neutral-100 bg-white hover:border-primary/20 transition-all">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-neutral-500">{m.external_id}</span>
                                                    <StatusBadge status={m.status} />
                                                </div>
                                                <h4 className="font-bold text-sm text-neutral-900 line-clamp-1">{m.title}</h4>
                                            </div>
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/author/submissions/${m.id}`}>Manage</Link>
                                            </Button>
                                        </div>

                                        <div className="relative pt-2 pb-1 px-1">
                                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-100 -translate-y-1/2 z-0"></div>
                                            <div className="relative flex justify-between z-10">
                                                {['submitted', 'screening', 'reviewing', 'published'].map((step, idx) => {
                                                    const statuses = ['submitted', 'screening', 'reviewing', 'published'];
                                                    const currentIdx = statuses.indexOf(m.status === 'final_decision' ? 'published' : m.status);
                                                    const isActive = idx <= currentIdx;
                                                    const isCurrent = idx === currentIdx;

                                                    return (
                                                        <div key={step} className="flex flex-col items-center gap-1 group/step">
                                                            <div className={cn(
                                                                "size-3 rounded-full border-2 transition-all duration-500",
                                                                isActive ? "bg-primary border-primary scale-110" : "bg-white border-neutral-200",
                                                                isCurrent && "ring-4 ring-primary/20"
                                                            )}></div>
                                                            <span className={cn(
                                                                "text-[8px] font-bold uppercase tracking-tighter transition-colors",
                                                                isActive ? "text-primary" : "text-neutral-400"
                                                            )}>{step}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Activity className="size-5 text-primary" />
                            Productivity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.activityData}>
                                    <defs>
                                        <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="activity" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSub)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
