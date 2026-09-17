"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const DEMO_ACCOUNTS = [
  { email: "priya@vivahvedam.demo", role: "Couple", label: "Priya & Arjun (Mumbai, Feb 2027)" },
  { email: "meera@vivahvedam.demo", role: "Couple", label: "Meera & Rohan (Jaipur, Nov 2027)" },
  { email: "goldenlens@vivahvedam.demo", role: "Vendor", label: "Golden Lens Studio (Photography)" },
  { email: "floraldesigns@vivahvedam.demo", role: "Vendor", label: "Floral Designs Co. (Decor)" },
  { email: "spiceroute@vivahvedam.demo", role: "Vendor", label: "Spice Route Catering" },
  { email: "rosewood@vivahvedam.demo", role: "Vendor", label: "Rosewood Venues" },
  { email: "glamour@vivahvedam.demo", role: "Vendor", label: "Glamour Makeup Studio" },
  { email: "admin@vivahvedam.demo", role: "Admin", label: "Platform Admin" },
];

const PASSWORD = "DemoPass123!";

export function DemoAccountsBanner() {
  const [open, setOpen] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  if (dismissed) return null;

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  }

  const roleColors: Record<string, string> = {
    Couple: "bg-terracotta-50 text-terracotta-700 border-terracotta-200",
    Vendor: "bg-sage-50 text-sage-700 border-sage-200",
    Admin: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-warm-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 bg-[#2c2825] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-xs font-semibold tracking-wider text-white/80 uppercase">Dev Mode · Demo Accounts</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOpen(!open)}
            className="rounded p-0.5 text-white/60 hover:text-white transition-colors"
          >
            {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="rounded p-0.5 text-white/60 hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-72 overflow-y-auto">
          <div className="p-3 space-y-1.5">
            {DEMO_ACCOUNTS.map((account) => (
              <div
                key={account.email}
                className="group flex items-center gap-2 rounded-xl border border-border/30 bg-muted/30 px-3 py-2 hover:bg-muted/60 transition-colors"
              >
                <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${roleColors[account.role]}`}>
                  {account.role}
                </span>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => copy(account.email)}
                    className="block truncate text-[11px] font-medium text-foreground hover:text-terracotta-600 transition-colors text-left w-full"
                    title="Click to copy email"
                  >
                    {copied === account.email ? "✓ Copied!" : account.email}
                  </button>
                  <span className="text-[10px] text-muted-foreground">{account.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border/40 px-3 py-2 flex items-center justify-between bg-muted/20">
            <span className="text-[10px] text-muted-foreground">All passwords:</span>
            <button
              onClick={() => copy(PASSWORD)}
              className="text-[11px] font-mono font-semibold text-foreground hover:text-terracotta-600 transition-colors"
              title="Click to copy"
            >
              {copied === PASSWORD ? "✓ Copied!" : PASSWORD}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
