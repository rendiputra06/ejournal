import { usePage, router } from '@inertiajs/react';
import { BookOpen, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface Journal {
  id: number;
  name: string;
  slug: string;
}

export function JournalContextBar() {
  const { props } = usePage();
  const currentJournal = props.journal as Journal;
  const availableJournals = (props.available_journals as Journal[]) || [];

  const handleSwitch = (journal: Journal) => {
    if (journal.id === currentJournal?.id) return;
    router.post(route('journals.switch', journal.id), {}, {
      preserveScroll: true,
      onSuccess: () => window.location.reload(),
    });
  };

  if (!currentJournal) return null;

  return (
    <div className="hidden md:flex items-center gap-3 px-4 md:px-6 lg:px-8 py-2 border-b bg-muted/30 backdrop-blur-sm">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 shrink-0">
        Journal Context
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 rounded-lg border-sidebar-border/50 bg-background text-sm font-semibold hover:bg-accent transition-all max-w-xs"
          >
            <div className="size-5 rounded bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="size-3 text-primary" />
            </div>
            <span className="truncate">{currentJournal.name}</span>
            <ChevronsUpDown className="size-3.5 opacity-40 shrink-0 ml-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="min-w-72 rounded-xl shadow-xl p-2 border-sidebar-border/50"
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
                  'flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all focus:bg-primary/5 focus:text-primary',
                  currentJournal.id === journal.id && 'bg-primary/5 text-primary'
                )}
              >
                <div className={cn(
                  'flex size-8 items-center justify-center rounded-lg border transition-all',
                  currentJournal.id === journal.id ? 'bg-primary/10 border-primary/20' : 'bg-muted/50'
                )}>
                  <BookOpen className={cn('size-4', currentJournal.id === journal.id ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="font-bold text-sm truncate">{journal.name}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-tighter italic">/{journal.slug}</span>
                </div>
                {currentJournal.id === journal.id && (
                  <Check className="size-4 text-primary shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuItem asChild className="rounded-lg overflow-hidden p-0">
            <a
              href={route('journals.index')}
              className="flex items-center gap-3 w-full p-2.5 hover:bg-accent transition-colors"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 shrink-0">
                <BookOpen className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs uppercase tracking-tight text-slate-600">Journal Manager</span>
                <span className="text-[10px] text-slate-400 font-medium">Create or configure journals</span>
              </div>
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
