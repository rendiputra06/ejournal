import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Activity,
    Users,
    FileText,
    BookOpen,
    BarChart3,
    ShieldCheck,
    Zap,
    ArrowUpRight,
    FileSearch,
    Gavel,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Clock,
    TrendingUp,
    Search,
    History,
    Layers,
    ClipboardCheck,
    Timer,
    Star,
    Info,
    Scale,
    PenTool
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import dayjs from 'dayjs';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, YAxis } from 'recharts';
import { PageHeader } from '@/components/page-header';

// --- Interfaces ---

interface CommonData {
    announcements: {
        id: number;
        title: string;
        date: string;
        content: string;
    }[];
    latestArticles: {
        id: number;
        title: string;
        published_at: string;
        author: string;
    }[];
}

interface ManagerData {
    stats: {
        totalUsers: number;
        publishedIssues: number;
        totalSubmissions: number;
    };
    activityData: { month: string; activity: number }[];
}

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
    };
    activityData: { month: string; activity: number }[];
}

interface ReaderData {
    latestIssues: {
        id: number;
        volume: number;
        number: number;
        year: number;
        published_at: string;
    }[];
    recommendedArticles: {
        id: number;
        title: string;
        abstract: string;
        author: string;
    }[];
}

interface DashboardProps {
    roles: string[];
    data: {
        common: CommonData;
        manager?: ManagerData;
        editor?: EditorData;
        author?: AuthorData;
        reader?: ReaderData;
        reviewer?: any;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

// --- Helper Components ---

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'draft': return <Badge variant="secondary" className="bg-neutral-100 text-neutral-600">Draft</Badge>;
        case 'submitted': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Pending</Badge>;
        case 'screening': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">Screening</Badge>;
        case 'reviewing': return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none">In Review</Badge>;
        case 'final_decision': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Published</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

const CommunitySidebar = ({ data }: { data: CommonData }) => (
    <div className="space-y-6">
        <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Activity className="size-5 text-primary" />
                    Latest Updates
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {data?.announcements?.map((item) => (
                    <div key={item.id} className="pb-3 border-b border-neutral-100 last:border-0 last:pb-0">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{item.date}</span>
                        <h4 className="font-bold text-sm text-neutral-900 mt-1">{item.title}</h4>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.content}</p>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <BookOpen className="size-5 text-primary" />
                    Just Published
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {data?.latestArticles?.map((article) => (
                    <div key={article.id} className="flex items-start gap-3 group cursor-pointer">
                        <div className="mt-1 p-1.5 rounded-lg bg-neutral-100 text-neutral-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <FileText className="size-4" />
                        </div>
                        <div>
                            <h4 className="font-bold text-xs text-neutral-900 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h4>
                            <p className="text-[10px] text-neutral-500 mt-0.5">{article.author}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
);

const SystemGuideShortcut = ({ roleIcon: Icon, roleName, colorClass }: { roleIcon: any, roleName: string, colorClass: string }) => (
    <div className="mt-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 px-1">{roleName} Guide</h2>
        <Card className={cn("text-white border-none shadow-xl rounded-2xl overflow-hidden group transition-all hover:shadow-2xl", colorClass)}>
            <CardContent className="p-0">
                <Link href={route('guides.index')} className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
                    <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <Icon className="size-8" />
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold">Comprehensive {roleName} Guide</h3>
                        <p className="text-white/70 font-light max-w-xl">Master the {roleName.toLowerCase()} workflow with our step-by-step instructions and visual system guide.</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 font-bold text-sm bg-white/15 px-6 py-3 rounded-xl hover:bg-white/25 transition-colors">
                        Open Guide
                        <ArrowUpRight className="size-4" />
                    </div>
                </Link>
            </CardContent>
        </Card>
    </div>
);

// --- Role Views ---

const ManagerView = ({ data }: { data: ManagerData }) => {
    const statCards = [
        { label: 'Total Users', value: data.stats.totalUsers.toLocaleString(), icon: Users, trend: 'Active', color: 'blue', desc: 'Registered accounts' },
        { label: 'Published Issues', value: data.stats.publishedIssues.toLocaleString(), icon: BookOpen, trend: 'Released', color: 'emerald', desc: 'Total issues' },
        { label: 'Total Submissions', value: data.stats.totalSubmissions.toLocaleString(), icon: BarChart3, trend: 'Lifetime', color: 'indigo', desc: 'All manuscripts' },
        { label: 'Security Status', value: 'Optimal', icon: ShieldCheck, trend: 'Safe', color: 'teal', desc: 'System integrity' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden group hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className={cn(
                                    "p-3 rounded-2xl ring-1 transition-colors duration-300",
                                    stat.color === 'blue' ? "bg-blue-50 text-blue-600 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-900/30" :
                                        stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600 ring-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:ring-indigo-900/30" :
                                            stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-900/30" :
                                                "bg-teal-50 text-teal-600 ring-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:ring-teal-900/30"
                                )}>
                                    <stat.icon className="size-6" />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                                    stat.trend === 'Safe' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" :
                                        "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                                )}>
                                    {stat.trend === 'Safe' ? <ShieldCheck className="size-3" /> : <Activity className="size-3" />}
                                    {stat.trend}
                                </div>
                            </div>
                            <div className="mt-4 space-y-1">
                                <p className="text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">{stat.value}</p>
                                <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Activity className="size-5 text-primary" />
                            Global Turnout
                        </CardTitle>
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
                            <Zap className="size-5 text-primary" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Button asChild variant="outline" className="justify-start h-12 rounded-xl border-neutral-200 hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <Link href={route('users.index', { role: 'editor' })} className="w-full flex items-center">
                                <span className="ml-1 font-medium">Configure Editorial Board</span>
                                <ArrowUpRight className="ml-auto size-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="justify-start h-12 rounded-xl border-neutral-200 hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <Link href={route('setting.edit')} className="w-full flex items-center">
                                <span className="ml-1 font-medium">Update Guidelines</span>
                                <ArrowUpRight className="ml-auto size-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="justify-start h-12 rounded-xl border-neutral-200 hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <Link href={route('audit-logs.index')} className="w-full flex items-center">
                                <span className="ml-1 font-medium">System Logs</span>
                                <ArrowUpRight className="ml-auto size-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="justify-start h-12 rounded-xl border-neutral-200 hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <Link href={route('editorial.announcements.index')} className="w-full flex items-center">
                                <span className="ml-1 font-medium">Announcements</span>
                                <ArrowUpRight className="ml-auto size-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <SystemGuideShortcut
                roleName="Admin / Manager"
                roleIcon={ShieldCheck}
                colorClass="bg-indigo-600 shadow-xl shadow-indigo-600/20"
            />
        </div>
    );
};

const EditorView = ({ data }: { data: EditorData }) => {
    const statCards = [
        { label: 'New Submissions', value: data.stats.newSubmissions.toString(), icon: FileText, trend: 'New', color: 'blue' },
        { label: 'Under Review', value: data.stats.underReview.toString(), icon: FileSearch, trend: 'Active', color: 'indigo' },
        { label: 'Pending Decisions', value: data.stats.pendingDecisions.toString(), icon: Gavel, trend: 'Action', color: 'amber' },
        { label: 'Overdue Reviews', value: data.stats.overdueReviews.toString(), icon: AlertCircle, trend: 'Urgent', color: 'red' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className={cn("p-3 rounded-2xl ring-1",
                                    stat.color === 'blue' ? "bg-blue-50 text-blue-600 ring-blue-100" :
                                        stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600 ring-indigo-100" :
                                            stat.color === 'amber' ? "bg-amber-50 text-amber-600 ring-amber-100" :
                                                "bg-red-50 text-red-600 ring-red-100"
                                )}>
                                    <stat.icon className="size-6" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-black">{stat.value}</p>
                                <p className="text-sm font-bold text-neutral-500 uppercase">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Users className="size-5 text-primary" />
                            Pending Assignments
                        </CardTitle>
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
                                    <Button size="sm">Assign</Button>
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

            <SystemGuideShortcut
                roleName="Editor"
                roleIcon={Scale}
                colorClass="bg-amber-600 shadow-xl shadow-amber-600/20"
            />
        </div>
    );
};

const AuthorView = ({ data }: { data: AuthorData }) => {
    const acceptanceRate = data.stats.total > 0 ? Math.round((data.stats.published / data.stats.total) * 100) : 0;
    const statCards = [
        { label: 'Total Submissions', value: data.stats.total.toString(), icon: FileText, color: 'blue' },
        { label: 'Active Process', value: data.stats.active.toString(), icon: Clock, color: 'amber' },
        { label: 'Published Works', value: data.stats.published.toString(), icon: CheckCircle2, color: 'emerald' },
        { label: 'Success Rate', value: `${acceptanceRate}%`, icon: TrendingUp, color: 'indigo' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className={cn("p-3 rounded-2xl ring-1",
                                    stat.color === 'blue' ? "bg-blue-50 text-blue-600 ring-blue-100" :
                                        stat.color === 'amber' ? "bg-amber-50 text-amber-600 ring-amber-100" :
                                            stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600 ring-emerald-100" :
                                                "bg-indigo-50 text-indigo-600 ring-indigo-100"
                                )}>
                                    <stat.icon className="size-6" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-black">{stat.value}</p>
                                <p className="text-sm font-bold text-neutral-500 uppercase">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
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
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-neutral-500">{m.external_id}</span>
                                                <StatusBadge status={m.status} />
                                            </div>
                                            <h4 className="font-bold text-sm text-neutral-900">{m.title}</h4>
                                            <span className="text-xs text-neutral-500 flex items-center gap-1 mt-1"><Calendar className="size-3" /> {dayjs(m.created_at).format('DD MMM YYYY')}</span>
                                        </div>
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/author/submissions/${m.id}`}>Manage</Link>
                                        </Button>
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

            <SystemGuideShortcut
                roleName="Author"
                roleIcon={PenTool}
                colorClass="bg-blue-600 shadow-xl shadow-blue-600/20"
            />
        </div>
    );
};

const ReaderView = ({ data }: { data: ReaderData }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-neutral-900 text-neutral-50 overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 size-48 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                    <CardContent className="p-8 relative z-10 flex flex-col justify-center h-full">
                        <Badge className="w-fit bg-white/20 hover:bg-white/30 text-white border-none mb-4">Featured Issue</Badge>
                        <h2 className="text-3xl font-bold leading-tight">Volume 12, Number 3</h2>
                        <p className="text-neutral-300 mt-2 mb-6 max-w-md">Exploring the latest advancements in artificial intelligence and its impact on modern healthcare systems.</p>
                        <Button className="w-fit bg-white text-neutral-900 hover:bg-neutral-100 border-none">
                            Read Issue <ArrowUpRight className="ml-2 size-4" />
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm flex flex-col justify-center items-center text-center p-6">
                        <div className="p-4 rounded-full bg-blue-50 text-blue-600 mb-4">
                            <BookOpen className="size-8" />
                        </div>
                        <h3 className="font-bold text-lg">Browse Archives</h3>
                        <p className="text-sm text-neutral-500 mt-2 mb-4">Access past issues and articles.</p>
                        <Button variant="outline" size="sm">Explore</Button>
                    </Card>
                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm flex flex-col justify-center items-center text-center p-6">
                        <div className="p-4 rounded-full bg-emerald-50 text-emerald-600 mb-4">
                            <FileSearch className="size-8" />
                        </div>
                        <h3 className="font-bold text-lg">Advanced Search</h3>
                        <p className="text-sm text-neutral-500 mt-2 mb-4">Find specific topics or authors.</p>
                        <Button variant="outline" size="sm">Search</Button>
                    </Card>
                </div>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Layers className="size-5 text-primary" />
                        Recommended For You
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.recommendedArticles.map((article) => (
                        <div key={article.id} className="p-4 rounded-xl border border-neutral-100 bg-white hover:border-primary/20 transition-all flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-2">
                                <h4 className="font-bold text-sm text-neutral-900 hover:text-primary transition-colors cursor-pointer">{article.title}</h4>
                                <p className="text-xs text-neutral-500 line-clamp-2">{article.abstract}</p>
                                <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                                    <span>By {article.author}</span>
                                </div>
                            </div>
                            <Button size="sm" variant="secondary" className="self-center shrink-0">Read Abstract</Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <SystemGuideShortcut
                roleName="Reader"
                roleIcon={BookOpen}
                colorClass="bg-neutral-800 shadow-xl shadow-neutral-900/20"
            />
        </div>
    );
};

const ReviewerView = ({ data }: { data: any }) => {
    const stats = [
        { label: 'Pending Reviews', value: '2', icon: ClipboardCheck, trend: 'Due Soon', color: 'blue', desc: 'Action required' },
        { label: 'Completed Reviews', value: '45', icon: History, trend: '+3', color: 'emerald', desc: 'Total contribution' },
        { label: 'Avg Turnaround', value: '14d', icon: Timer, trend: '-2d', color: 'indigo', desc: 'Days per review' },
        { label: 'Reviewer Score', value: '4.8', icon: Star, trend: 'Top 10%', color: 'amber', desc: 'Quality rating' },
    ];

    const reviewActivity = [
        { month: 'Jan', reviews: 4 },
        { month: 'Feb', reviews: 2 },
        { month: 'Mar', reviews: 5 },
        { month: 'Apr', reviews: 3 },
        { month: 'May', reviews: 6 },
        { month: 'Jun', reviews: 4 },
    ];

    const pendingReviews = [
        { id: 1, title: 'Sustainable Architecture in High-Density Cities', dueDate: 'Jan 15, 2026', daysLeft: 20, type: 'Original Research' },
        { id: 2, title: 'Impact of Urban Green Spaces on Mental Health', dueDate: 'Feb 02, 2026', daysLeft: 38, type: 'Case Study' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden group hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className={cn(
                                    "p-3 rounded-2xl ring-1 transition-colors duration-300",
                                    stat.color === 'blue' ? "bg-blue-50 text-blue-600 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-900/30" :
                                        stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-900/30" :
                                            stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600 ring-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:ring-indigo-900/30" :
                                                "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-900/30"
                                )}>
                                    <stat.icon className="size-6" />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                                    stat.trend === 'Due Soon' ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" :
                                        stat.trend.startsWith('+') ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" :
                                            stat.trend === 'Top 10%' ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20" :
                                                "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                )}>
                                    {stat.trend === 'Due Soon' ? <Timer className="size-3" /> :
                                        stat.trend === 'Top 10%' ? <Star className="size-3" /> :
                                            stat.trend.startsWith('+') ? <TrendingUp className="size-3" /> : <CheckCircle2 className="size-3" />}
                                    {stat.trend}
                                </div>
                            </div>
                            <div className="mt-4 space-y-1">
                                <p className="text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">{stat.value}</p>
                                <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium italic">{stat.desc}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <ClipboardCheck className="size-5 text-primary" />
                                Assigned Manuscripts
                            </CardTitle>
                            <CardDescription>Articles currently awaiting your review.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {pendingReviews.map((review) => (
                            <div key={review.id} className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:border-primary/20 transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                                {review.type}
                                            </span>
                                            <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                                                <Timer className="size-3" />
                                                {review.daysLeft} days remaining
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-base text-neutral-900 dark:text-neutral-100 max-w-xl">
                                            {review.title}
                                        </h4>
                                        <p className="text-xs text-neutral-500">
                                            Due Date: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{review.dueDate}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" className="w-full md:w-auto">Decline</Button>
                                        <Button size="sm" className="w-full md:w-auto bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
                                            Start Review
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <History className="size-5 text-primary" />
                                Activity Log
                            </CardTitle>
                            <CardDescription>Reviews completed per month.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={reviewActivity}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#888' }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="reviews" radius={[4, 4, 0, 0]} barSize={32} fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-neutral-900 text-neutral-50 overflow-hidden relative">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 size-32 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-white/10 shrink-0">
                                    <Info className="size-5 text-neutral-50" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-sm">Policy Update</h4>
                                    <p className="text-xs text-neutral-400 leading-relaxed">AI guidelines for peer review have been updated.</p>
                                    <Button variant="link" className="p-0 h-auto text-white underline decoration-white/30 hover:decoration-white/100 text-xs mt-1">
                                        Read Guidelines
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <SystemGuideShortcut
                roleName="Reviewer"
                roleIcon={Search}
                colorClass="bg-emerald-600 shadow-xl shadow-emerald-600/20"
            />
        </div>
    );
};

// --- Main Component ---

export default function Dashboard({ roles, data }: DashboardProps) {
    const availableRoles: string[] = [];

    if (data.manager && (roles.includes('journal-manager') || roles.includes('admin') || roles.includes('manager'))) {
        availableRoles.push('manager');
    }
    if (data.editor) availableRoles.push('editor');
    if (data.author) availableRoles.push('author');
    if (data.reviewer) availableRoles.push('reviewer');
    if (data.reader) availableRoles.push('reader');

    const defaultTab = availableRoles.length > 0 ? availableRoles[0] : 'reader';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <PageHeader title="Dashboard" description="Welcome back. Here is your personalized overview.">
                        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-full ring-1 ring-neutral-200 dark:ring-neutral-700">
                            <Calendar className="size-3.5" />
                            {dayjs().format('MMMM D, YYYY')}
                        </div>
                    </PageHeader>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="flex-1 w-full space-y-6">
                            {availableRoles.length > 1 ? (
                                <Tabs defaultValue={defaultTab} className="w-full space-y-6">
                                    <TabsList className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl w-auto inline-flex">
                                        {availableRoles.map(role => (
                                            <TabsTrigger
                                                key={role}
                                                value={role}
                                                className="rounded-lg px-4 py-2 capitalize data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                                            >
                                                {role === 'manager' && roles.includes('admin') ? 'Admin / Manager' : role}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {data.manager && (
                                        <TabsContent value="manager" className="m-0 focus-visible:ring-0">
                                            <ManagerView data={data.manager} />
                                        </TabsContent>
                                    )}
                                    {data.editor && (
                                        <TabsContent value="editor" className="m-0 focus-visible:ring-0">
                                            <EditorView data={data.editor} />
                                        </TabsContent>
                                    )}
                                    {data.author && (
                                        <TabsContent value="author" className="m-0 focus-visible:ring-0">
                                            <AuthorView data={data.author} />
                                        </TabsContent>
                                    )}
                                    {data.reviewer && (
                                        <TabsContent value="reviewer" className="m-0 focus-visible:ring-0">
                                            <ReviewerView data={data.reviewer} />
                                        </TabsContent>
                                    )}
                                    {data.reader && (
                                        <TabsContent value="reader" className="m-0 focus-visible:ring-0">
                                            <ReaderView data={data.reader} />
                                        </TabsContent>
                                    )}
                                </Tabs>
                            ) : (
                                <>
                                    {availableRoles[0] === 'manager' && data.manager && <ManagerView data={data.manager} />}
                                    {availableRoles[0] === 'editor' && data.editor && <EditorView data={data.editor} />}
                                    {availableRoles[0] === 'author' && data.author && <AuthorView data={data.author} />}
                                    {availableRoles[0] === 'reviewer' && data.reviewer && <ReviewerView data={data.reviewer} />}
                                    {availableRoles[0] === 'reader' && data.reader && <ReaderView data={data.reader} />}
                                </>
                            )}
                        </div>

                        <div className="w-full lg:w-80 shrink-0">
                            <CommunitySidebar data={data.common} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
