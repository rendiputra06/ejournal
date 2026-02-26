import { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import AppearanceDropdown from '@/components/appearance-dropdown';
import { UserMenu } from '@/components/user-menu';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { iconMapper } from '@/lib/iconMapper';

interface MenuItem {
  id: number;
  title: string;
  route: string | null;
  icon: string;
  children?: MenuItem[];
}

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
  const { auth, menus = [], journal } = usePage<SharedData & { menus: MenuItem[] }>().props;
  const [lang, setLang] = useState('id');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const renderDesktopMenu = (menu: MenuItem) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isActive = menu.url && usePage().url.startsWith(menu.url);

    if (hasChildren) {
      return (
        <DropdownMenu
          key={menu.id}
          open={openMenuId === menu.id}
          onOpenChange={(open) => setOpenMenuId(open ? menu.id : null)}
        >
          <DropdownMenuTrigger
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all hover:bg-accent/50 hover:text-accent-foreground group outline-hidden appearance-none relative",
              isActive ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" : "text-muted-foreground"
            )}
          >
            <span>{menu.title}</span>
            <ChevronDown className="size-3.5 opacity-50 group-data-[state=open]:rotate-180 transition-transform duration-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            sideOffset={8}
            className="min-w-60 p-2 rounded-2xl shadow-2xl border-sidebar-border/50 bg-background/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300"
          >
            {menu.children?.map((child) => {
              const Icon = iconMapper(child.icon);
              return (
                <DropdownMenuItem key={child.id} asChild className="rounded-xl cursor-pointer py-3 px-3 transition-all focus:bg-primary/5 focus:text-primary group">
                  <Link
                    href={child.url || '#'}
                    className="flex items-center gap-3 w-full"
                    onClick={() => setOpenMenuId(null)}
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all group-hover:scale-110">
                      <Icon className="size-4.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm leading-none mb-1">{child.title}</span>
                      <span className="text-[10px] text-muted-foreground/70 font-medium uppercase tracking-tighter">Open Tool</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link
        key={menu.id}
        href={menu.url || '#'}
        onClick={() => setOpenMenuId(null)}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap hover:scale-105 active:scale-95",
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {menu.title}
      </Link>
    );
  };

  return (
    <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center justify-between px-4 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">

      {/* Left Area: Logo + Breadcrumbs */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="md:hidden">
          <SidebarTrigger className="-ml-1" />
        </div>

        <Link href={journal ? `/j/${journal.slug}/dashboard` : "/dashboard"} className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-accent/50 transition-all border border-transparent hover:border-sidebar-border/30">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-sm leading-tight text-primary hidden sm:inline-block">Editorial</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider hidden sm:inline-block">Journal System</span>
          </div>
        </Link>
      </div>

      {/* Center Area: Desktop Navigation */}
      <nav className="hidden md:flex flex-1 items-center justify-center gap-2 mx-6 overflow-x-auto no-scrollbar pointer-events-auto px-4">
        {menus.map(renderDesktopMenu)}
      </nav>

      {/* Right Area: Language + Theme + Profile */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="hidden sm:flex items-center gap-3">
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-[85px] border-sidebar-border/50 bg-transparent rounded-full h-8 px-2 hover:bg-accent focus:ring-0">
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-sidebar-border/50">
              <SelectItem value="id" className="rounded-lg">🇮🇩 ID</SelectItem>
              <SelectItem value="en" className="rounded-lg">🇺🇸 EN</SelectItem>
            </SelectContent>
          </Select>

          <div className="size-8 shrink-0 flex items-center justify-center rounded-full border border-sidebar-border/50 hover:bg-accent transition-colors">
            <AppearanceDropdown />
          </div>
        </div>

        {/* Profile Menu on the Right */}
        <div className="flex items-center rounded-full border border-sidebar-border/50 bg-background/50 pl-1 pr-1 py-1 shadow-sm hover:shadow-md transition-shadow">
          <UserMenu className="flex items-center gap-2 pr-4 pl-1 py-1 text-left h-8 rounded-full hover:bg-accent transition-all ring-0 focus:ring-0 border-0 shadow-none" />
        </div>
      </div>
    </header>
  );
}
