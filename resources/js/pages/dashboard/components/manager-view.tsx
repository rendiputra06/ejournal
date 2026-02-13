import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, BookOpen, BarChart3, ShieldCheck, Activity, Globe, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatCard } from './stat-card';

interface ManagerData {
    stats: {
        totalUsers: number;
        publishedIssues: number;
        totalSubmissions: number;
        totalVisitors: number;
    };
    activityData: { month: string; activity: number }[];
    visitorData: { country: string; count: number }[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const ManagerView = ({ data }: { data: ManagerData }) => {
    const statCards = [
        { label: 'Total Users', value: data.stats.totalUsers.toLocaleString(), icon: Users, trend: 'Active', color: 'blue' as const, desc: 'Registered accounts' },
        { label: 'Total Visitors', value: data.stats.totalVisitors.toLocaleString(), icon: Globe, trend: 'Live', color: 'indigo' as const, desc: 'Total system visits' },
        { label: 'Published Issues', value: data.stats.publishedIssues.toLocaleString(), icon: BookOpen, trend: 'Released', color: 'emerald' as const, desc: 'Total issues' },
        { label: 'Total Submissions', value: data.stats.totalSubmissions.toLocaleString(), icon: BarChart3, trend: 'Lifetime', color: 'teal' as const, desc: 'All manuscripts' },
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
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Activity className="size-5 text-primary" />
                            Global Activity
                        </CardTitle>
                        <CardDescription>System usage and manuscript submissions over time.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.activityData}>
                                    <defs>
                                        <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="activity" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorActivity)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Globe className="size-5 text-primary" />
                            Visitor Geolocation
                        </CardTitle>
                        <CardDescription>Top visitor locations by country.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full flex items-center justify-center">
                            {data.visitorData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.visitorData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="country"
                                        >
                                            {data.visitorData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center space-y-2 opacity-50">
                                    <MapPin className="size-12 mx-auto" />
                                    <p className="text-sm italic">No visitor data yet.</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 space-y-2">
                            {data.visitorData.slice(0, 3).map((v, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="font-medium">{v.country}</span>
                                    </div>
                                    <span className="text-neutral-500">{v.count} visits</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
