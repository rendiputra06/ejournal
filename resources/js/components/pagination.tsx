import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    className?: string;
}

export default function Pagination({ links, className }: PaginationProps) {
    if (links.length <= 3) return null; // Don't show if only "Previous", "1", "Next"

    return (
        <div className={cn('flex flex-wrap items-center justify-center gap-1.5 pt-8', className)}>
            {links.map((link, index) => {
                const isPrevious = link.label.includes('Previous');
                const isNext = link.label.includes('Next');

                // Clean up labels from Laravel (it often includes &laquo; and &raquo;)
                const cleanLabel = link.label
                    .replace('&laquo;', '')
                    .replace('&raquo;', '')
                    .replace('Previous', '')
                    .replace('Next', '')
                    .trim();

                return (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        preserveScroll
                        className={cn(
                            'inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200',
                            !link.url && 'pointer-events-none opacity-40 grayscale',
                            link.active
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                                : 'bg-background hover:bg-neutral-100 text-neutral-600 border border-neutral-200 hover:border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-800'
                        )}
                    >
                        {isPrevious ? (
                            <div className="flex items-center gap-1">
                                <ChevronLeft className="size-4" />
                                <span className="hidden sm:inline">Previous</span>
                            </div>
                        ) : isNext ? (
                            <div className="flex items-center gap-1">
                                <span className="hidden sm:inline">Next</span>
                                <ChevronRight className="size-4" />
                            </div>
                        ) : (
                            cleanLabel
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
