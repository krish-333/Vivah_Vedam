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

const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--vv-script" });

export const metadata: Metadata = {
  title: "Vivah Vedam — Wedding Planners in India | End-to-End Planning, EMI Options & Zero-Waste Weddings",
  description:
    "Vivah Vedam is a full-service wedding atelier and planning marketplace in India. We curate your plan, make every booking, and execute every function — you have zero hassle.",
  keywords: [
    "vivah vedam", "wedding planners in India", "luxury wedding planner", "destination wedding planner India",
    "wedding planning company", "wedding planners near me", "sustainable wedding planner", "zero waste wedding",
    "Udaipur wedding planner", "Jaipur wedding planner", "Goa wedding planner", "Jodhpur wedding planner",
    "wedding venue marketplace India", "wedding atelier India",
  ],
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
  alternates: { canonical: "https://vivahvedam.in/" },
  openGraph: {
    type: "website",
    siteName: "Vivah Vedam",
    title: "Vivah Vedam — Seven vows. Zero worries.",
    description: "We curate the plan, make every booking, and execute every function to the minute.",
    url: "https://vivahvedam.in/",
    images: [{ url: "https://images.unsplash.com/photo-1604017013488-a0740be3a811?w=1200&h=630&fit=crop&q=80", width: 1200, height: 630 }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivah Vedam — Wedding Planners | EMI Options & Zero-Waste Weddings",
    description: "End-to-end wedding planning in India: curated plans, all bookings, flawless execution.",
    images: ["https://images.unsplash.com/photo-1604017013488-a0740be3a811?w=1200&h=630&fit=crop&q=80"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  additionalType: "WeddingPlanner",
  name: "Vivah Vedam",
  url: "https://vivahvedam.in/",
  description: "Full-service wedding planning in India: curation, bookings, execution, EMI financing and zero-waste weddings.",
  email: "hello@vivahvedam.com",
  areaServed: ["India", "Udaipur", "Jaipur", "Goa", "Jodhpur", "Delhi NCR"],
  priceRange: "₹₹₹",
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "End-to-end wedding planning & execution" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wedding financing with EMI options" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Zero-waste weddings — food & floral rescue via NGO partners" } },
  ],
};

