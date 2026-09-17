"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { authUser, profile, loading } = useUser();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.dispatchEvent(new Event("vv-auth-changed"));
    router.push("/");
    router.refresh();
  }

  const displayName = profile?.full_name ?? authUser?.email ?? "";
  const displayEmail = authUser?.email ?? "";
  const initials = displayName ? displayName.charAt(0).toUpperCase() : "?";

  const dashboardHref =
    profile?.role === "vendor"
      ? "/vendor"
      : profile?.role === "admin"
        ? "/admin"
        : "/dashboard";

  const settingsHref =
    profile?.role === "vendor"
      ? "/vendor/settings"
      : profile?.role === "admin"
        ? "/admin"
        : "/dashboard/settings";

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-[#faf6f1]/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5">
          <span
            className="font-logo text-2xl font-medium tracking-wide text-foreground"
            style={{ fontVariantCaps: "small-caps" }}
          >
            vivah
          </span>
          <span
            className="font-logo text-2xl font-medium tracking-wide text-terracotta-500"
            style={{ fontVariantCaps: "small-caps" }}
          >
            vedam
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/venues"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Venues
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Services
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
        </nav>

        {/* Right: Auth + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
          ) : authUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border/60 bg-card py-1.5 pr-3 pl-1.5 shadow-warm-sm transition-all hover:shadow-warm">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-terracotta-50 text-xs font-semibold text-terracotta-600">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium text-foreground sm:block">
                    {displayName.split(" ")[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border-border/40 shadow-warm-lg"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {displayEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={settingsHref}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-terracotta-500 px-5 text-white hover:bg-terracotta-600"
                asChild
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border/40 bg-[#faf6f1] px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {[
              { href: "/venues", label: "Venues" },
              { href: "/services", label: "Services" },
              { href: "/categories", label: "Categories" },
              { href: "/about", label: "About" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            {!authUser && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-1 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
