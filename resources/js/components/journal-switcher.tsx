import { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { BookOpen, ChevronsUpDown, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AppLogo from './app-logo';

interface Journal {
  id: number;
  name: string;
  slug: string;
}

export function JournalSwitcher({ variant = 'sidebar' }: { variant?: 'sidebar' | 'header' }) {
  const { props } = usePage();
  const currentJournal = props.journal as Journal;
  const availableJournals = (props.available_journals as Journal[]) || [];

  const handleSwitch = (journal: Journal) => {
    if (journal.id === currentJournal?.id) return;
    
    router.post(route('journals.switch', journal.id), {}, {
      preserveScroll: true,
      onSuccess: () => {
        window.location.reload();
      }
    });
  };

  const trigger = variant === 'sidebar' ? (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <BookOpen className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">
          {currentJournal?.name || 'Academic Press'}
        </span>
        <span className="truncate text-xs text-muted-foreground capitalize">
          {currentJournal?.slug || 'Journal Context'}
        </span>
      </div>
      <ChevronsUpDown className="ml-auto size-4 opacity-50" />
    </SidebarMenuButton>
  ) : (
    <Button
      variant="ghost"
      className="flex items-center gap-2 px-3 py-2 h-10 rounded-xl hover:bg-accent transition-all border border-sidebar-border/30 shadow-sm"
    >
      <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
        <BookOpen className="size-4 text-white" />
      </div>
      <div className="flex flex-col items-start pr-1">
        <span className="text-xs font-bold leading-none mb-0.5">{currentJournal?.name || 'Academic Press'}</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{currentJournal?.slug || 'Portal'}</span>
      </div>
      <ChevronsUpDown className="size-3.5 opacity-50" />
    </Button>
  );

  const content = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-xl shadow-2xl p-2 border-sidebar-border/50"
        align={variant === 'sidebar' ? 'start' : 'end'}
        side={variant === 'sidebar' ? 'bottom' : 'bottom'}
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase tracking-widest font-black px-3 py-2">
          Switch Journal Context
        </DropdownMenuLabel>
        <div className="space-y-1">
            {availableJournals.map((journal) => (
            <DropdownMenuItem
                key={journal.id}
                onClick={() => handleSwitch(journal)}
                className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all focus:bg-primary/5 focus:text-primary group",
                    currentJournal?.id === journal.id && "bg-primary/5 text-primary"
                )}
            >
                <div className={cn(
                    "flex size-9 items-center justify-center rounded-lg border transition-all group-hover:scale-110",
                    currentJournal?.id === journal.id ? "bg-primary/10 border-primary/20" : "bg-muted/50"
                )}>
                <BookOpen className={cn("size-4.5", currentJournal?.id === journal.id ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="font-bold text-sm truncate">{journal.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tighter italic">/{journal.slug}</span>
                </div>
                {currentJournal?.id === journal.id && (
                    <Check className="size-4 text-primary shrink-0" />
                )}
            </DropdownMenuItem>
            ))}
        </div>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem className="p-0 rounded-lg overflow-hidden" asChild>
          <Link 
            href={route('journals.index')}
            className="flex items-center gap-3 w-full p-2.5 hover:bg-accent transition-colors"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Plus className="size-5" />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-xs uppercase tracking-tight text-slate-600">Journal Manager</span>
                <span className="text-[10px] text-slate-400 font-medium">Create or configure journals</span>
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return variant === 'sidebar' ? (
    <SidebarMenu>
      <SidebarMenuItem>
        {content}
      </SidebarMenuItem>
    </SidebarMenu>
  ) : (
    <div className="flex items-center">
      {content}
    </div>
  );
}
