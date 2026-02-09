import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import { ShieldCheck, PlusCircle, Edit2, Trash2 } from 'lucide-react';

interface Permission {
  id: number;
  name: string;
  group: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface Props {
  roles: Role[];
  groupedPermissions: Record<string, Permission[]>;
}

export default function RoleIndex({ roles }: Props) {
  const { delete: destroy, processing } = useForm();

  const handleDelete = (id: number) => {
    destroy(`/roles/${id}`);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'Role Management', href: '/roles' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Role Management" />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <PageHeader
          title="Role Management"
          description="Define and manage system roles and their associated permission sets."
        >
          <Button asChild className="gap-2 shadow-sm rounded-full">
            <Link href="/roles/create">
              <PlusCircle className="size-4" />
              Add New Role
            </Link>
          </Button>
        </PageHeader>

        <div className="grid gap-6">
          {roles.length === 0 ? (
            <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800">
              <CardContent className="py-12 text-center text-neutral-500">
                No role data available.
              </CardContent>
            </Card>
          ) : (
            roles.map((role) => (
              <Card key={role.id} className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800 overflow-hidden group hover:ring-primary/20 transition-all">
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/10">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <ShieldCheck className="size-5" />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 px-1">{role.name}</h3>
                    </div>
                    <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 max-w-md">
                      Currently configured with <span className="font-semibold text-neutral-900 dark:text-neutral-200">{role.permissions.length}</span> individual system permissions.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild className="h-9 px-4 rounded-full border-neutral-200 hover:bg-neutral-100 font-medium">
                      <Link href={`/roles/${role.id}/edit`} className="flex items-center gap-2">
                        <Edit2 className="size-3.5" />
                        Edit Role
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 px-4 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 font-medium">
                          <Trash2 className="size-3.5 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-bold tracking-tight">Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-base font-light pt-2">
                            The role <span className="font-semibold text-neutral-900 dark:text-neutral-50 underline decoration-red-500/30 underline-offset-4">{role.name}</span> will be permanently removed. This may affect users currently assigned to this role.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="pt-4">
                          <AlertDialogCancel className="rounded-full h-11 px-6">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(role.id)}
                            disabled={processing}
                            className="rounded-full h-11 px-8 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-red-900/20"
                          >
                            Yes, Delete Role
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {role.permissions.length > 0 && (
                  <CardContent className="p-6 md:p-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {role.permissions.map((permission) => (
                        <Badge
                          key={permission.id}
                          variant="secondary"
                          className="justify-center py-1.5 font-medium text-[11px] uppercase tracking-wider bg-neutral-100/50 text-neutral-600 border-none rounded-md"
                        >
                          {permission.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
