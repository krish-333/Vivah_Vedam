"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    seed: "vivah-couple-meera",
    alt: "Meera and Rohan",
    quote: "We genuinely attended our own wedding as guests. Every vendor, every timeline, every panic — it all dissolved before it ever reached us.”",
    who: "Meera & Rohan",
    meta: "Palace wedding, Udaipur · 280 guests",
  },
  {
    seed: "vivah-couple-ananya",
    alt: "Ananya and Kabir",
    quote: "The EMI plan is what made our date possible. We didn't postpone the dream — we just spread it out, with everything in writing.”",
    who: "Ananya & Kabir",
    meta: "Beach wedding, Goa · 140 guests",
  },
  {
    seed: "vivah-couple-sana",
    alt: "Sana and Dev",
    quote: "Our nani cried when she heard the leftover food fed 900 people that night. That's the wedding we wanted — beautiful, and good.”",
    who: "Sana & Dev",
    meta: "Courtyard wedding, Jaipur · 350 guests",
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
        <span className="vv-overline vv-overline-cream">Couples say</span>
        <h2 className="vv-h2 vv-lm">
          <span className="vv-lm-l"><span>We showed up.</span></span>
          <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}><span className="vv-gold-it">They did everything.</span></span>
        </h2>

        <div className="vv-tstage" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="vv-ttrack" style={{ transform: `translateX(-${i * 100}%)` }}>
            {SLIDES.map((s) => (
              <div className="vv-tslide" key={s.who}>
                {/* IMG: testimonial avatar (≈300×300) */}
                <img data-slot={`testimonial-${s.who.split(" ")[0].toLowerCase()}`} src={`https://picsum.photos/seed/${s.seed}/300/300`} alt={s.alt} />
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
              <i key={k} className={k === i ? "vv-on" : ""} onClick={() => go(k)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && go(k)} aria-label={`Story ${k + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
