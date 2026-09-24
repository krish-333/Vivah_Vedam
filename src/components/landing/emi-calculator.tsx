"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

const TENURES = [6, 12, 24, 36];
const MIN = 500_000;
const MAX = 10_000_000;
const RATE = 12;

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function EmiCalculator() {
  const [budget, setBudget] = useState(2_500_000);
  const [months, setMonths] = useState(24);
  const [pulse, setPulse] = useState(false);

  const { emi, total } = useMemo(() => {
    const r = RATE / 1200;

    const e =
      r === 0
        ? budget / months
        : (budget * r * Math.pow(1 + r, months)) /
          (Math.pow(1 + r, months) - 1);

    return {
      emi: e,
      total: e * months,
    };
  }, [budget, months]);

  const pct = ((budget - MIN) / (MAX - MIN)) * 100;

  const bump = () => {
    setPulse(false);

    requestAnimationFrame(() => {
      setPulse(true);
    });
  };

  return (
    <div
      className="vv-calc"
      data-reveal
      style={{ "--d": ".2s" } as CSSProperties}
    >
      <h3>Plan your budget</h3>

      <p className="vv-calc-sub">EMI estimator · instant</p>

      <label htmlFor="vv-budget">Wedding budget</label>

      <p className="vv-budget-out">{inr.format(budget)}</p>

      <input
        id="vv-budget"
        className="vv-range"
        type="range"
        min={MIN}
        max={MAX}
        step={100_000}
        value={budget}
        style={
          {
            "--vv-p": `${pct}%`,
          } as CSSProperties
        }
        onChange={(e) => {
          setBudget(Number(e.target.value));
          bump();
        }}
        aria-label="Wedding budget"
      />

      <label>Tenure</label>

      <div
        className="vv-tenures"
        role="group"
        aria-label="EMI tenure"
      >
        {TENURES.map((m) => (
          <button
            key={m}
            type="button"
            className={m === months ? "vv-on" : ""}
            onClick={() => {
              setMonths(m);
              bump();
            }}
          >
            {m} mo
          </button>
        ))}
      </div>

      <div className="vv-emi-out">
        <div>
          <p className="vv-emi-per">Estimated EMI</p>

          <p className={`vv-emi-val${pulse ? " vv-pulse" : ""}`}>
            {inr.format(emi)}
          </p>

          <p
            className="vv-emi-per"
            style={{ marginTop: 6 }}
          >
            per month · {inr.format(total)} total
          </p>
        </div>

        <p className="vv-emi-tiny">
          Indicative at {RATE}% p.a. Final terms depend on eligibility
          and the financing partner.
        </p>
      </div>

      <a
        className="vv-btn vv-btn-gold"
        href="#begin"
      >
        Talk to us about EMI <ArrowRight size={15} />
      </a>

      <p className="vv-fine">
        Indicative estimate only, at a sample rate of {RATE}% p.a. Vivah Vedam does not lend money or
        approve loans — this tool is for budget planning. Any financing is provided separately by
        regulated partner institutions, subject to their eligibility checks.
      </p>
    </div>
  );
}
