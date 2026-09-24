"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export function LeadForm() {
  const [done, setDone] = useState(false);
  const [names, setNames] = useState("");
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState<{ names?: boolean; phone?: boolean }>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const next = { names: !names.trim(), phone: !phone.trim() };
    setErr(next);
    if (next.names || next.phone) return;
    // TODO: POST /api/leads once the endpoint exists (bookings/journey libs already in repo)
    setDone(true);
  }

  if (done) {
    return (
      <div className="vv-done vv-show" role="status">
        <div className="vv-done-ring"><Sparkles size={28} /></div>
        <h3>Shukriya — it&apos;s with us now.</h3>
        <p>Expect a call or WhatsApp within 24 hours. In the meantime, start saving your Pinterest boards.</p>
      </div>
    );
  }

  return (
    <form className="vv-form" data-reveal style={{ "--d": ".2s" } as React.CSSProperties} onSubmit={submit} noValidate>
      <div className="vv-frow">
        <div className="vv-field">
          <label htmlFor="vv-names">Your names</label>
          <input id="vv-names" className={err.names ? "vv-err" : ""} value={names} onChange={(e) => setNames(e.target.value)} placeholder="Diya & Arjun" />
        </div>
        <div className="vv-field">
          <label htmlFor="vv-phone">Phone / WhatsApp</label>
          <input id="vv-phone" type="tel" className={err.phone ? "vv-err" : ""} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91" />
        </div>
      </div>
      <div className="vv-frow">
        <div className="vv-field">
          <label htmlFor="vv-city">City / venue idea</label>
          <input id="vv-city" placeholder="Udaipur, Goa, still dreaming…" />
        </div>
        <div className="vv-field">
          <label htmlFor="vv-date">Tentative date</label>
          <input id="vv-date" placeholder="Nov 2026, flexible…" />
        </div>
      </div>
      <div className="vv-frow">
        <div className="vv-field">
          <label htmlFor="vv-guests">Guest count</label>
          <input id="vv-guests" placeholder="≈ 250" />
        </div>
        <div className="vv-field">
          <label htmlFor="vv-budget">Budget range</label>
          <select id="vv-budget" defaultValue="₹25–50 lakh">
            <option>₹10–25 lakh</option>
            <option>₹25–50 lakh</option>
            <option>₹50 lakh – 1 crore</option>
            <option>₹1 crore +</option>
            <option>Help me decide (EMI)</option>
          </select>
        </div>
      </div>
      <div className="vv-field">
        <label htmlFor="vv-msg">Anything we should know?</label>
        <textarea id="vv-msg" placeholder="The dream, the compulsions, the songs…" />
      </div>
      <button className="vv-btn vv-btn-gold" type="submit">
        Send it across <ArrowRight size={15} />
      </button>
    </form>
  );
}
