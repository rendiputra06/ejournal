import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export default function InputError({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p
            {...props}
            className={cn('text-sm text-red-600 dark:text-red-400 mt-2 font-medium', className)}
        >
            {message}
        </p>
    ) : null;
}
