import type { Metadata } from "next";
import { Great_Vibes } from "next/font/google";
import {
  ArrowRight, ArrowUpRight, Phone, Mail, MapPin, Sparkles,
  Leaf, Recycle, HeartHandshake, Wallet, CalendarRange, ShieldCheck,
} from "lucide-react";
import "./landing.css";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { VivahMark } from "@/components/landing/vivah-mark";
import LandingMotion from "@/components/landing/landing-motion";
import { EmiCalculator } from "@/components/landing/emi-calculator";
import { Testimonials } from "@/components/landing/testimonials";
import { Faq } from "@/components/landing/faq";
import { LeadForm } from "@/components/landing/lead-form";
import { SlotImg } from "@/components/landing/slot-img";

const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--vv-script" });

export const metadata: Metadata = {
  title: "Vivah Vedam — Wedding Planners in India | End-to-End Planning, EMI Options & Zero-Waste Weddings",
  description:
    "Vivah Vedam is a full-service wedding atelier and planning marketplace in India. We curate your plan, make every booking, and execute every function — you have zero hassle. Weddings financed with easy EMI options, and surplus food & florals rescued through our NGO partners. Destination weddings across Udaipur, Jaipur, Goa and beyond.",
  keywords: [
    "vivah vedam", "wedding planners in India", "luxury wedding planner", "destination wedding planner India",
    "wedding planning company", "wedding planners near me", "best wedding planners", "affordable wedding planning",
    "wedding packages India", "wedding budget planner", "wedding EMI", "wedding loan", "wedding finance India",
    "EMI wedding planner", "pay wedding in installments", "zero percent EMI wedding", "sustainable wedding planner",
    "zero waste wedding", "eco friendly wedding India", "green wedding planner", "wedding food donation",
    "NGO food rescue wedding", "floral waste recycling wedding", "flower recycling wedding", "mandap decoration",
    "haldi mehndi sangeet planner", "baraat planning", "wedding decor India", "wedding vendor management",
    "wedding coordination", "day of wedding coordination", "Udaipur wedding planner", "Jaipur wedding planner",
    "Goa wedding planner", "Jodhpur wedding planner", "Rishikesh wedding planner", "palace wedding India",
    "beach wedding Goa", "royal wedding Rajasthan", "destination wedding Udaipur", "intimate wedding planner",
    "micro wedding India", "wedding timeline management", "wedding guest logistics", "wedding invitations and favors",
    "mehndi artist booking", "wedding makeup artist booking", "wedding photography and film", "sangeet choreography",
    "wedding catering management", "wedding budget management", "luxury Indian wedding", "big fat indian wedding planner",
    "NRI wedding planner India", "sikh wedding planner", "christian wedding planner india", "muslim wedding planner india",
    "interfaith wedding planner", "wedding concierge", "shaadi planner", "shadi planning", "vivah", "vedam",
    "seven vows wedding", "wedding atelier India", "book wedding vendors online", "wedding venue marketplace India",
  ],
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
  alternates: { canonical: "https://vivahvedam.in/" },
  openGraph: {
    type: "website",
    siteName: "Vivah Vedam",
    title: "Vivah Vedam — Seven vows. Zero worries.",
    description:
      "We curate the plan, make every booking, and execute every function to the minute. EMI-friendly. Zero-waste through our NGO partners.",
    url: "https://vivahvedam.in/",
    images: [{ url: "https://vivahvedam.in/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivah Vedam — Wedding Planners | EMI Options & Zero-Waste Weddings",
    description: "End-to-end wedding planning in India: curated plans, all bookings, flawless execution. Zero hassle for you.",
    images: ["https://vivahvedam.in/og-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  additionalType: "WeddingPlanner",
  name: "Vivah Vedam",
  url: "https://vivahvedam.in/",
  description:
    "Full-service wedding planning in India: curation, bookings, execution, EMI financing and zero-waste weddings with NGO food & floral rescue.",
  email: "hello@vivahvedam.in",
  areaServed: ["India", "Udaipur", "Jaipur", "Goa", "Jodhpur", "Delhi NCR"],
  priceRange: "₹₹₹",
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "214" },
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "End-to-end wedding planning & execution" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wedding financing with EMI options" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Zero-waste weddings — food & floral rescue via NGO partners" } },
  ],
};

