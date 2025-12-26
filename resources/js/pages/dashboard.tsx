import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area,
  Legend
} from 'recharts';
import { FileText, Users, CheckCircle, Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

const summaryData = [
  { label: 'Total Submissions', value: 124, color: 'text-blue-600', icon: FileText, desc: '+12% from last month' },
  { label: 'Active Reviewers', value: 45, color: 'text-emerald-600', icon: Users, desc: '8 currently available' },
  { label: 'Published Articles', value: 892, color: 'text-amber-600', icon: CheckCircle, desc: 'Across 12 volumes' },
  { label: 'Avg. Review Time', value: '42d', color: 'text-purple-600', icon: Clock, desc: '-5 days from target' },
];

const submissionTrends = [
  { month: 'Jul', Submissions: 12, PeerReview: 8 },
  { month: 'Aug', Submissions: 18, PeerReview: 14 },
  { month: 'Sep', Submissions: 15, PeerReview: 10 },
  { month: 'Oct', Submissions: 25, PeerReview: 20 },
  { month: 'Nov', Submissions: 22, PeerReview: 18 },
  { month: 'Dec', Submissions: 30, PeerReview: 24 },
];

const distributionData = [
  { name: 'Accepted', value: 65, color: 'hsl(215, 50%, 23%)' },
  { name: 'Revision', value: 20, color: 'hsl(25, 75%, 45%)' },
  { name: 'Declined', value: 15, color: 'hsl(0, 84%, 60%)' },
];

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-col gap-6 p-6">

        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-bold tracking-tight">Editorial Overview</h1>
          <p className="text-muted-foreground">Welcome back. Here is what is happening with the journal today.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryData.map((item, index) => (
            <Card key={index} className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">

          {/* Main Chart */}
          <Card className="lg:col-span-4 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif">Submission & Review Trends</CardTitle>
              <CardDescription>Monthly volume of new submissions vs peer review activity.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] pl-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={submissionTrends}>
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" />
                  <Bar dataKey="Submissions" fill="hsl(215, 50%, 23%)" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="PeerReview" fill="hsl(25, 75%, 45%)" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Side Chart */}
          <Card className="lg:col-span-3 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif">Decision Distribution</CardTitle>
              <CardDescription>Current status of all active submissions.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>

        {/* Recent Activity Table (Placeholder for UI) */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif">Recent Submissions</CardTitle>
            <CardDescription>New articles awaiting initial editorial assessment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-sm hover:text-primary cursor-pointer transition-colors">
                      {i === 1 ? 'Impact of AI on Modern Healthcare Systems' : i === 2 ? 'Renewable Energy Policy in South East Asia' : 'Socio-economic effects of Remote Work'}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-tight font-medium">Author: Dr. Jane Smith • Received: 2h ago</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${i === 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                    {i === 1 ? 'New' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
