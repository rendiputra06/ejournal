import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { PageHeader } from '@/components/page-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/pagination';
import { ClipboardList, User, Calendar, Activity, Database, Search } from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';

interface ActivityLog {
  id: number;
  description: string;
  created_at: string;
  causer: { name: string } | null;
  properties: Record<string, any>;
  subject_type: string | null;
}

interface Props {
  logs: {
    data: ActivityLog[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Home', href: '/dashboard' },
  { title: 'Audit Trail', href: '/audit-logs' },
];

export default function AuditLogIndex({ logs }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Audit Trail" />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Audit Trail"
            description="Comprehensive log of all administrative actions and system events for transparency and security."
          />

          <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/50">
                  <TableRow className="hover:bg-transparent border-neutral-100 dark:border-neutral-800">
                    <TableHead className="w-[200px] text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Event Detail</TableHead>
                    <TableHead className="w-[180px] text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Performed By</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Data Snapshot</TableHead>
                    <TableHead className="w-[180px] text-right text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
                          <ClipboardList className="size-12 opacity-10 mb-2" />
                          <p className="text-lg font-light italic">No activity logs recorded yet.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.data.map((log) => (
                      <TableRow key={log.id} className="group hover:bg-neutral-50/30 dark:hover:bg-neutral-900/20 border-neutral-100 dark:border-neutral-800 transition-colors">
                        <TableCell className="py-5 align-top">
                          <div className="flex flex-col gap-1.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded bg-primary/5 text-primary ring-1 ring-primary/10">
                                <Activity className="size-3" />
                              </span>
                              <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 truncate">
                                {log.description}
                              </span>
                            </div>
                            {log.subject_type && (
                              <div className="flex items-center gap-1.5 pl-7">
                                <Database className="size-3 text-neutral-400" />
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-tighter">
                                  {log.subject_type.split('\\').pop()}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="size-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 border border-neutral-200 dark:border-neutral-700">
                              <User className="size-3.5" />
                            </div>
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                              {log.causer?.name ?? 'System'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          {log.properties && Object.keys(log.properties).length > 0 ? (
                            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 group/code relative hover:border-primary/20 transition-colors">
                              <pre className="text-[10px] font-mono leading-relaxed text-neutral-600 dark:text-neutral-400 overflow-x-auto no-scrollbar max-h-40">
                                {JSON.stringify(log.properties, null, 2)}
                              </pre>
                              <div className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                <Search className="size-3 text-neutral-400" />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-400 italic">No additional data</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right align-top">
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              <Calendar className="size-3.5 opacity-60" />
                              {dayjs(log.created_at).format('MMM D, YYYY')}
                            </div>
                            <span className="text-xs text-neutral-500 font-light">
                              {dayjs(log.created_at).format('HH:mm:ss')}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Pagination links={logs.links} />
        </div>
      </div>
    </AppLayout>
  );
}
