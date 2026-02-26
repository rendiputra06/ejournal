import { useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { AppContent } from '@/components/app-content';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

interface Props {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
}

export default function AppSidebarLayout({
  children,
  breadcrumbs = [],
  title,
}: Props) {
  const { props } = usePage<SharedData>();

  const flash = props.flash ?? {};
  const journal = props.journal;
  const setting = props.setting as any;

  useEffect(() => {
    if (flash.success) toast.success(flash.success as string);
    if (flash.error) toast.error(flash.error as string);
  }, [flash]);

  const primaryColor = journal?.theme_color || setting?.warna || '#0ea5e9';
  const primaryForeground = '#ffffff';

  useEffect(() => {
    const unsubscribe = router.on('navigate', () => {
      router.reload({ only: ['menus'] });
    });

    return () => unsubscribe();
  }, []);

  const displayTitle = title ?? journal?.name ?? setting?.nama_app ?? 'Dashboard';

  return (
    <>
      <Head>
        <title>{displayTitle}</title>
        <style>
          {`
            :root {
              --primary: ${primaryColor};
              --color-primary: ${primaryColor};
              --primary-foreground: ${primaryForeground};
              --color-primary-foreground: ${primaryForeground};
            }
            .dark {
              --primary: ${primaryColor};
              --color-primary: ${primaryColor};
              --primary-foreground: ${primaryForeground};
              --color-primary-foreground: ${primaryForeground};
            }
          `}
        </style>
      </Head>

      <div
        className="flex min-h-screen w-full flex-col"
        style={{
          ['--primary' as any]: primaryColor,
          ['--primary-foreground' as any]: primaryForeground,
          ['--color-primary' as any]: primaryColor,
          ['--color-primary-foreground' as any]: primaryForeground,
        }}
      >
        <AppShell variant="sidebar">
          <div className="md:hidden">
            <AppSidebar />
          </div>

          <AppContent variant="header" className="flex flex-col w-full min-h-screen">
            <AppSidebarHeader breadcrumbs={breadcrumbs} />
            <main className="flex-1 p-0">
              {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="px-4 md:px-6 lg:px-8 pt-4">
                  <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
              )}
              {children}
            </main>
          </AppContent>
        </AppShell>
      </div>

      <Toaster />
    </>
  );
}
