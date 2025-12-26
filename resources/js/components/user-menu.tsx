import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UserMenu({ className }: { className?: string }) {
    const { auth } = usePage<SharedData>().props;
    const isMobile = useIsMobile();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={className || "flex items-center gap-2 px-2 py-1.5 text-left h-auto hover:bg-accent hover:text-accent-foreground"}>
                    <UserInfo user={auth.user} />
                    <ChevronsUpDown className="ml-auto size-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 rounded-lg"
                align="start"
                side={isMobile ? 'bottom' : 'bottom'}
                sideOffset={4}
            >
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
