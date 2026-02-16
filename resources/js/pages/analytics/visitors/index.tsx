import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Users, Globe, MapPin, TrendingUp, Calendar, Search, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Visitor {
    id: number;
    ip_address: string;
    user_agent: string;
    country: string;
    country_code: string;
    city: string;
    referral: string | null;
    created_at: string;
}

interface Stats {
    totalVisitors: number;
    uniqueIPs: number;
    topCountry: { country: string; count: number } | null;
    todayVisitors: number;
}

interface ChartData {
    date?: string;
    count: number;
    country?: string;
    country_code?: string;
    city?: string;
    referral?: string;
}

interface Props {
    visitors: {
        data: Visitor[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: Stats;
    visitorsOverTime: ChartData[];
    topCountries: ChartData[];
    topCities: ChartData[];
    topReferrals: ChartData[];
    countries: string[];
    filters: {
        start_date: string;
        end_date: string;
        country: string | null;
        search: string | null;
    };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function VisitorAnalytics({ visitors, stats, visitorsOverTime, topCountries, topCities, topReferrals, countries, filters }: Props) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [selectedCountry, setSelectedCountry] = useState(filters.country || '');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleFilter = () => {
        router.get('/analytics/visitors', {
            start_date: startDate,
            end_date: endDate,
            country: selectedCountry || undefined,
            search: searchTerm || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setStartDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);
        setSelectedCountry('');
        setSearchTerm('');
        router.get('/analytics/visitors');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getBrowserFromUserAgent = (userAgent: string) => {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Other';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Visitor Analytics" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Visitor Analytics
                            </h1>
                            <p className="text-slate-600 mt-2">Comprehensive visitor tracking and analytics</p>
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </Button>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium opacity-90">Total Visitors</CardTitle>
                                    <Users className="w-5 h-5 opacity-80" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.totalVisitors.toLocaleString()}</div>
                                <p className="text-xs opacity-80 mt-1">In selected period</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium opacity-90">Unique IPs</CardTitle>
                                    <Globe className="w-5 h-5 opacity-80" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.uniqueIPs.toLocaleString()}</div>
                                <p className="text-xs opacity-80 mt-1">Distinct visitors</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium opacity-90">Top Country</CardTitle>
                                    <MapPin className="w-5 h-5 opacity-80" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.topCountry?.country || 'N/A'}</div>
                                <p className="text-xs opacity-80 mt-1">{stats.topCountry?.count || 0} visitors</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium opacity-90">Today</CardTitle>
                                    <TrendingUp className="w-5 h-5 opacity-80" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.todayVisitors.toLocaleString()}</div>
                                <p className="text-xs opacity-80 mt-1">Visitors today</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Visitors Over Time */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    Visitors Over Time
                                </CardTitle>
                                <CardDescription>Daily visitor count</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={visitorsOverTime}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ fill: '#3b82f6', r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Top Countries */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-green-600" />
                                    Top Countries
                                </CardTitle>
                                <CardDescription>Visitor distribution by country</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={topCountries.slice(0, 8)}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="country_code" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                        />
                                        <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Top Cities */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-purple-600" />
                                    Top Cities
                                </CardTitle>
                                <CardDescription>Most active cities</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {topCities.slice(0, 8).map((city, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{city.city}</p>
                                                    <p className="text-xs text-slate-500">{city.country}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-purple-600">{city.count}</p>
                                                <p className="text-xs text-slate-500">visitors</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Referrals */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-orange-600" />
                                    Top Referrals
                                </CardTitle>
                                <CardDescription>Traffic sources</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {topReferrals.slice(0, 8).map((referral, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-900 truncate text-sm">
                                                    {referral.referral}
                                                </p>
                                            </div>
                                            <div className="ml-4 flex items-center gap-2">
                                                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                                                        style={{ width: `${(referral.count / topReferrals[0].count) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="font-bold text-orange-600 w-12 text-right">{referral.count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="w-5 h-5 text-blue-600" />
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Countries" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Countries</SelectItem>
                                            {countries.map((country) => (
                                                <SelectItem key={country} value={country}>
                                                    {country}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="search">Search IP</Label>
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search by IP..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Button onClick={handleFilter} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                    Apply Filters
                                </Button>
                                <Button onClick={handleReset} variant="outline">
                                    Reset
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Visitor Table */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle>Visitor Details</CardTitle>
                            <CardDescription>
                                Showing {visitors.data.length} of {visitors.total} visitors
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>IP Address</TableHead>
                                            <TableHead>Country</TableHead>
                                            <TableHead>City</TableHead>
                                            <TableHead>Browser</TableHead>
                                            <TableHead>Referral</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {visitors.data.map((visitor) => (
                                            <TableRow key={visitor.id}>
                                                <TableCell className="font-mono text-sm">{visitor.ip_address}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl">{visitor.country_code ? `${String.fromCodePoint(...[...visitor.country_code].map(c => 127397 + c.charCodeAt(0)))}` : '🌍'}</span>
                                                        <span>{visitor.country}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{visitor.city}</TableCell>
                                                <TableCell>{getBrowserFromUserAgent(visitor.user_agent)}</TableCell>
                                                <TableCell className="max-w-xs truncate text-sm text-slate-600">
                                                    {visitor.referral || '-'}
                                                </TableCell>
                                                <TableCell className="text-sm text-slate-600">
                                                    {formatDate(visitor.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {visitors.last_page > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-sm text-slate-600">
                                        Page {visitors.current_page} of {visitors.last_page}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={visitors.current_page === 1}
                                            onClick={() => router.get(`/analytics/visitors?page=${visitors.current_page - 1}`)}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={visitors.current_page === visitors.last_page}
                                            onClick={() => router.get(`/analytics/visitors?page=${visitors.current_page + 1}`)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
