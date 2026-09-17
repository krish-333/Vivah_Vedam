"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Map,
  CalendarCheck,
  DollarSign,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { DashboardShell } from "@/components/layouts/dashboard-shell";
import type { SidebarItem } from "@/components/layouts/sidebar";
import { useUnreadMessages } from "@/hooks/use-unread-messages";

const sidebarItems: SidebarItem[] = [
  { label: "Journey", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Journey Steps", href: "/dashboard/journey", icon: Map },
  { label: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
  { label: "Budget", href: "/dashboard/budget", icon: DollarSign },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function CoupleLayout({ children }: { children: ReactNode }) {
  const { count, loading } = useUnreadMessages();

  const items: SidebarItem[] = sidebarItems.map((item) =>
    item.href === "/dashboard/messages"
      ? { ...item, badgeCount: count, badgeLoading: loading }
      : item
  );

  return (
    <>
      <Navbar />
      <DashboardShell sidebarItems={items} sidebarTitle="My Wedding">
        {children}
      </DashboardShell>
    </>
  );
}
