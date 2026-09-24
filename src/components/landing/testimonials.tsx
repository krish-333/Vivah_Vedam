"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* PREVIEW CONTENT: these are illustrative sample stories for design purposes.
   Replace with verified reviews (from the `reviews` table) before production launch. */
const SLIDES = [
  {
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    alt: "Sample couple portrait",
    quote: "Every vendor, every timeline, every panic — handled in one dashboard before it ever reached us.”",
    who: "Sample story · Palace wedding",
    meta: "Illustrative preview",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    alt: "Sample couple portrait",
    quote: "The budget tracker and escrow payments meant no surprises — we always knew what was paid and what was next.”",
    who: "Sample story · Beach wedding",
    meta: "Illustrative preview",
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    alt: "Sample couple portrait",
    quote: "Messaging every vendor from one place instead of forty WhatsApp threads saved our sanity.”",
    who: "Sample story · Courtyard wedding",
    meta: "Illustrative preview",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, [paused, reduced]);

  const go = (n: number) => setI((n + SLIDES.length) % SLIDES.length);

  return (
    <section className="vv-stories" id="stories">
      <div className="vv-wrap">
        <span className="vv-overline vv-overline-cream">Why couples choose us</span>
        <h2 className="vv-h2 vv-lm">
          <span className="vv-lm-l"><span>One platform for</span></span>
          <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}><span className="vv-gold-it">your entire wedding.</span></span>
        </h2>

        <div className="vv-tstage" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="vv-ttrack" style={{ transform: `translateX(-${i * 100}%)` }}>
            {SLIDES.map((s) => (
              <div className="vv-tslide" key={s.who}>
                <img
                  src={s.avatar}
                  alt={s.alt}
                  width={128}
                  height={128}
                  onError={(e) => {
                    const t = e.currentTarget;
                    if (t.dataset.fb) return;
                    t.dataset.fb = "1";
                    t.src = "https://picsum.photos/seed/vv-avatar/300/300";
                  }}
                />
                <div>
                  <blockquote>{s.quote}</blockquote>
                  <p className="vv-twho">
                    {s.who}
                    <small>{s.meta}</small>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="vv-tnav">
          <button type="button" aria-label="Previous story" onClick={() => go(i - 1)}><ChevronLeft size={18} /></button>
          <button type="button" aria-label="Next story" onClick={() => go(i + 1)}><ChevronRight size={18} /></button>
          <div className="vv-tdots">
            {SLIDES.map((_, k) => (
              <i
                key={k}
                className={k === i ? "vv-on" : ""}
                role="button"
                tabIndex={0}
                aria-label={`Story ${k + 1}`}
                onClick={() => go(k)}
                onKeyDown={(e) => e.key === "Enter" && go(k)}
              />
            ))}
          </div>
        </div>
        <p className="vv-fine" style={{ marginTop: 18, color: "rgba(250,246,241,.55)" }}>
          Sample stories shown for preview — verified couple reviews from completed bookings will appear here after launch.
        </p>
      </div>
    </section>
  );
}
