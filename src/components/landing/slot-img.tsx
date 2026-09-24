"use client";

import React from "react";

interface SlotImgProps {
  slot: string;
  src: string;
  alt: string;
  w: number;
  h: number;
  kb?: boolean;
  priority?: boolean;
}

/**
 * Image component with guaranteed-no-broken-icon fallback.
 * If any URL fails to load, it silently swaps to a same-slot placeholder.
 */
export function SlotImg({ slot, src, alt, w, h, kb = false, priority = false }: SlotImgProps) {
  return (
    <div className={`vv-ph${kb ? " vv-kb" : ""}`}>
      <img
        data-slot={slot}
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading={priority ? "eager" : "lazy"}
        onError={(e) => {
          const t = e.currentTarget;
          if (t.dataset.fb) return;
          t.dataset.fb = "1";
          t.src = `https://picsum.photos/seed/vv-${slot}/800/1000`;
        }}
      />
    </div>
  );
}
