import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { Fragment } from 'react';
import { usePage } from '@inertiajs/react';

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItemType[] }) {
    const { props } = usePage<SharedData>();
    const journal = props.journal;

    const formatHref = (href: string) => {
        if (!journal) return href;
        if (href.startsWith('/j/')) return href;
        if (href.startsWith('/dashboard') || href.startsWith('/settingsapp') || href.startsWith('/users') || href.startsWith('/roles') || href.startsWith('/permissions') || href.startsWith('/menus') || href.startsWith('/editorial') || href.startsWith('/author') || href.startsWith('/reviewer') || href.startsWith('/analytics') || href.startsWith('/files') || href.startsWith('/media') || href.startsWith('/email-templates') || href.startsWith('/audit-logs') || href.startsWith('/backup')) {
            return `/j/${journal.slug}${href.startsWith('/') ? '' : '/'}${href}`;
        }
        return href;
    };

    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={formatHref(item.href)}>{item.title}</BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    );
}
