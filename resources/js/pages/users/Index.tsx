import React from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { PageHeader } from '@/components/page-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import Pagination from '@/components/pagination';
import { UserPlus, Edit2, Key, Trash2, Mail, ExternalLink, Shield } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { cn } from '@/lib/utils';

dayjs.extend(relativeTime);

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Home', href: '/dashboard' },
  { title: 'System Users', href: '/users' },
];

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  roles: {
    id: number;
    name: string;
  }[];
}

interface Props {
  users: {
    data: User[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
  };
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function UserIndex({ users }: Props) {
  const { delete: destroy, processing } = useForm();

  const handleDelete = (id: number) => {
    destroy(`/users/${id}`, { preserveScroll: true });
  };

  const handleResetPassword = (id: number) => {
    router.put(`/users/${id}/reset-password`, {}, { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Management" />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="User Directory"
            description="Manage system access, assign administrative roles, and maintain user security profiles."
          >
            <Button asChild className="gap-2 shadow-lg shadow-primary/10 rounded-full">
              <Link href="/users/create">
                <UserPlus className="size-4" />
                <span>Create New User</span>
              </Link>
            </Button>
          </PageHeader>

          <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/50">
                  <TableRow className="hover:bg-transparent border-neutral-100 dark:border-neutral-800">
                    <TableHead className="w-[300px] text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">User Information</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Security Roles</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Account Status</TableHead>
                    <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-neutral-500 py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-48 text-center text-neutral-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Shield className="size-10 opacity-10 mb-2" />
                          <p className="text-lg font-light italic">No system users found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.data.map((user) => (
                      <TableRow key={user.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 border-neutral-100 dark:border-neutral-800 transition-colors">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-sm font-bold text-primary ring-1 ring-primary/10 shadow-sm">
                              {getInitials(user.name)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50 truncate group-hover:text-primary transition-colors">
                                {user.name}
                              </span>
                              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                                <Mail className="size-3 opacity-60" />
                                <span className="truncate">{user.email}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {user.roles.length > 0 ? (
                              user.roles.map((role) => (
                                <Badge key={role.id} variant="secondary" className="px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-tight bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-none">
                                  {role.name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-neutral-400 italic">No roles assigned</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Active</span>
                            <span className="text-[10px] text-neutral-500 font-light">
                              Joined {dayjs(user.created_at).format('MMM D, YYYY')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 px-3 transition-all">
                              <Link href={`/users/${user.id}/edit`}>
                                <Edit2 className="size-3.5" />
                                <span className="text-[11px] font-bold uppercase tracking-tight">Edit</span>
                              </Link>
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 gap-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20 px-3 transition-all">
                                  <Key className="size-3.5" />
                                  <span className="text-[11px] font-bold uppercase tracking-tight">Reset</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-2xl border-none shadow-2xl ring-1 ring-neutral-200 dark:ring-neutral-800">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-xl font-bold">Secure Password Reset</AlertDialogTitle>
                                  <AlertDialogDescription className="text-sm pt-2">
                                    Are you sure you want to reset the password for <span className="font-bold text-neutral-900 dark:text-neutral-100">{user.name}</span>?
                                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-100 dark:border-amber-900/50 flex flex-col gap-2">
                                      <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 flex items-center gap-2">
                                        <Shield className="size-3" />
                                        Temporary Password
                                      </span>
                                      <code className="text-lg font-mono font-bold tracking-wider text-amber-900 dark:text-amber-200">ResetPasswordNya</code>
                                    </div>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="pt-6">
                                  <AlertDialogCancel className="rounded-xl border-neutral-200">Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleResetPassword(user.id)}
                                    disabled={processing}
                                    className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20 transition-all active:scale-95"
                                  >
                                    Execute Reset
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 gap-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 px-3 transition-all text-red-600/70 hover:text-red-600">
                                  <Trash2 className="size-3.5" />
                                  <span className="text-[11px] font-bold uppercase tracking-tight">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-2xl border-none shadow-2xl ring-1 ring-neutral-200 dark:ring-neutral-800">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-xl font-bold text-red-600">Permanently Delete User?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-sm pt-2">
                                    You are about to delete <span className="font-bold text-neutral-900 dark:text-neutral-100">{user.name}</span>. This action cannot be undone and all associated permissions will be revoked.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="pt-6">
                                  <AlertDialogCancel className="rounded-xl border-neutral-200">Keep User</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(user.id)}
                                    disabled={processing}
                                    className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all active:scale-95"
                                  >
                                    Delete Account
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Pagination links={users.links} />
        </div>
      </div>
    </AppLayout>
  );
}
