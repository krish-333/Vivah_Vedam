import type { Metadata } from "next";
import { Great_Vibes } from "next/font/google";
import {
  ArrowRight, ArrowUpRight, Phone, Mail, MapPin, Sparkles,
  Leaf, Recycle, HeartHandshake, Wallet, CalendarRange, ShieldCheck,
} from "lucide-react";
import "./landing.css";
import { VivahMark } from "@/components/landing/vivah-mark";
import LandingMotion from "@/components/landing/landing-motion";
import { EmiCalculator } from "@/components/landing/emi-calculator";
import { Testimonials } from "@/components/landing/testimonials";
import { Faq } from "@/components/landing/faq";
import { LeadForm } from "@/components/landing/lead-form";

const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--vv-script" });

export const metadata: Metadata = {
  title: "Vivah Vedam — Wedding Planning Marketplace in India | Venues, Vendors & Budget Tools",
  description:
    "Vivah Vedam is a two-sided wedding planning marketplace in India. Discover verified venues and vendors, track your budget, follow a personalised planning journey, and pay securely with escrow protection. Includes an indicative EMI budget estimator.",
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
  alternates: { canonical: "https://vivahvedam.com/" },
  openGraph: {
    type: "website",
    siteName: "Vivah Vedam",
    title: "Vivah Vedam — Your Wedding, Beautifully Planned",
    description:
      "Discover venues, hire verified wedding professionals, and manage every detail of your special day — all in one place.",
    url: "https://vivahvedam.com/",
    images: [{ url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&fit=crop&q=80", width: 1200, height: 630 }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivah Vedam — Wedding Planning Marketplace",
    description: "Discover venues, hire verified vendors, and manage your entire wedding journey in one place.",
    images: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&fit=crop&q=80"],
  },
};

/* No fabricated ratings/review counts — only factual business info. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Vivah Vedam",
  url: "https://vivahvedam.com/",
  description: "Two-sided wedding planning marketplace for couples and vendors in India.",
  publisher: {
    "@type": "Organization",
    name: "Vivah Vedam",
    email: "hello@vivahvedam.com",
    telephone: "+91-22-4000-5000",
    address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressCountry: "IN" },
  },
};

/* ── IMAGE MAP ─────────────────────────────────────────────────
   High-confidence Unsplash CDN URLs (Unsplash licence: free for
   commercial use, no attribution required). If any URL ever fails,
   <SlotImg> auto-falls back to a placeholder so nothing breaks.
   Swap any URL here — one place, whole page updates.            */
const IMG = {
  heroCouple:   "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&h=1120&fit=crop&q=80",
  heroNight:    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&h=900&fit=crop&q=80",
  heroFestive:  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&h=520&fit=crop&q=80",
  consult:      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&q=80",
  planTable:    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop&q=80",
  venueHall:    "https://images.unsplash.com/photo-1519167758481-83f550bb8aff?w=400&h=400&fit=crop&q=80",
  eventSetup:   "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop&q=80",
  coupleDance:  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=400&fit=crop&q=80",
  sevaFood:     "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700&h=880&fit=crop&q=80",
  sevaFloral:   "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=700&h=620&fit=crop&q=80",
  cardBaraat:   "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=620&h=780&fit=crop&q=80",
  cardHands:    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=620&h=780&fit=crop&q=80",
  cardCouple:   "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=620&h=780&fit=crop&q=80",
  cardReception:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=620&h=780&fit=crop&q=80",
  cardDance:    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=620&h=780&fit=crop&q=80",
  cardTable:    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=620&h=780&fit=crop&q=80",
  featCeremony: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1100&h=760&fit=crop&q=80",
  featFlorals:  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=900&h=1100&fit=crop&q=80",
  featNight:    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&h=700&fit=crop&q=80",
};

/* Image with guaranteed-no-broken-icon fallback */
function SlotImg({ slot, src, alt, w, h, kb = false, priority = false }: {
  slot: string; src: string; alt: string; w: number; h: number; kb?: boolean; priority?: boolean;
}) {
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

export default function LandingPage() {
  return (
    <div id="vv-top" className={`vv ${vibes.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingMotion />
      <div className="vv-progress" aria-hidden="true" />

      <div className="vv-topbar">
        Now onboarding couples and vendors for the 2026–27 wedding season
      </div>

      {/* ══════════ HERO ══════════ */}
      <section className="vv-hero">
        <div className="vv-wrap vv-hero-grid">
          <div>
            <p className="vv-eyebrow" data-scramble data-scramble-text="DISCOVER · BOOK · PLAN · CELEBRATE">
              DISCOVER · BOOK · PLAN · CELEBRATE
            </p>
            <h1 className="vv-h1 vv-lm">
              <span className="vv-lm-l"><span>Seven vows.</span></span>
              <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}>
                <span className="vv-it vv-script-over">
                  zero chaos.
                  <span className="vv-script">vivah vedam</span>
                </span>
              </span>
            </h1>
            <p className="vv-lead" data-reveal style={{ "--d": ".25s" } as React.CSSProperties}>
              One marketplace for your entire wedding — discover verified venues and vendors,
              track every rupee of your budget, follow a personalised planning journey, and
              message your vendors from a single dashboard.
            </p>
            <div className="vv-ctas" data-reveal style={{ "--d": ".35s" } as React.CSSProperties}>
              <a className="vv-btn" href="/signup">Start planning <ArrowRight size={15} /></a>
              <a className="vv-btn vv-btn-ghost" href="/venues">Browse venues <ArrowRight size={15} /></a>
            </div>
            {/* Factual, non-numeric claims that match the real platform */}
            <div className="vv-hero-meta" data-reveal style={{ "--d": ".45s" } as React.CSSProperties}>
              <div><b>Two-sided</b><span>marketplace</span></div>
              <div><b>Verified</b><span>vendor network</span></div>
              <div><b>Escrow</b><span>protected payments</span></div>
              <div><b>Journey</b><span>tracked planning</span></div>
            </div>
          </div>

          <div className="vv-collage" aria-hidden="true">
            <div className="vv-sun" />
            <figure className="vv-pcard vv-pc-a">
              <SlotImg priority kb slot="hero-a" src={IMG.heroCouple} w={900} h={1120} alt="Wedding couple celebrating together" />
              <figcaption className="vv-script">the first look</figcaption>
            </figure>
            <figure className="vv-pcard vv-pc-b">
              <SlotImg slot="hero-b" src={IMG.heroNight} w={700} h={900} alt="Couple celebrating under night lights" />
              <figcaption className="vv-script">sangeet till late</figcaption>
            </figure>
            <figure className="vv-pcard vv-pc-c">
              <SlotImg slot="hero-c" src={IMG.heroFestive} w={800} h={520} alt="Bride celebrating with her friends" />
              <figcaption className="vv-script">haldi mornings</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ══════════ MARQUEE ══════════ */}
      <div className="vv-marquee" aria-hidden="true">
        <div className="vv-mq-track">
          {Array.from({ length: 2 }).map((_, dup) => (
            <span key={dup} className="vv-mq-set">
              {["Venues", "Photography", "Décor", "Catering", "Mehndi", "Makeup", "Music", "Travel & Stay"].map((w) => (
                <span key={w} className="vv-mq-item">{w}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════ THE JOURNEY ══════════ */}
      <section className="vv-journey" id="journey">
        <div className="vv-wrap vv-jgrid">
          <div className="vv-jsticky">
            <span className="vv-overline">The Journey</span>
            <h2 className="vv-h2 vv-lm">
              <span className="vv-lm-l"><span>From “yes”</span></span>
              <span className="vv-lm-l" style={{ "--d": ".1s" } as React.CSSProperties}><span>to happily ever</span></span>
              <span className="vv-lm-l" style={{ "--d": ".2s" } as React.CSSProperties}><span className="vv-it">after — without</span></span>
              <span className="vv-lm-l" style={{ "--d": ".3s" } as React.CSSProperties}><span className="vv-it">the chaos.</span></span>
            </h2>
            <span className="vv-script vv-script-md">five steps, that&apos;s all</span>
            <p className="vv-jnote" data-reveal style={{ "--d": ".35s" } as React.CSSProperties}>
              One platform, one dashboard, one promise: every vendor, booking and rupee in a
              single place so nothing slips through the cracks.
            </p>
          </div>

          <ol className="vv-steps">
            <span className="vv-steps-fill" aria-hidden="true" />
            {[
              { n: "01", tag: "Discover", title: <>You come to us</>, body: "Create your couple account and tell us your date, city, guest count and budget. Your wedding dashboard is ready in minutes.", chips: ["Free to join", "Couple dashboard", "Budget tracker"], slot: "journey-1", src: IMG.consult, alt: "Couple planning together over a laptop" },
              { n: "02", tag: "Shortlist", title: <>We curate your options</>, body: "Browse verified venues and services by city, capacity and price. Compare portfolios side by side and shortlist the ones that feel like yours.", chips: ["Verified listings", "City & budget filters", "Portfolios"], slot: "journey-2", src: IMG.planTable, alt: "Wedding table being planned and styled" },
              { n: "03", tag: "Connect", title: <>Every booking, in one place</>, body: "Message vendors directly, send booking requests, and confirm dates — conversations and contracts live in your dashboard, not in 40 WhatsApp threads.", chips: ["In-app messaging", "Booking requests", "One timeline"], slot: "journey-3", src: IMG.venueHall, alt: "Wedding venue hall prepared for an event" },
              { n: "04", tag: "Pay safely", title: <>Secure, escrow-protected payments</>, body: "Pay your deposit through the platform. Funds are held securely and released to the vendor only as milestones are completed — protection for both sides.", chips: ["Stripe escrow", "Milestone payouts", "Transparent fees"], slot: "journey-4", src: IMG.eventSetup, alt: "Catering and event setup in progress" },
              { n: "05", tag: "The promise", title: <>You have <em>no hassle.</em></>, free: true, body: "Your journey timeline tracks every task from booking to baraat. You dance, you celebrate, you eat at your own wedding — the paperwork is already done.", chips: ["Journey timeline", "Verified reviews", "You just show up"], slot: "journey-5", src: IMG.coupleDance, alt: "Couple dancing at their wedding" },
            ].map((s, i) => (
              <li key={s.n} className={`vv-step${s.free ? " vv-step-free" : ""}`} data-reveal style={{ "--d": `${i * 0.06}s` } as React.CSSProperties}>
                <div className="vv-step-no">{s.n}<small>{s.tag}</small></div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <div className="vv-step-tags">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
                </div>
                <figure className="vv-step-img">
                  <SlotImg slot={s.slot} src={s.src} w={400} h={400} alt={s.alt} />
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══════════ BUDGET / EMI ESTIMATOR ══════════ */}
      <section className="vv-finance" id="finance">
        <div className="vv-wrap vv-fgrid">
          <div>
            <span className="vv-overline vv-overline-cream">Budget tools</span>
            <h2 className="vv-h2 vv-lm">
              <span className="vv-lm-l"><span>Plan the spend</span></span>
              <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}><span><em className="vv-gold-it">before</em> the splurge.</span></span>
            </h2>
            <p className="vv-lead vv-lead-cream" data-reveal style={{ "--d": ".2s" } as React.CSSProperties}>
              Our indicative EMI estimator helps you see what a monthly budget slice could look
              like, so you can plan confidently. Financing itself, where available, is offered by
              regulated partner institutions and is always subject to eligibility.
            </p>
            <ul className="vv-points" data-reveal style={{ "--d": ".3s" } as React.CSSProperties}>
              <li><span className="vv-dot"><Wallet size={15} /></span>Indicative monthly-slice estimator — no loan application, no credit check here</li>
              <li><span className="vv-dot"><CalendarRange size={15} /></span>Model tenures from 6 to 36 months while you plan your date</li>
              <li><span className="vv-dot"><ShieldCheck size={15} /></span>On-platform payments are escrow-protected via Stripe Connect</li>
              <li><span className="vv-dot"><Sparkles size={15} /></span>Track actual spend vs. budget live in your couple dashboard</li>
            </ul>
          </div>
          <EmiCalculator />
        </div>
      </section>

      {/* ══════════ SEVA / SUSTAINABILITY ══════════ */}
      <section className="vv-seva" id="seva">
        <div className="vv-wrap">
          <span className="vv-overline vv-overline-sage">Seva · Our promise to the planet</span>
          <div className="vv-sgrid">
            <div>
              <h2 className="vv-h2 vv-lm">
                <span className="vv-lm-l"><span>Shaadi without</span></span>
                <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}><span>the <em className="vv-sage-it">waste.</em></span></span>
              </h2>
              <p className="vv-lead" data-reveal style={{ "--d": ".2s" } as React.CSSProperties}>
                We are building Vivah Vedam as a sustainable company. Through our NGO contacts,
                surplus food from functions is packed, collected and served to people in need the
                same night — and floral waste is rescued, composted or upcycled instead of reaching
                landfill. Ask us for the seva add-on when you plan with us.
              </p>
              <p className="vv-lead" data-reveal style={{ "--d": ".28s" } as React.CSSProperties}>
                It costs you nothing extra. It means everything.
              </p>
            </div>
            <div className="vv-seva-imgs" data-reveal style={{ "--d": ".2s" } as React.CSSProperties}>
              <figure>
                <SlotImg slot="seva-food" src={IMG.sevaFood} w={700} h={880} alt="Freshly prepared meals ready for distribution" />
                <figcaption>Food rescued · same night</figcaption>
              </figure>
              <figure>
                <SlotImg slot="seva-floral" src={IMG.sevaFloral} w={700} h={620} alt="Fresh flowers ready for upcycling" />
                <figcaption>Florals → compost &amp; incense</figcaption>
              </figure>
            </div>
          </div>

          <ul className="vv-flow" data-reveal>
            <li><span className="vv-flow-n"><UtensilsIcon /></span><b>Weigh &amp; pack the surplus</b><p>Untouched food is boxed hygienically within an hour of each function ending.</p></li>
            <li><span className="vv-flow-n"><HeartHandshake size={16} /></span><b>Same-night distribution</b><p>Partner NGOs deliver it warm to shelters and night-homes across the city before sunrise.</p></li>
            <li><span className="vv-flow-n"><Recycle size={16} /></span><b>Florals get a second life</b><p>Marigold and rose waste is composted or rolled into incense — nothing goes to landfill.</p></li>
          </ul>
        </div>
      </section>

      {/* ══════════ GALLERY — SCATTERED POSTCARDS ══════════ */}
      <section className="vv-work" id="work">
        <div className="vv-wrap">
          <div className="vv-work-head">
            <div>
              <span className="vv-overline">The celebrations</span>
              <h2 className="vv-h2 vv-lm" style={{ marginBottom: 0 }}>
                <span className="vv-lm-l"><span>Moments the platform</span></span>
                <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}><span className="vv-it">was built for.</span></span>
              </h2>
            </div>
            <span className="vv-script vv-script-md vv-gold-script" data-reveal>postcards from the pheras</span>
          </div>
          <div className="vv-cards">
            {[
              { c: "vv-c1", slot: "postcard-1", src: IMG.cardBaraat, alt: "Groom and wedding party celebrating outdoors", cap: "the baraat", city: "Jaipur", d: "0s" },
              { c: "vv-c2", slot: "postcard-2", src: IMG.cardHands, alt: "Couple's hands with wedding rings and flowers", cap: "the rings", city: "Delhi", d: ".08s" },
              { c: "vv-c3", slot: "postcard-3", src: IMG.cardCouple, alt: "Couple in wedding attire together", cap: "pheras at dusk", city: "Udaipur", d: ".16s" },
              { c: "vv-c4", slot: "postcard-4", src: IMG.cardReception, alt: "Reception table styled with florals", cap: "reception glow", city: "Goa", d: ".24s" },
              { c: "vv-c5", slot: "postcard-5", src: IMG.cardDance, alt: "Couple dancing at their celebration", cap: "sangeet till 3am", city: "Jodhpur", d: "0s" },
              { c: "vv-c6", slot: "postcard-6", src: IMG.cardTable, alt: "Banquet table set for the wedding feast", cap: "the long table", city: "Pushkar", d: ".12s" },
            ].map((p) => (
              <figure key={p.slot} className={p.c} data-reveal style={{ "--d": p.d } as React.CSSProperties}>
                <SlotImg slot={p.slot} src={p.src} w={620} h={780} alt={p.alt} />
                <figcaption><span className="vv-script">{p.cap}</span><small>{p.city}</small></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ EXAMPLE PLAN ══════════ */}
      <section className="vv-featured">
        <div className="vv-wrap vv-feat-grid">
          <div className="vv-feat-sticky">
            <span className="vv-overline">Example plan</span>
            <span className="vv-script vv-script-md">Diya &amp; Arjun</span>
            <h2 className="vv-h2 vv-lm">
              <span className="vv-lm-l"><span>How a 3-day palace</span></span>
              <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}><span className="vv-it">wedding runs here.</span></span>
            </h2>
            <ul className="vv-spec" data-reveal style={{ "--d": ".2s" } as React.CSSProperties}>
              <li><span>Venue</span><span>Heritage palace, Udaipur</span></li>
              <li><span>Guests</span><span>320, flown &amp; hosted</span></li>
              <li><span>Functions</span><span>Haldi · Mehndi · Sangeet · Pheras</span></li>
              <li><span>Vendors</span><span>14 teams, one dashboard</span></li>
              <li><span>Seva add-on</span><span>Food &amp; floral rescue</span></li>
              <li><span>Payments</span><span>Escrow, milestone-based</span></li>
              <li><span>Budget</span><span>Tracked live, to the rupee</span></li>
            </ul>
            <p className="vv-fine" data-reveal style={{ "--d": ".3s", marginTop: "18px" } as React.CSSProperties}>
              Illustrative example of how planning runs on Vivah Vedam — sample figures, not a past event.
            </p>
          </div>
          <div className="vv-feat-imgs">
            <figure data-reveal>
              <SlotImg kb slot="featured-1" src={IMG.featCeremony} w={1100} h={760} alt="Wedding ceremony with the couple and guests" />
              <figcaption>The pheras, framed by the lake</figcaption>
            </figure>
            <figure data-reveal style={{ "--d": ".1s" } as React.CSSProperties}>
              <SlotImg slot="featured-2" src={IMG.featFlorals} w={900} h={1100} alt="Bridal bouquet and floral décor" />
              <figcaption>A mandap of forty thousand marigolds</figcaption>
            </figure>
            <figure data-reveal style={{ "--d": ".15s" } as React.CSSProperties}>
              <SlotImg slot="featured-3" src={IMG.featNight} w={1000} h={700} alt="Evening celebration under sparklers" />
              <figcaption>Sangeet under a borrowed sky</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section className="vv-services" id="services">
        <div className="vv-wrap">
          <span className="vv-overline">Everything under one roof</span>
          <h2 className="vv-h2 vv-lm">
            <span className="vv-lm-l"><span>One dashboard for</span></span>
            <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}><span className="vv-it">every detail.</span></span>
          </h2>
          <div className="vv-svc-grid">
            {[
              ["01", "Venues & Mandaps", "Palaces, lawns, beaches, rooftops — filter by city & capacity."],
              ["02", "Décor & Florals", "Verified décor vendors with real portfolios and pricing."],
              ["03", "Catering & Bar", "Menus, tastings and per-plate pricing, compared side by side."],
              ["04", "Photography & Film", "Editorial stills and films — portfolios you can browse first."],
              ["05", "Mehndi & Makeup", "Artists with trials, reviews and transparent rates."],
              ["06", "Music & Entertainment", "DJs, dhol and sangeet choreography, booked in-app."],
              ["07", "Guest Travel & Stay", "Vendors for room blocks, pickups and hospitality desks."],
              ["08", "Invites & Favors", "Paper goods and gifts from listed specialists."],
            ].map(([n, t, d], i) => (
              <a key={n} href="/services" className="vv-svc" data-reveal style={{ "--d": `${(i % 4) * 0.05}s` } as React.CSSProperties}>
                <span className="vv-svc-n">{n}</span>
                <div><b>{t}</b><p>{d}</p></div>
                <ArrowUpRight size={18} className="vv-svc-go" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <Testimonials />

      {/* ══════════ FAQ ══════════ */}
      <section className="vv-faq" id="faq">
        <div className="vv-wrap vv-faq-grid">
          <div>
            <span className="vv-overline">Good to know</span>
            <h2 className="vv-h2 vv-lm">
              <span className="vv-lm-l"><span>Questions couples</span></span>
              <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}><span className="vv-it">ask us first.</span></span>
            </h2>
            <span className="vv-script vv-script-md vv-gold-script">no question is too small</span>
          </div>
          <Faq />
        </div>
      </section>

      {/* ══════════ BEGIN ══════════ */}
      <section className="vv-begin" id="begin">
        <span className="vv-big-script" aria-hidden="true">vivah vedam</span>
        <div className="vv-wrap vv-bgrid">
          <div>
            <VivahMark size={64} />
            <span className="vv-overline vv-overline-cream" style={{ marginTop: 18 }}>Begin your story</span>
            <h2 className="vv-h2 vv-lm">
              <span className="vv-lm-l"><span>Tell us the date.</span></span>
              <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}><span className="vv-gold-it">We&apos;ll take it from there.</span></span>
            </h2>
            <p className="vv-lead vv-lead-cream" data-reveal style={{ "--d": ".2s" } as React.CSSProperties}>
              Send an enquiry and our team will call you back — or create your free couple
              account and start browsing verified venues and vendors right now.
            </p>
            <ul className="vv-bcontact" data-reveal style={{ "--d": ".3s" } as React.CSSProperties}>
              <li><span className="vv-ic"><Phone size={15} /></span><a href="tel:+912240005000">+91 22 4000 5000</a></li>
              <li><span className="vv-ic"><Mail size={15} /></span><a href="mailto:hello@vivahvedam.com">hello@vivahvedam.com</a></li>
              <li><span className="vv-ic"><MapPin size={15} /></span>WeWork BKC, Bandra Kurla Complex, Mumbai 400051</li>
              <li><span className="vv-ic"><Leaf size={15} /></span><a href="mailto:vendors@vivahvedam.com">vendors@vivahvedam.com</a> · list your business</li>
            </ul>
          </div>
          <LeadForm />
        </div>
      </section>
    </div>
  );
}

function UtensilsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M7 3v7a2 2 0 0 1-2 2v9M5 3v6M9 3v6M17 3c-1.5 2-2 4.5-2 7 0 2 .8 3 2 3v8" />
    </svg>
  );
}
