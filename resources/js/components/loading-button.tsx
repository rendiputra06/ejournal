import React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
    loading?: boolean;
    loadingText?: string;
}

export function LoadingButton({
    children,
    loading,
    loadingText,
    className,
    disabled,
    ...props
}: LoadingButtonProps) {
    return (
        <Button
            disabled={loading || disabled}
            className={cn("gap-2", className)}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {loadingText || children}
                </>
            ) : (
                children
            )}
        </Button>
    );
}
