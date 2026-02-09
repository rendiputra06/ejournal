import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Clock,
    CheckCircle2,
    AlertCircle,
    Edit3,
    Send,
    FileSearch,
    XCircle,
    Activity
} from 'lucide-react';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'; icon: any }> = {
    // Manuscript Statuses
    draft: { label: 'Draft', variant: 'secondary', icon: Edit3 },
    submitted: { label: 'Submitted', variant: 'info', icon: Send },
    screening: { label: 'Screening', variant: 'warning', icon: FileSearch },
    reviewing: { label: 'In Review', variant: 'info', icon: Activity },
    accepted: { label: 'Accepted', variant: 'success', icon: CheckCircle2 },
    declined: { label: 'Declined', variant: 'destructive', icon: XCircle },
    revision: { label: 'Revision Required', variant: 'warning', icon: AlertCircle },
    final_decision: { label: 'Completed', variant: 'success', icon: CheckCircle2 },

    // Default / Generic
    pending: { label: 'Pending', variant: 'warning', icon: Clock },
    active: { label: 'Active', variant: 'success', icon: CheckCircle2 },
    inactive: { label: 'Inactive', variant: 'secondary', icon: XCircle },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const key = status.toLowerCase();
    const config = statusConfig[key] || {
        label: status.replace(/_/g, ' '),
        variant: 'outline' as const,
        icon: Activity
    };

    const Icon = config.icon;

    return (
        <Badge
            variant={config.variant}
            className={cn(
                "flex w-fit items-center gap-1.5 px-2.5 py-0.5 font-semibold text-[10px] uppercase tracking-wider rounded-full",
                className
            )}
        >
            <Icon className="size-3" />
            {config.label}
        </Badge>
    );
}
