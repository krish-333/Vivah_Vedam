"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Search, CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function HeroSearchBar() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [budget, setBudget] = useState("");
  const [open, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    if (budget) params.set("budget", budget);
    router.push(`/venues?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="shadow-warm-lg flex items-center rounded-full border border-border/60 bg-card p-1.5">
        <div className="flex flex-1 items-center">
          {/* Location */}
          <div className="flex flex-1 flex-col border-r border-border/50 px-5 py-2.5">
            <span className="text-left text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
              Location
            </span>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Which city?"
              className="mt-0.5 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
            />
          </div>

          {/* Date picker */}
          <div className="flex flex-1 flex-col border-r border-border/50 px-5 py-2.5">
            <span className="text-left text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
              Date
            </span>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "mt-0.5 flex w-full items-center gap-1.5 bg-transparent text-left text-sm outline-none",
                    date ? "text-foreground" : "text-muted-foreground/50"
                  )}
                >
                  <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                  {date ? format(date, "d MMM yyyy") : "When?"}
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                sideOffset={12}
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setOpen(false);
                  }}
                  disabled={{ before: new Date() }}
                  captionLayout="dropdown"
                  fromYear={new Date().getFullYear()}
                  toYear={new Date().getFullYear() + 3}
                  classNames={{
                    day: "group/day relative aspect-square h-full w-full select-none p-0 text-center",
                  }}
                />
                {date && (
                  <div className="border-t border-border/50 px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setDate(undefined);
                        setOpen(false);
                      }}
                      className="text-xs text-muted-foreground hover:text-terracotta-500 transition-colors"
                    >
                      Clear date
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Budget */}
          <div className="flex flex-1 flex-col px-5 py-2.5">
            <span className="text-left text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
              Budget
            </span>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="How much?"
              className="mt-0.5 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracotta-500 text-white shadow-warm transition-all hover:bg-terracotta-600 hover:shadow-warm-lg active:scale-95"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
