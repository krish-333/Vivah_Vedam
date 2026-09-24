"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";

const ITEMS = [
  ["How does the EMI option actually work?", "You book with a small advance, and the balance is split into monthly installments through our partner banks and NBFCs. Eligible couples get 0% interest plans; everyone else gets transparent, low-rate tenures of 3–36 months. We handle the paperwork with you, and nothing is charged until it's approved in writing."],
  ["How does food rescue work on the wedding day?", "Our ground team identifies untouched surplus at every service, packs it hygienically within the hour, and our NGO partners collect and distribute it the same night. Florals are weighed, collected and sent to composting or incense upcycling. You receive a seva report after the wedding with exact numbers."],
  ["How early should we come to you?", "Ideally 8–12 months before your dates, especially for palace and destination venues. But we've pulled off beautiful weddings in nine weeks — the first conversation costs nothing, so come whenever you're ready."],
  ["Do you plan destination weddings?", "Constantly. Udaipur, Jaipur, Jodhpur, Goa, Rishikesh and beyond — including guest travel blocks, room allocations, local permits and a hospitality desk that travels with your guest list."],
  ["Can we bring our own vendors?", "Absolutely. We integrate your photographer, makeup artist or family caterer into our rundown and contracts so everything still runs through one desk — yours becomes ours to manage."],
  ["What does planning cost?", "Our fee is a clear percentage or flat amount agreed before anything begins — and because we negotiate vendor rates daily, most couples find the fee pays for itself. Your budget sheet is open to you from day one."],
] as const;

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    setOpen((cur) => (cur === i ? null : i));
  };

  return (
    <ul className="vv-faq-list" id="faq-list">
      {ITEMS.map(([q, a], i) => (
        <li className={`vv-faq-item${open === i ? " vv-open" : ""}`} key={q}>
          <button type="button" className="vv-faq-q" aria-expanded={open === i} onClick={() => toggle(i)}>
            {q}
            <span className="vv-faq-ic"><Plus size={16} /></span>
          </button>
          <div
            className="vv-faq-a"
            ref={(el) => { refs.current[i] = el; }}
            style={{ maxHeight: open === i ? `${refs.current[i]?.scrollHeight ?? 400}px` : 0 }}
          >
            <p>{a}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
