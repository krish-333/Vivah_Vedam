"use client";

import { Sidebar } from "@/components/layouts/sidebar";
import type { SidebarItem } from "@/components/layouts/sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  sidebarTitle: string;
}

export function DashboardShell({
  children,
  sidebarItems,
  sidebarTitle,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar items={sidebarItems} title={sidebarTitle} />
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
}
