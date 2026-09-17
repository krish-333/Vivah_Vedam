"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  List,
  CalendarCheck,
  CalendarClock,
  DollarSign,
  Star,
  MessageSquare,
  UserCircle,
  Building2,
  FileText,
  Settings,
} from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { DashboardShell } from "@/components/layouts/dashboard-shell";
import type { SidebarItem } from "@/components/layouts/sidebar";
import { useUnreadMessages } from "@/hooks/use-unread-messages";

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/vendor", icon: LayoutDashboard },
  { label: "Listings", href: "/vendor/listings", icon: List },
  { label: "Bookings", href: "/vendor/bookings", icon: CalendarCheck },
  { label: "Availability", href: "/vendor/availability", icon: CalendarClock },
  { label: "Earnings", href: "/vendor/earnings", icon: DollarSign },
  { label: "Reviews", href: "/vendor/reviews", icon: Star },
  { label: "Messages", href: "/vendor/messages", icon: MessageSquare },
  { label: "Business Profile", href: "/vendor/business-profile", icon: Building2 },
  { label: "Contract", href: "/vendor/contract", icon: FileText },
  { label: "Profile", href: "/vendor/profile", icon: UserCircle },
  { label: "Settings", href: "/vendor/settings", icon: Settings },
];

export default function VendorLayout({ children }: { children: ReactNode }) {
  const { count, loading } = useUnreadMessages();

  const items: SidebarItem[] = sidebarItems.map((item) =>
    item.href === "/vendor/messages"
      ? { ...item, badgeCount: count, badgeLoading: loading }
      : item
  );

  return (
    <>
      <Navbar />
      <DashboardShell sidebarItems={items} sidebarTitle="Vendor Portal">
        {children}
      </DashboardShell>
    </>
  );
}
