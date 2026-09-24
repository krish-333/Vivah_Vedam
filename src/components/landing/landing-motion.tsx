"use client";

import { useEffect } from "react";

/** Reveals, line-masks, scramble, scroll progress, journey line, counters. */
export default function LandingMotion() {
  useEffect(() => {
    const root = document.getElementById("vv-top");
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* reveal + line-mask */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("vv-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    root.querySelectorAll("[data-reveal], .vv-lm").forEach((el) => io.observe(el));

    /* scramble-decode eyebrow */
    let scrambleRaf = 0;
    const sc = root.querySelector<HTMLElement>("[data-scramble]");
    if (sc && !reduced) {
      const finalText = sc.dataset.scrambleText ?? sc.textContent ?? "";
      const glyphs = "अकशफपवद✦·—";
      let frame = 0;
      const tick = () => {
        frame += 1;
        const shown = Math.floor(frame / 2.2);
        sc.textContent = finalText
          .split("")
          .map((ch, i) => (i < shown || ch === " " || ch === "·" ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]))
          .join("");
        if (shown <= finalText.length) scrambleRaf = requestAnimationFrame(tick);
        else sc.textContent = finalText;
      };
      tick();
    }

    /* scroll progress + journey fill line */
    const bar = root.querySelector<HTMLElement>(".vv-progress");
    const steps = root.querySelector<HTMLElement>(".vv-steps");
    const fill = root.querySelector<HTMLElement>(".vv-steps-fill");
    const onScroll = () => {
      const doc = document.documentElement;
      if (bar) bar.style.width = `${(window.scrollY / Math.max(1, doc.scrollHeight - doc.clientHeight)) * 100}%`;
      if (steps && fill) {
        const r = steps.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - r.top) / r.height));
        fill.style.height = `${p * 100}%`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* impact counters (en-IN formatting) */
    const fmt = new Intl.NumberFormat("en-IN");
    const cio = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          cio.unobserve(e.target);
          const el = e.target as HTMLElement;
          const end = Number(el.dataset.count ?? 0);
          const suffix = el.dataset.suffix ?? "";
          if (reduced) {
            el.textContent = fmt.format(end) + suffix;
            continue;
          }
          const t0 = performance.now();
          const step = (t: number) => {
            const p = Math.min(1, (t - t0) / 1800);
            el.textContent = fmt.format(Math.round(end * (1 - Math.pow(1 - p, 3)))) + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );
    root.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

    return () => {
      io.disconnect();
      cio.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrambleRaf);
    };
  }, []);

  return null;
}