// Production-ready Unsplash images (all CC0/Unsplash license — free for commercial use)
const IMAGES = {
  // Hero collage
  heroA: "https://images.unsplash.com/photo-1604017013488-a0740be3a811?w=900&h=1120&fit=crop&q=80",
  heroB: "https://images.unsplash.com/photo-1583939003173-7131aa5f1154?w=700&h=900&fit=crop&q=80",
  heroC: "https://images.unsplash.com/photo-1519741347659-5b6b4c2b5eb3?w=800&h=520&fit=crop&q=80",
  
  // Journey steps
  journey1: "https://images.unsplash.com/photo-1511505039350-06d3ba7c0a5f?w=400&h=400&fit=crop&q=80",
  journey2: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=400&fit=crop&q=80",
  journey3: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop&q=80",
  journey4: "https://images.unsplash.com/photo-1530103862672-deb1c8893c39?w=400&h=400&fit=crop&q=80",
  journey5: "https://images.unsplash.com/photo-1590725121909-74f3c10ea86b?w=400&h=400&fit=crop&q=80",
  
  // Seva
  sevaFood: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700&h=880&fit=crop&q=80",
  sevaFloral: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=700&h=620&fit=crop&q=80",
  
  // Gallery postcards
  postcard1: "https://images.unsplash.com/photo-1604017013488-a0740be3a811?w=620&h=780&fit=crop&q=80",
  postcard2: "https://images.unsplash.com/photo-1617128535665-2e3a5b8d5c8a?w=620&h=780&fit=crop&q=80",
  postcard3: "https://images.unsplash.com/photo-1519741347659-5b6b4c2b5eb3?w=620&h=780&fit=crop&q=80",
  postcard4: "https://images.unsplash.com/photo-1511505039350-06d3ba7c0a5f?w=620&h=780&fit=crop&q=80",
  postcard5: "https://images.unsplash.com/photo-1530103862672-deb1c8893c39?w=620&h=780&fit=crop&q=80",
  postcard6: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=620&h=780&fit=crop&q=80",
  
  // Featured wedding
  featured1: "https://images.unsplash.com/photo-1604017013488-a0740be3a811?w=1100&h=760&fit=crop&q=80",
  featured2: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&h=1100&fit=crop&q=80",
  featured3: "https://images.unsplash.com/photo-1511505039350-06d3ba7c0a5f?w=1000&h=700&fit=crop&q=80",
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
                <div className="vv-ph vv-kb">
                  <img data-slot="hero-a" src={IMAGES.heroA} alt="Indian wedding couple beneath a floral arch" />
                </div>
                <figcaption className="vv-script">the first look</figcaption>
              </figure>
              <figure className="vv-pcard vv-pc-b">
                <div className="vv-ph">
                  <img data-slot="hero-b" src={IMAGES.heroB} alt="Sangeet night celebration with lights" />
                </div>
                <figcaption className="vv-script">sangeet till late</figcaption>
              </figure>
              <figure className="vv-pcard vv-pc-c">
                <div className="vv-ph">
                  <img data-slot="hero-c" src={IMAGES.heroC} alt="Haldi ceremony with marigold flowers" />
                </div>
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
              <li className="vv-step" data-reveal style={{ "--d": "0s" } as React.CSSProperties}>
                <div className="vv-step-no">01<small>Reach out</small></div>
                <div>
                  <h3>You come to us</h3>
                  <p>Over chai, coffee or a call — tell us your vision, your dates, your people and your budget. We listen more than we speak, and your first consultation is always on the house.</p>
                  <div className="vv-step-tags"><span>Free consult</span><span>Same-day reply</span><span>No obligation</span></div>
                </div>
                <figure className="vv-step-img">
                  <img data-slot="journey-1" src={IMAGES.journey1} alt="Wedding planning consultation with couple" />
                </figure>
              </li>

              <li className="vv-step" data-reveal style={{ "--d": ".06s" } as React.CSSProperties}>
                <div className="vv-step-no">02<small>Design</small></div>
                <div>
                  <h3>We curate your plan</h3>
                  <p>Moodboards, venue shortlists, function timelines and a budget sheet tracked down to the last marigold. You approve; we refine until it feels unmistakably yours.</p>
                  <div className="vv-step-tags"><span>Moodboards</span><span>Budget sheet</span><span>Timelines</span></div>
                </div>
                <figure className="vv-step-img">
                  <img data-slot="journey-2" src={IMAGES.journey2} alt="Wedding moodboard and planning documents" />
                </figure>
              </li>

              <li className="vv-step" data-reveal style={{ "--d": ".12s" } as React.CSSProperties}>
                <div className="vv-step-no">03<small>Lock it in</small></div>
                <div>
                  <h3>Every booking, done with us</h3>
                  <p>Venues, décor, catering, artists, stays — all negotiated, contracted and booked through our desk. One agreement, one payment trail, zero vendor juggling at midnight.</p>
                  <div className="vv-step-tags"><span>Vetted vendors</span><span>Negotiated rates</span><span>One contract</span></div>
                </div>
                <figure className="vv-step-img">
                  <img data-slot="journey-3" src={IMAGES.journey3} alt="Palace wedding venue in Rajasthan" />
                </figure>
              </li>

              <li className="vv-step" data-reveal style={{ "--d": ".18s" } as React.CSSProperties}>
                <div className="vv-step-no">04<small>Showtime</small></div>
                <div>
                  <h3>We help execute the weddings</h3>
                  <p>A 72-hour operations plan, a floor manager for every function, vendors synced to the minute, and a calm voice on the radio solving things before you ever know they happened.</p>
                  <div className="vv-step-tags"><span>Floor managers</span><span>Minute-by-minute rundown</span><span>Guest desk</span></div>
                </div>
                <figure className="vv-step-img">
                  <img data-slot="journey-4" src={IMAGES.journey4} alt="Wedding coordinator managing event" />
                </figure>
              </li>

              <li className="vv-step vv-step-free" data-reveal style={{ "--d": ".24s" } as React.CSSProperties}>
                <div className="vv-step-no">05<small>The promise</small></div>
                <div>
                  <h3>You have <em>no hassle.</em></h3>
                  <p>You dance. You cry a little. You eat the food at your own wedding. We run the show — that's the deal, and it's the whole point of us.</p>
                  <div className="vv-step-tags"><span>You just show up</span><span>We handle the rest</span></div>
                </div>
                <figure className="vv-step-img">
                  <img data-slot="journey-5" src={IMAGES.journey5} alt="Happy couple dancing at wedding" />
                </figure>
              </li>
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
                  waste is rescued, composted or upcycled instead of reaching landfill.
                </p>
                <p className="vv-lead" data-reveal style={{ "--d": ".28s" } as React.CSSProperties}>
                  It costs you nothing extra. It means everything.
                </p>
              </div>
              <div className="vv-seva-imgs" data-reveal style={{ "--d": ".2s" } as React.CSSProperties}>
                <figure>
                  <img data-slot="seva-food" src={IMAGES.sevaFood} alt="Volunteers packing food for donation" />
                  <figcaption>Food rescued · same night</figcaption>
                </figure>
                <figure>
                  <img data-slot="seva-floral" src={IMAGES.sevaFloral} alt="Flowers being composted and recycled" />
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
              <figure className="vv-c1" data-reveal style={{ "--d": "0s" } as React.CSSProperties}>
                <div className="vv-ph">
                  <img data-slot="postcard-1" src={IMAGES.postcard1} alt="Indian baraat procession" />
                </div>
                <figcaption><span className="vv-script">the baraat</span><small>Jaipur</small></figcaption>
              </figure>
              <figure className="vv-c2" data-reveal style={{ "--d": ".08s" } as React.CSSProperties}>
                <div className="vv-ph">
                  <img data-slot="postcard-2" src={IMAGES.postcard2} alt="Bride's hands with mehndi design" />
                </div>
                <figcaption><span className="vv-script">mehndi details</span><small>Delhi</small></figcaption>
              </figure>
              <figure className="vv-c3" data-reveal style={{ "--d": ".16s" } as React.CSSProperties}>
                <div className="vv-ph">
                  <img data-slot="postcard-3" src={IMAGES.postcard3} alt="Wedding pheras ceremony" />
                </div>
                <figcaption><span className="vv-script">pheras at dusk</span><small>Udaipur</small></figcaption>
              </figure>
              <figure className="vv-c4" data-reveal style={{ "--d": ".24s" } as React.CSSProperties}>
                <div className="vv-ph">
                  <img data-slot="postcard-4" src={IMAGES.postcard4} alt="Wedding reception with decor" />
                </div>
                <figcaption><span className="vv-script">reception glow</span><small>Goa</small></figcaption>
              </figure>
              <figure className="vv-c5" data-reveal style={{ "--d": "0s" } as React.CSSProperties}>
                <div className="vv-ph">
                  <img data-slot="postcard-5" src={IMAGES.postcard5} alt="Sangeet dance performance" />
                </div>
                <figcaption><span className="vv-script">sangeet till 3am</span><small>Jodhpur</small></figcaption>
              </figure>
              <figure className="vv-c6" data-reveal style={{ "--d": ".12s" } as React.CSSProperties}>
                <div className="vv-ph">
                  <img data-slot="postcard-6" src={IMAGES.postcard6} alt="Wedding reception table setting" />
                </div>
                <figcaption><span className="vv-script">the long table</span><small>Pushkar</small></figcaption>
              </figure>
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
                <div className="vv-ph vv-kb">
                  <img data-slot="featured-1" src={IMAGES.featured1} alt="Udaipur palace wedding ceremony" />
                </div>
                <figcaption>The pheras, framed by the lake</figcaption>
              </figure>
              <figure data-reveal style={{ "--d": ".1s" } as React.CSSProperties}>
                <div className="vv-ph">
                  <img data-slot="featured-2" src={IMAGES.featured2} alt="Ornate floral mandap" />
                </div>
                <figcaption>A mandap of forty thousand marigolds</figcaption>
              </figure>
              <figure data-reveal style={{ "--d": ".15s" } as React.CSSProperties}>
                <div className="vv-ph">
                  <img data-slot="featured-3" src={IMAGES.featured3} alt="Sangeet stage under lights" />
                </div>
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
                <li><span className="vv-ic"><Phone size={15} /></span>+91 22 4000 5000 · WhatsApp friendly</li>
                <li><span className="vv-ic"><Mail size={15} /></span>hello@vivahvedam.com</li>
                <li><span className="vv-ic"><MapPin size={15} /></span>WeWork BKC, Mumbai &amp; Udaipur</li>
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
