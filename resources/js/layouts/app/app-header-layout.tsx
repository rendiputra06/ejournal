import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';

interface AppHeaderLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppHeaderLayout({ children, breadcrumbs }: AppHeaderLayoutProps) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <div className="mb-4">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                )}
                {children}
            </AppContent>
        </AppShell>
    );
}
