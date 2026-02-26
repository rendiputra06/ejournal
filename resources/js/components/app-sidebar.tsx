import { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

import { usePage, Link } from '@inertiajs/react';
import AppLogo from './app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { iconMapper } from '@/lib/iconMapper';
import type { LucideIcon } from 'lucide-react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { type SharedData } from '@/types';

interface MenuItem {
  id: number;
  title: string;
  url: string | null;
  icon: string;
  children?: MenuItem[];
}

/**
 * Checks if a menu item or any of its children matches the current URL.
 */
function isMenuItemActive(item: MenuItem, currentUrl: string): boolean {
  if (item.url && item.url !== '#' && currentUrl.startsWith(item.url)) {
    return true;
  }
  if (item.children && item.children.length > 0) {
    return item.children.some((child) => isMenuItemActive(child, currentUrl));
  }
  return false;
}

function RenderMenu({ items, level = 0, firstExpandedId }: { items: MenuItem[]; level?: number; firstExpandedId?: number | null }) {
  const { url: currentUrl } = usePage();

  if (!Array.isArray(items)) return null;

  return (
    <>
      {items.map((menu) => {
        if (!menu) return null;
        const Icon = iconMapper(menu.icon || 'Folder') as LucideIcon;
        const children = Array.isArray(menu.children) ? menu.children.filter(Boolean) : [];
        const hasChildren = children.length > 0;
        const isActive = isMenuItemActive(menu, currentUrl);
        const indentClass = level > 0 ? `pl-${4 + level * 2}` : '';

        const activeClass = isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground';

        if (!menu.url && !hasChildren) return null;

        return (
          <SidebarMenuItem key={menu.id}>
            {hasChildren ? (
              <Collapsible
                defaultOpen={Boolean(menu.id === firstExpandedId || isActive)}
                className="group/collapsible"
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      `group flex items-center justify-between rounded-md transition-colors ${indentClass}`,
                      activeClass,
                      level === 0 ? 'py-3 px-4 my-1' : 'py-2 px-3'
                    )}
                  >
                    <div className="flex items-center">
                      <Icon className="size-4 mr-3 opacity-80 group-hover:opacity-100" />
                      <span>{menu.title}</span>
                    </div>
                    <ChevronDown className="size-4 opacity-50 group-hover:opacity-70 transition-transform group-data-[state=open]:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="ml-2 border-l border-muted pl-2">
                    <RenderMenu items={children} level={level + 1} />
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarMenuButton
                asChild
                className={cn(
                  `group flex items-center rounded-md transition-colors ${indentClass}`,
                  activeClass,
                  level === 0 ? 'py-3 px-4 my-1' : 'py-2 px-3'
                )}
              >
                <Link href={menu.url || '#'}>
                  <Icon className="size-4 mr-3 opacity-80 group-hover:opacity-100" />
                  <span>{menu.title}</span>
                  {level > 0 && (
                    <ChevronRight className="ml-auto size-4 opacity-0 group-hover:opacity-50" />
                  )}
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        );
      })}
    </>
  );
}

export function AppSidebar() {
  const { menus = [], journal } = usePage<SharedData & { menus: MenuItem[] }>().props;

  // Find first menu item with children to expand by default
  const firstExpandedId = menus.find(m => Array.isArray(m.children) && m.children.length > 0)?.id || null;

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="px-4 py-3 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link href={journal ? `/j/${journal.slug}/dashboard` : "/dashboard"} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 font-sans">
        <SidebarMenu>
          <RenderMenu items={menus} firstExpandedId={firstExpandedId} />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3 border-t">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
