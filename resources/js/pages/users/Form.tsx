import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MultiSelect } from '@/components/ui/multi-select';
import { PageHeader } from '@/components/page-header';
import { LoadingButton } from '@/components/loading-button';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

interface Role {
  id: number;
  name: string;
}

interface User {
  id?: number;
  name: string;
  email: string;
}

interface Props {
  user?: User;
  roles: Role[];
  selectedRoles?: string[];
}

export default function UserForm({ user, roles, selectedRoles }: Props) {
  const isEdit = !!user;

  const { data, setData, post, put, processing, errors } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    roles: selectedRoles || [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isEdit ? put(`/users/${user?.id}`) : post('/users');
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/dashboard' },
    { title: 'User Management', href: '/users' },
    { title: isEdit ? 'Edit User' : 'Create User', href: '#' },
  ];

  const roleOptions = roles.map((role) => ({
    label: role.name,
    value: role.name,
  }));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isEdit ? 'Edit User' : 'Create User'} />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <PageHeader
            title={isEdit ? 'Edit User' : 'Create New User'}
            description={isEdit ? 'Update account details and group assignments.' : 'Set up a new user account with specific role access.'}
            className="mb-6"
          />

          <Card className="border-none shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-800">
            <CardContent className="pt-8 px-6 md:px-10">
              <form onSubmit={handleSubmit} className="space-y-8 pb-4">
                <div className="space-y-6">
                  {/* Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-sm font-semibold tracking-wide uppercase text-neutral-500">Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className={cn(
                        "h-11 transition-all focus:ring-2 focus:ring-primary/20",
                        errors.name && "border-red-500 focus:ring-red-500/20"
                      )}
                    />
                    <InputError message={errors.name} />
                  </div>

                  {/* Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm font-semibold tracking-wide uppercase text-neutral-500">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className={cn(
                        "h-11 transition-all focus:ring-2 focus:ring-primary/20",
                        errors.email && "border-red-500 focus:ring-red-500/20"
                      )}
                    />
                    <InputError message={errors.email} />
                  </div>

                  {/* Password */}
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-sm font-semibold tracking-wide uppercase text-neutral-500">
                      Password {isEdit && <span className="text-xs font-normal lowercase italic text-neutral-400 font-sans tracking-normal">(Leave blank to keep current)</span>}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      className={cn(
                        "h-11 transition-all focus:ring-2 focus:ring-primary/20",
                        errors.password && "border-red-500 focus:ring-red-500/20"
                      )}
                    />
                    <InputError message={errors.password} />
                  </div>

                  {/* Role */}
                  <div className="grid gap-2">
                    <Label htmlFor="roles" className="text-sm font-semibold tracking-wide uppercase text-neutral-500">System Roles</Label>
                    <MultiSelect
                      options={roleOptions}
                      selected={data.roles}
                      onChange={(selected: string[]) => setData('roles', selected)}
                      placeholder="Select one or more roles"
                      className={cn(
                        errors.roles && "border-red-500 focus:ring-red-500/20"
                      )}
                    />
                    <InputError message={errors.roles} />
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                  <Link href="/users" className="w-full sm:w-auto">
                    <Button type="button" variant="ghost" className="w-full h-11 px-8 hover:bg-neutral-100">
                      Cancel
                    </Button>
                  </Link>
                  <LoadingButton
                    type="submit"
                    loading={processing}
                    className="w-full sm:w-auto h-11 px-10 shadow-lg shadow-primary/20"
                  >
                    {isEdit ? 'Save Changes' : 'Create Account'}
                  </LoadingButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
