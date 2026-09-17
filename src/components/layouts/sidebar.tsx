"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badgeCount?: number;
  badgeLoading?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  title: string;
}

export function Sidebar({ items, title }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border/40 bg-card/60">
      <div className="flex flex-col gap-0.5 px-3 py-5">
        <h2 className="mb-3 px-2 font-heading text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
          {title}
        </h2>
        <nav className="flex flex-col gap-0.5">
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                  isActive
                    ? "bg-terracotta-50 text-terracotta-700 font-medium shadow-warm-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-terracotta-500" : "text-muted-foreground/60"
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badgeLoading ? (
                  <span className="h-4 w-4 animate-pulse rounded-full bg-muted" />
                ) : item.badgeCount && item.badgeCount > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta-500 px-1.5 text-[10px] font-semibold text-white">
                    {item.badgeCount > 99 ? "99+" : item.badgeCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