// High-confidence Unsplash CDN URLs
const IMG = {
  heroA: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&h=1120&fit=crop&q=80",
  heroB: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700&h=900&fit=crop&q=80",
  heroC: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&h=520&fit=crop&q=80",
  journey1: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&q=80",
  journey2: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop&q=80",
  journey3: "https://images.unsplash.com/photo-1519167758481-83f550bb8aff?w=400&h=400&fit=crop&q=80",
  journey4: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop&q=80",
  journey5: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=400&fit=crop&q=80",
  sevaFood: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700&h=880&fit=crop&q=80",
  sevaFloral: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=700&h=620&fit=crop&q=80",
  postcard1: "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=620&h=780&fit=crop&q=80",
  postcard2: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=620&h=780&fit=crop&q=80",
  postcard3: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=620&h=780&fit=crop&q=80",
  postcard4: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=620&h=780&fit=crop&q=80",
  postcard5: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=620&h=780&fit=crop&q=80",
  postcard6: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=620&h=780&fit=crop&q=80",
  featured1: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1100&h=760&fit=crop&q=80",
  featured2: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=900&h=1100&fit=crop&q=80",
  featured3: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&h=700&fit=crop&q=80",
};

export default function LandingPage() {
  return (
    <>
      <div className={`vv ${vibes.variable}`} style={{ position: "relative" }}>
        <div className="vv-topbar">
          Now curating Winter 2026–27 weddings · 3 dates left this season · EMI plans available
        </div>
      </div>
      <Navbar />
      <div id="vv-top" className={`vv ${vibes.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <LandingMotion />
        <div className="vv-progress" aria-hidden="true" />

        {/* ══════════ HERO ══════════ */}
        <section className="vv-hero">
          <div className="vv-wrap vv-hero-grid">
            <div>
              <p className="vv-eyebrow" data-scramble data-scramble-text="CURATED · BOOKED · EXECUTED · FOR YOU">
                CURATED · BOOKED · EXECUTED · FOR YOU
              </p>
              <h1 className="vv-h1 vv-lm">
                <span className="vv-lm-l"><span>Seven vows.</span></span>
                <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}>
                  <span className="vv-it vv-script-over">
                    zero worries.
                    <span className="vv-script">vivah vedam</span>
                  </span>
                </span>
              </h1>
              <p className="vv-lead" data-reveal style={{ "--d": ".25s" } as React.CSSProperties}>
                You bring the love story. We curate the plan, make every booking, and run every function
                to the minute — from the first haldi to the last dance. Your only job is to be present.
              </p>
              <div className="vv-ctas" data-reveal style={{ "--d": ".35s" } as React.CSSProperties}>
                <a className="vv-btn" href="#begin">Begin your story <ArrowRight size={15} /></a>
                <a className="vv-btn vv-btn-ghost" href="#journey">See the journey <ArrowRight size={15} style={{ transform: "rotate(90deg)" }} /></a>
              </div>
              <div className="vv-hero-meta" data-reveal style={{ "--d": ".45s" } as React.CSSProperties}>
                <div><b>200+</b><span>weddings executed</span></div>
                <div><b>4.9 ★</b><span>couple rating</span></div>
                <div><b>0%</b><span>EMI partner plans</span></div>
                <div><b>100%</b><span>waste rescued</span></div>
              </div>
            </div>

            <div className="vv-collage" aria-hidden="true">
              <div className="vv-sun" />
              <figure className="vv-pcard vv-pc-a">
                <SlotImg priority kb slot="hero-a" src={IMG.heroA} w={900} h={1120} alt="Indian wedding couple beneath a floral arch" />
                <figcaption className="vv-script">the first look</figcaption>
              </figure>
              <figure className="vv-pcard vv-pc-b">
                <SlotImg slot="hero-b" src={IMG.heroB} w={700} h={900} alt="Sangeet night celebration with lights" />
                <figcaption className="vv-script">sangeet till late</figcaption>
              </figure>
              <figure className="vv-pcard vv-pc-c">
                <SlotImg slot="hero-c" src={IMG.heroC} w={800} h={520} alt="Haldi ceremony with marigold flowers" />
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
                {["Haldi", "Mehndi", "Sangeet", "Pheras", "Reception", "Destination", "EMI-Friendly", "Zero-Waste"].map((w) => (
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
                <span className="vv-lm-l"><span>From "yes"</span></span>
                <span className="vv-lm-l" style={{ "--d": ".1s" } as React.CSSProperties}><span>to happily ever</span></span>
                <span className="vv-lm-l" style={{ "--d": ".2s" } as React.CSSProperties}><span className="vv-it">after — without</span></span>
                <span className="vv-lm-l" style={{ "--d": ".3s" } as React.CSSProperties}><span className="vv-it">the chaos.</span></span>
              </h2>
              <span className="vv-script vv-script-md">five steps, that&apos;s all</span>
              <p className="vv-jnote" data-reveal style={{ "--d": ".35s" } as React.CSSProperties}>
                One team, one point of contact, one promise: everything is handled by us so nothing is handled by you.
              </p>
            </div>

            <ol className="vv-steps">
              <span className="vv-steps-fill" aria-hidden="true" />
              {[
                { n: "01", tag: "Reach out", title: <>You come to us</>, body: "Over chai, coffee or a call — tell us your vision, your dates, your people and your budget. We listen more than we speak, and your first consultation is always on the house.", chips: ["Free consult", "Same-day reply", "No obligation"], slot: "journey-1", src: IMG.journey1, alt: "Wedding planning consultation with couple" },
                { n: "02", tag: "Design", title: <>We curate your plan</>, body: "Moodboards, venue shortlists, function timelines and a budget sheet tracked down to the last marigold. You approve; we refine until it feels unmistakably yours.", chips: ["Moodboards", "Budget sheet", "Timelines"], slot: "journey-2", src: IMG.journey2, alt: "Wedding moodboard and planning documents" },
                { n: "03", tag: "Lock it in", title: <>Every booking, done with us</>, body: "Venues, décor, catering, artists, stays — all negotiated, contracted and booked through our desk. One agreement, one payment trail, zero vendor juggling at midnight.", chips: ["Vetted vendors", "Negotiated rates", "One contract"], slot: "journey-3", src: IMG.journey3, alt: "Palace wedding venue in Rajasthan" },
                { n: "04", tag: "Showtime", title: <>We help execute the weddings</>, body: "A 72-hour operations plan, a floor manager for every function, vendors synced to the minute, and a calm voice on the radio solving things before you ever know they happened.", chips: ["Floor managers", "Minute-by-minute rundown", "Guest desk"], slot: "journey-4", src: IMG.journey4, alt: "Wedding coordinator managing event" },
                { n: "05", tag: "The promise", title: <>You have <em>no hassle.</em></>, free: true, body: "You dance. You cry a little. You eat the food at your own wedding. We run the show — that's the deal, and it's the whole point of us.", chips: ["You just show up", "We handle the rest"], slot: "journey-5", src: IMG.journey5, alt: "Happy couple dancing at wedding" },
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

        {/* ══════════ FINANCING / EMI ══════════ */}
        <section className="vv-finance" id="finance">
          <div className="vv-wrap vv-fgrid">
            <div>
              <span className="vv-overline vv-overline-cream">Financing</span>
              <h2 className="vv-h2 vv-lm">
                <span className="vv-lm-l"><span>Say yes to the</span></span>
                <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}><span><em className="vv-gold-it">wedding,</em> not the wait.</span></span>
              </h2>
              <p className="vv-lead vv-lead-cream" data-reveal style={{ "--d": ".2s" } as React.CSSProperties}>
                The celebration shouldn&apos;t cost you your calm. We help finance your wedding with easy EMI
                options, so the day you&apos;ve dreamed of happens on the date you&apos;ve chosen.
              </p>
              <ul className="vv-points" data-reveal style={{ "--d": ".3s" } as React.CSSProperties}>
                <li><span className="vv-dot"><Wallet size={15} /></span>0% EMI plans with our partner banks &amp; NBFCs on eligible bookings</li>
                <li><span className="vv-dot"><CalendarRange size={15} /></span>Flexible tenures from 3 to 36 months — structured around your dates</li>
                <li><span className="vv-dot"><ShieldCheck size={15} /></span>Transparent paperwork handled by our desk, approved in as little as 48 hours</li>
                <li><span className="vv-dot"><Sparkles size={15} /></span>Book with a small advance now, split the rest across milestones</li>
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
                  Every Vivah Vedam wedding gives back. Through our NGO contacts, surplus food from your functions
                  is packed, collected and served to people in need the very same night — and every stem of floral
                  waste is rescued, composted or upcycled instead of reaching landfill. Your celebration becomes
                  someone&apos;s blessing.
                </p>
                <p className="vv-lead" data-reveal style={{ "--d": ".28s" } as React.CSSProperties}>
                  It costs you nothing extra. It means everything.
                </p>
              </div>
              <div className="vv-seva-imgs" data-reveal style={{ "--d": ".2s" } as React.CSSProperties}>
                <figure>
                  <SlotImg slot="seva-food" src={IMG.sevaFood} w={700} h={880} alt="Volunteers packing food for donation" />
                  <figcaption>Food rescued · same night</figcaption>
                </figure>
                <figure>
                  <SlotImg slot="seva-floral" src={IMG.sevaFloral} w={700} h={620} alt="Flowers being composted and recycled" />
                  <figcaption>Florals → compost &amp; incense</figcaption>
                </figure>
              </div>
            </div>

            <ul className="vv-flow" data-reveal>
              <li><span className="vv-flow-n"><UtensilsIcon /></span><b>Weigh &amp; pack the surplus</b><p>Our ground team boxes untouched food hygienically within an hour of each function ending.</p></li>
              <li><span className="vv-flow-n"><HeartHandshake size={16} /></span><b>Same-night distribution</b><p>Partner NGOs deliver it warm to shelters and night-homes across the city before sunrise.</p></li>
              <li><span className="vv-flow-n"><Recycle size={16} /></span><b>Florals get a second life</b><p>Marigold and rose waste is composted or rolled into incense — nothing goes to landfill.</p></li>
            </ul>

            <div className="vv-stats" data-reveal>
              <div><b data-count="120000" data-suffix="+">0</b><span>meals served via NGO partners</span></div>
              <div><b data-count="18500" data-suffix=" kg">0</b><span>flowers kept from landfill</span></div>
              <div><b data-count="64">0</b><span>zero-waste weddings delivered</span></div>
              <div><b data-count="12">0</b><span>NGO &amp; compost partners</span></div>
            </div>
          </div>
        </section>

        {/* ══════════ GALLERY — SCATTERED POSTCARDS ══════════ */}
        <section className="vv-work" id="work">
          <div className="vv-wrap">
            <div className="vv-work-head">
              <div>
                <span className="vv-overline">Recent weddings</span>
                <h2 className="vv-h2 vv-lm" style={{ marginBottom: 0 }}>
                  <span className="vv-lm-l"><span>Moments we were</span></span>
                  <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}><span className="vv-it">trusted with.</span></span>
                </h2>
              </div>
              <span className="vv-script vv-script-md vv-gold-script" data-reveal>postcards from the pheras</span>
            </div>
            <div className="vv-cards">
              {[
                { c: "vv-c1", slot: "postcard-1", src: IMG.postcard1, alt: "Indian baraat procession with groom on horse", cap: "the baraat", city: "Jaipur", d: "0s" },
                { c: "vv-c2", slot: "postcard-2", src: IMG.postcard2, alt: "Bride's hands with intricate mehndi design", cap: "mehndi details", city: "Delhi", d: ".08s" },
                { c: "vv-c3", slot: "postcard-3", src: IMG.postcard3, alt: "Wedding pheras ceremony around sacred fire", cap: "pheras at dusk", city: "Udaipur", d: ".16s" },
                { c: "vv-c4", slot: "postcard-4", src: IMG.postcard4, alt: "Wedding reception with candlelight and decor", cap: "reception glow", city: "Goa", d: ".24s" },
                { c: "vv-c5", slot: "postcard-5", src: IMG.postcard5, alt: "Sangeet dance performance on stage", cap: "sangeet till 3am", city: "Jodhpur", d: "0s" },
                { c: "vv-c6", slot: "postcard-6", src: IMG.postcard6, alt: "Wedding reception table with floral centerpiece", cap: "the long table", city: "Pushkar", d: ".12s" },
              ].map((p) => (
                <figure key={p.slot} className={p.c} data-reveal style={{ "--d": p.d } as React.CSSProperties}>
                  <SlotImg slot={p.slot} src={p.src} w={620} h={780} alt={p.alt} />
                  <figcaption><span className="vv-script">{p.cap}</span><small>{p.city}</small></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ FEATURED WEDDING ══════════ */}
        <section className="vv-featured">
          <div className="vv-wrap vv-feat-grid">
            <div className="vv-feat-sticky">
              <span className="vv-overline">Featured wedding</span>
              <span className="vv-script vv-script-md">Diya &amp; Arjun</span>
              <h2 className="vv-h2 vv-lm">
                <span className="vv-lm-l"><span>Three days by</span></span>
                <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}><span className="vv-it">Lake Pichola.</span></span>
              </h2>
              <ul className="vv-spec" data-reveal style={{ "--d": ".2s" } as React.CSSProperties}>
                <li><span>Venue</span><span>Heritage palace, Udaipur</span></li>
                <li><span>Guests</span><span>320, flown &amp; hosted</span></li>
                <li><span>Functions</span><span>Haldi · Mehndi · Sangeet · Pheras</span></li>
                <li><span>Vendors synced</span><span>14 teams, one radio</span></li>
                <li><span>Florals rescued</span><span>620 kg → compost &amp; incense</span></li>
                <li><span>Meals served</span><span>1,400 via NGO partners</span></li>
                <li><span>Financed</span><span>24-month EMI plan</span></li>
              </ul>
            </div>
            <div className="vv-feat-imgs">
              <figure data-reveal>
                <SlotImg kb slot="featured-1" src={IMG.featured1} w={1100} h={760} alt="Udaipur palace wedding ceremony overlooking lake" />
                <figcaption>The pheras, framed by the lake</figcaption>
              </figure>
              <figure data-reveal style={{ "--d": ".1s" } as React.CSSProperties}>
                <SlotImg slot="featured-2" src={IMG.featured2} w={900} h={1100} alt="Ornate floral mandap with marigolds" />
                <figcaption>A mandap of forty thousand marigolds</figcaption>
              </figure>
              <figure data-reveal style={{ "--d": ".15s" } as React.CSSProperties}>
                <SlotImg slot="featured-3" src={IMG.featured3} w={1000} h={700} alt="Sangeet stage under night sky with lights" />
                <figcaption>Sangeet under a borrowed sky</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ══════════ SERVICES ══════════ */}
        <section className="vv-services">
          <div className="vv-wrap">
            <span className="vv-overline">Everything under one roof</span>
            <h2 className="vv-h2 vv-lm">
              <span className="vv-lm-l"><span>One desk for</span></span>
              <span className="vv-lm-l" style={{ "--d": ".12s" } as React.CSSProperties}><span className="vv-it">every detail.</span></span>
            </h2>
            <div className="vv-svc-grid">
              {[
                ["01", "Venues & Mandaps", "Palaces, lawns, beaches, rooftops — scouted & negotiated."],
                ["02", "Décor & Florals", "Concept to build, with a rescue plan for every stem."],
                ["03", "Catering & Bar", "Menus tasted, counters managed, surplus boxed for seva."],
                ["04", "Photography & Film", "Editorial stills and films you'll rewatch for decades."],
                ["05", "Mehndi & Makeup", "Artists shortlisted, trials scheduled, touch-up desk on site."],
                ["06", "Music & Entertainment", "DJs, dhol, choreography, sangeet direction."],
                ["07", "Guest Travel & Stay", "Room blocks, pickups, a hospitality desk that never sleeps."],
                ["08", "Invites & Favors", "Paper goods and gifts people actually keep."],
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
                One form. One call. A curated plan in your inbox within five days — with honest numbers,
                EMI options and a seva plan baked in.
              </p>
              <ul className="vv-bcontact" data-reveal style={{ "--d": ".3s" } as React.CSSProperties}>
                <li><span className="vv-ic"><Phone size={15} /></span>+91 98765 43210 · WhatsApp friendly</li>
                <li><span className="vv-ic"><Mail size={15} /></span>hello@vivahvedam.in</li>
                <li><span className="vv-ic"><MapPin size={15} /></span>Studio visits by appointment · Mumbai &amp; Udaipur</li>
                <li><span className="vv-ic"><Leaf size={15} /></span>Every wedding includes a seva report</li>
              </ul>
            </div>
            <LeadForm />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

function UtensilsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M7 3v7a2 2 0 0 1-2 2v9M5 3v6M9 3v6M17 3c-1.5 2-2 4.5-2 7 0 2 .8 3 2 3v8" />
    </svg>
  );
}
