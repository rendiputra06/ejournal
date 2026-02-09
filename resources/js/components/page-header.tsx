import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{title}</h1>
                {description && (
                    <p className="text-base text-neutral-500 dark:text-neutral-400 max-w-2xl font-light">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex flex-wrap items-center gap-3">
                    {children}
                </div>
            )}
        </div>
    );
}
