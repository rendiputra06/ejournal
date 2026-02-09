import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { type BreadcrumbItem } from '@/types';
import { PageHeader } from '@/components/page-header';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Home', href: '/dashboard' },
  { title: 'Insight Dashboard', href: '/dashboard' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const submissionStats = [
  { name: 'Research', value: 45 },
  { name: 'Review', value: 30 },
  { name: 'Case Study', value: 15 },
  { name: 'Technical', value: 10 },
];

const submissionTrend = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 19 },
  { month: 'Mar', count: 15 },
  { month: 'Apr', count: 22 },
  { month: 'May', count: 30 },
  { month: 'Jun', count: 25 },
];

export default function Dashboard() {
  const stats = [
    { label: 'Total Manuscripts', value: '1,284', icon: FileText, trend: '+12%', color: 'blue', desc: 'Cumulative submissions' },
    { label: 'Active Reviewers', value: '84', icon: Users, trend: '+3', color: 'indigo', desc: 'Verified professionals' },
    { label: 'In-Review Queue', value: '142', icon: Clock, trend: '-8', color: 'amber', desc: 'Currently in progress' },
    { label: 'Published Works', value: '862', icon: CheckCircle2, trend: '+24', color: 'emerald', desc: 'Peer-reviewed articles' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Insight Dashboard" />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <PageHeader
            title="Insight Dashboard"
            description="Real-time analytics and overview of the journal's editorial health and submission trends."
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-full ring-1 ring-neutral-200 dark:ring-neutral-700">
              <Calendar className="size-3.5" />
              Last updated: {dayjs().format('MMM D, YYYY HH:mm')}
            </div>
          </PageHeader>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden group hover:shadow-md transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "p-3 rounded-2xl ring-1 transition-colors duration-300",
                      stat.color === 'blue' ? "bg-blue-50 text-blue-600 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-900/30" :
                        stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600 ring-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:ring-indigo-900/30" :
                          stat.color === 'amber' ? "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-900/30" :
                            "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-900/30"
                    )}>
                      <stat.icon className="size-6" />
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                      stat.trend.startsWith('+') ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" : "text-amber-600 bg-amber-50 dark:bg-amber-900/20"
                    )}>
                      {stat.trend.startsWith('+') ? <TrendingUp className="size-3" /> : <Activity className="size-3" />}
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
            {/* Submission Trend Chart */}
            <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="size-5 text-primary" />
                    Publication Velocity
                  </CardTitle>
                  <CardDescription>Monthly submission volume for the current year.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowUpRight className="size-4 opacity-50" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={submissionTrend}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fontWeight: 600, fill: '#888' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fontWeight: 600, fill: '#888' }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Decision Distribution Chart */}
            <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Layers className="size-5 text-primary" />
                  Category Split
                </CardTitle>
                <CardDescription>Manuscript distribution per research field.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={submissionStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {submissionStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <Sparkles className="size-8 text-primary opacity-20 mb-1" />
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Analysis</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {submissionStats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                      <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 truncate">{stat.name}</span>
                      <span className="ml-auto text-[10px] font-black text-neutral-900 dark:text-neutral-100">{stat.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
