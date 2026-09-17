"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Tag,
  CalendarCheck,
  DollarSign,
  Star,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { DashboardShell } from "@/components/layouts/dashboard-shell";
import type { SidebarItem } from "@/components/layouts/sidebar";

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Vendors", href: "/admin/vendors", icon: ShieldCheck },
  { label: "Listings", href: "/admin/listings", icon: Building2 },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Payments", href: "/admin/payments", icon: DollarSign },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Audit Log", href: "/admin/audit-log", icon: FileText },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <DashboardShell sidebarItems={sidebarItems} sidebarTitle="Admin Panel">
        {children}
      </DashboardShell>
    </>
  );
}
