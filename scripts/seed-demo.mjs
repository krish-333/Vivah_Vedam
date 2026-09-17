import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: true },
});

// ═══════════════════════════════════════════
// Demo Accounts
// ═══════════════════════════════════════════
const PASSWORD = "DemoPass123!";

const demoUsers = {
  admin: {
    email: "admin@vivahvedam.demo",
    password: PASSWORD,
    fullName: "Vivah Admin",
    role: "admin",
  },
  couple1: {
    email: "priya@vivahvedam.demo",
    password: PASSWORD,
    fullName: "Priya & Arjun",
    role: "couple",
  },
  couple2: {
    email: "meera@vivahvedam.demo",
    password: PASSWORD,
    fullName: "Meera & Rohan",
    role: "couple",
  },
  vendorVenue1: {
    email: "rosewood@vivahvedam.demo",
    password: PASSWORD,
    fullName: "Rosewood Estates",
    role: "vendor",
  },
  vendorVenue2: {
    email: "royalmahal@vivahvedam.demo",
    password: PASSWORD,
    fullName: "Royal Mahal Group",
    role: "vendor",
  },
  vendorPhoto: {
    email: "goldenlens@vivahvedam.demo",
    password: PASSWORD,
    fullName: "Golden Lens Studio",
    role: "vendor",
  },
  vendorDecor: {
    email: "floraldesigns@vivahvedam.demo",
    password: PASSWORD,
    fullName: "Pushpa Floral Designs",
    role: "vendor",
  },
  vendorCatering: {
    email: "spiceroute@vivahvedam.demo",
    password: PASSWORD,
    fullName: "Spice Route Caterers",
    role: "vendor",
  },
  vendorMakeup: {
    email: "glamour@vivahvedam.demo",
    password: PASSWORD,
    fullName: "Glamour by Kavita",
    role: "vendor",
  },
};

// ═══════════════════════════════════════════
// Venues (Indian cities, INR pricing)
// ═══════════════════════════════════════════
const venues = [
  {
    vendorKey: "vendorVenue1",
    name: "Rosewood Celebration Lawns",
    description: "Premium open-air garden venue with fairy-light canopy, manicured lawns, indoor backup hall with AC, and dedicated bridal prep rooms. Perfect for 150-500 guest weddings.",
    address: "BKC Road, Bandra East",
    city: "Mumbai",
    state: "MH",
    country: "India",
    capacity_min: 150,
    capacity_max: 500,
    price_per_day: 800000,
    amenities: ["garden lawn", "indoor backup", "fairy lights", "bridal suite", "valet parking", "sound system", "generator backup"],
    cover_image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&q=80",
    ],
    rating_avg: 4.8,
    review_count: 142,
  },
  {
    vendorKey: "vendorVenue2",
    name: "The Royal Mahal Palace",
    description: "Heritage palace venue overlooking Lake Pichola with sprawling Mughal gardens, grand durbar hall, and lakeside mandap. India's most sought-after destination wedding venue.",
    address: "Lake Palace Road",
    city: "Udaipur",
    state: "RJ",
    country: "India",
    capacity_min: 200,
    capacity_max: 800,
    price_per_day: 1500000,
    amenities: ["heritage palace", "lakeside mandap", "durbar hall", "valet parking", "bridal suite", "in-house decor", "helipad", "resort stay"],
    cover_image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&q=80",
    ],
    rating_avg: 4.9,
    review_count: 87,
  },
  {
    vendorKey: "vendorVenue1",
    name: "Bloom Garden Resort",
    description: "Boutique resort with landscaped gardens, poolside cocktail deck, and a bohemian-style outdoor mandap surrounded by bougainvillea. Intimate and unforgettable.",
    address: "Whitefield Main Road",
    city: "Bangalore",
    state: "KA",
    country: "India",
    capacity_min: 80,
    capacity_max: 250,
    price_per_day: 450000,
    amenities: ["garden", "pool", "parking", "sound system", "resort stay", "nature views"],
    cover_image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop&q=80",
    ],
    rating_avg: 4.7,
    review_count: 56,
  },
  {
    vendorKey: "vendorVenue2",
    name: "The Grand Meridian",
    description: "Five-star hotel ballroom in South Delhi with crystal chandeliers, luxury decor packages, world-class in-house catering, and 24/7 wedding coordination team.",
    address: "Chanakyapuri, New Delhi",
    city: "Delhi",
    state: "DL",
    country: "India",
    capacity_min: 300,
    capacity_max: 1200,
    price_per_day: 2000000,
    amenities: ["5-star hotel", "in-house catering", "valet", "ac ballroom", "bridal suite", "luxury suites", "coordination team"],
    cover_image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop&q=80",
    ],
    rating_avg: 4.6,
    review_count: 234,
  },
  {
    vendorKey: "vendorVenue1",
    name: "Sunset Beach Club",
    description: "Beachfront venue with dedicated wedding lawn, ocean-view mandap, tiki bar cocktail area, and fire-pit sangeet zone. Perfect for Goa destination weddings.",
    address: "Calangute Beach Road",
    city: "Goa",
    state: "GA",
    country: "India",
    capacity_min: 50,
    capacity_max: 200,
    price_per_day: 600000,
    amenities: ["beachfront", "pool", "tiki bar", "fire pit", "sound system", "resort stay", "destination wedding"],
    cover_image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&q=80",
    ],
    rating_avg: 4.8,
    review_count: 78,
  },
  {
    vendorKey: "vendorVenue2",
    name: "Amber Fort Banquets",
    description: "Rajasthani-themed banquet hall with hand-painted murals, traditional jharokha balconies, and a rooftop terrace with panoramic city views.",
    address: "MI Road",
    city: "Jaipur",
    state: "RJ",
    country: "India",
    capacity_min: 100,
    capacity_max: 400,
    price_per_day: 550000,
    amenities: ["banquet hall", "rooftop terrace", "parking", "ac", "bridal suite", "in-house catering"],
    cover_image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&q=80",
    photos: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&q=80",
    ],
    rating_avg: 4.7,
    review_count: 165,
  },
];

// ═══════════════════════════════════════════
// Services
// ═══════════════════════════════════════════
const services = [
  {
    vendorKey: "vendorPhoto",
    title: "Candid Wedding Photography & Films",
    description: "Two-day candid + cinematic coverage with drone shots, same-day edit highlight reel, and premium coffee-table album. Pre-wedding shoot included in premium package.",
    category: "photography",
    price_type: "fixed",
    price_min: 150000,
    price_max: 500000,
    city: "Mumbai",
    service_radius_km: 100,
    cover_image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop&q=80",
    rating_avg: 4.9,
    review_count: 198,
  },
  {
    vendorKey: "vendorDecor",
    title: "Royal Floral & Stage Decor",
    description: "End-to-end wedding decor — mandap design, floral installations, stage setup, table styling, entrance gates, and car decoration. Themes: Royal, Pastel, Rustic, Contemporary.",
    category: "decor",
    price_type: "custom",
    price_min: 200000,
    price_max: 1000000,
    city: "Delhi",
    service_radius_km: 150,
    cover_image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&q=80",
    rating_avg: 4.8,
    review_count: 134,
  },
  {
    vendorKey: "vendorCatering",
    title: "Premium Multi-Cuisine Catering",
    description: "Lavish multi-cuisine buffet with 40+ dishes — North Indian, South Indian, Chinese, continental, and live counters (chaat, pasta, dosa). ₹1,200-2,800 per plate.",
    category: "catering",
    price_type: "custom",
    price_min: 350000,
    price_max: 1200000,
    city: "Mumbai",
    service_radius_km: 80,
    cover_image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop&q=80",
    rating_avg: 4.7,
    review_count: 267,
  },
  {
    vendorKey: "vendorMakeup",
    title: "Bridal Makeup & Styling — All Functions",
    description: "HD/airbrush bridal makeup for mehndi, sangeet, wedding, and reception. Includes saree/lehenga draping, hair styling, and jewellery setting. Touch-up artist on standby.",
    category: "makeup",
    price_type: "fixed",
    price_min: 40000,
    price_max: 200000,
    city: "Mumbai",
    service_radius_km: 60,
    cover_image: "https://images.unsplash.com/photo-1600038938045-b5fadbc55083?w=800&h=600&fit=crop&q=80",
    rating_avg: 4.9,
    review_count: 312,
  },
  {
    vendorKey: "vendorPhoto",
    title: "Sangeet DJ & Entertainment Package",
    description: "High-energy DJ sets with top Bollywood tracks, LED dance floor, intelligent lighting, fog machine, and live emcee. Includes sangeet games coordination.",
    category: "music-dj",
    price_type: "fixed",
    price_min: 75000,
    price_max: 250000,
    city: "Mumbai",
    service_radius_km: 100,
    cover_image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop&q=80",
    rating_avg: 4.6,
    review_count: 89,
  },
  {
    vendorKey: "vendorDecor",
    title: "Bridal Mehndi — Rajasthani & Arabic",
    description: "Intricate bridal mehndi for both hands and feet (full arm coverage). Guest mehndi service for up to 50 guests. Rajasthani, Arabic, and fusion styles.",
    category: "mehndi",
    price_type: "fixed",
    price_min: 15000,
    price_max: 80000,
    city: "Jaipur",
    service_radius_km: 200,
    cover_image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=800&h=600&fit=crop&q=80",
    rating_avg: 4.8,
    review_count: 145,
  },
  {
    vendorKey: "vendorCatering",
    title: "Wedding Coordination & Planning",
    description: "End-to-end wedding planning — vendor management, timeline creation, budget tracking, guest management, and day-of coordination. 3-month and 6-month packages.",
    category: "planning",
    price_type: "custom",
    price_min: 200000,
    price_max: 800000,
    city: "Delhi",
    service_radius_km: 200,
    cover_image: "https://images.unsplash.com/photo-1481841580057-e2b9927a05c6?w=800&h=600&fit=crop&q=80",
    rating_avg: 4.7,
    review_count: 56,
  },
  {
    vendorKey: "vendorMakeup",
    title: "Pre-Wedding Shoot — Cinematic",
    description: "Cinematic pre-wedding film and photo shoot at iconic locations. Includes styling consultation, outfit changes (up to 3), and 60-second reel + 100 edited photos.",
    category: "photography",
    price_type: "fixed",
    price_min: 50000,
    price_max: 200000,
    city: "Goa",
    service_radius_km: 300,
    cover_image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop&q=80",
    rating_avg: 4.8,
    review_count: 78,
  },
];

// ═══════════════════════════════════════════
// Categories
// ═══════════════════════════════════════════
const categories = [
  { name: "Photography", slug: "photography", icon: "📸", description: "Candid photography, cinematic films, drone coverage, and pre-wedding shoots." },
  { name: "Venues", slug: "venues", icon: "🏛️", description: "Banquet halls, garden lawns, heritage palaces, resorts, and farmhouse venues." },
  { name: "Decor", slug: "decor", icon: "💐", description: "Mandap design, floral installations, stage setup, and theme styling." },
  { name: "Catering", slug: "catering", icon: "🍽️", description: "Multi-cuisine buffets, plated service, live counters, and beverage packages." },
  { name: "Makeup", slug: "makeup", icon: "💄", description: "Bridal makeup, airbrush HD, hair styling, and draping for all functions." },
  { name: "Music & DJ", slug: "music-dj", icon: "🎵", description: "DJ sets, live bands, sangeet entertainment, and sound system rental." },
  { name: "Mehndi", slug: "mehndi", icon: "✋", description: "Bridal mehndi, guest mehndi, Arabic and Rajasthani designs." },
  { name: "Wedding Planning", slug: "planning", icon: "✨", description: "End-to-end coordination, day-of management, and destination wedding planning." },
  { name: "Bridal Wear", slug: "bridal-wear", icon: "👗", description: "Designer lehengas, sarees, gowns, and bridal trousseau." },
  { name: "Invitations", slug: "invitations", icon: "💌", description: "Custom wedding cards, digital invites, and save-the-dates." },
];

// ═══════════════════════════════════════════
// Reviews (realistic)
// ═══════════════════════════════════════════
const reviewTemplates = [
  { rating: 5, title: "Absolutely magical!", body: "Everything was perfect from start to finish. The team was professional, creative, and went above and beyond. Our guests are still talking about the wedding." },
  { rating: 5, title: "Best decision we made", body: "We were nervous about planning a destination wedding but they made it effortless. Every detail was handled with care. Worth every rupee." },
  { rating: 4, title: "Great experience overall", body: "Really professional team with excellent attention to detail. Minor delays on the day but they handled it gracefully. Would recommend to friends." },
  { rating: 5, title: "Exceeded our expectations", body: "The photos and videos blew us away. They captured moments we didn't even know happened. The highlight reel made our parents cry happy tears." },
  { rating: 5, title: "Made our dream come true", body: "From the initial consultation to the final delivery, the experience was seamless. They understood our vision and elevated it beyond what we imagined." },
  { rating: 4, title: "Professional and reliable", body: "Good communication throughout, delivered on time, and the quality was excellent. The only reason for 4 stars is the pricing was on the higher side." },
];

// ═══════════════════════════════════════════
// Helper functions
// ═══════════════════════════════════════════
async function ensureUser(seedUser) {
  const existing = await pool.query(`SELECT * FROM "users" WHERE email = $1`, [seedUser.email]);
  if (existing.rows.length > 0) return existing.rows[0];

  const passwordHash = await bcrypt.hash(seedUser.password, 12);
  const inserted = await pool.query(
    `INSERT INTO "users" (email, password_hash, full_name, role, onboarding_completed)
     VALUES ($1, $2, $3, $4, TRUE) RETURNING *`,
    [seedUser.email, passwordHash, seedUser.fullName, seedUser.role]
  );
  return inserted.rows[0];
}

// ═══════════════════════════════════════════
// Main seed function
// ═══════════════════════════════════════════
async function run() {
  console.log("\n🌺 Seeding VivahVedam demo data...\n");

  // 1. Create all users
  const userMap = {};
  for (const [key, userData] of Object.entries(demoUsers)) {
    const user = await ensureUser(userData);
    userMap[key] = user;
    console.log(`  ✓ ${userData.role.padEnd(7)} ${userData.email}`);
  }

  // 2. Create wedding for couple1
  async function ensureWedding(coupleId, weddingData) {
    const existing = await pool.query(
      `SELECT id FROM "weddings" WHERE couple_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [coupleId]
    );
    if (existing.rows.length > 0) return existing.rows[0].id;

    const inserted = await pool.query(
      `INSERT INTO "weddings"
         (couple_id, partner_1_name, partner_2_name, wedding_date, city, guest_count, budget_total, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'planning') RETURNING id`,
      [
        coupleId,
        weddingData.partner_1_name,
        weddingData.partner_2_name,
        weddingData.wedding_date,
        weddingData.city,
        weddingData.guest_count,
        weddingData.budget_total,
      ]
    );
    return inserted.rows[0].id;
  }

  const wedding1Id = await ensureWedding(userMap.couple1.id, {
    partner_1_name: "Priya",
    partner_2_name: "Arjun",
    wedding_date: "2027-02-14",
    city: "Mumbai",
    guest_count: 350,
    budget_total: 3500000,
  });
  console.log(`  ✓ Wedding: Priya & Arjun — Feb 14, 2027, Mumbai`);

  const wedding2Id = await ensureWedding(userMap.couple2.id, {
    partner_1_name: "Meera",
    partner_2_name: "Rohan",
    wedding_date: "2027-11-20",
    city: "Jaipur",
    guest_count: 500,
    budget_total: 5000000,
  });
  console.log(`  ✓ Wedding: Meera & Rohan — Nov 20, 2027, Jaipur`);
  void wedding2Id;

  // 4. Seed categories
  for (const c of categories) {
    await pool.query(
      `INSERT INTO "categories" (name, slug, icon, description, is_system, is_approved)
       VALUES ($1, $2, $3, $4, TRUE, TRUE)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, description = EXCLUDED.description`,
      [c.name, c.slug, c.icon, c.description]
    );
  }
  console.log(`  ✓ ${categories.length} categories seeded`);

  // 5. Seed venues
  const venueIds = [];
  for (const venue of venues) {
    const vendorId = userMap[venue.vendorKey].id;
    const { vendorKey, ...v } = venue;
    void vendorKey;

    const existing = await pool.query(
      `SELECT id FROM "venues" WHERE vendor_id = $1 AND name = $2`,
      [vendorId, v.name]
    );
    if (existing.rows.length > 0) {
      venueIds.push(existing.rows[0].id);
      continue;
    }

    const inserted = await pool.query(
      `INSERT INTO "venues"
         (vendor_id, name, description, address, city, state, country, capacity_min, capacity_max,
          price_per_day, amenities, photos, cover_image, rating_avg, review_count, is_approved, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,TRUE,TRUE)
       RETURNING id`,
      [
        vendorId, v.name, v.description, v.address, v.city, v.state, v.country,
        v.capacity_min, v.capacity_max, v.price_per_day,
        JSON.stringify(v.amenities), v.photos, v.cover_image, v.rating_avg, v.review_count,
      ]
    );
    venueIds.push(inserted.rows[0].id);
  }
  console.log(`  ✓ ${venues.length} venues seeded`);

  // 6. Seed services
  const serviceIds = [];
  for (const service of services) {
    const vendorId = userMap[service.vendorKey].id;
    const { vendorKey, ...s } = service;
    void vendorKey;

    const existing = await pool.query(
      `SELECT id FROM "services" WHERE vendor_id = $1 AND title = $2`,
      [vendorId, s.title]
    );
    if (existing.rows.length > 0) {
      serviceIds.push(existing.rows[0].id);
      continue;
    }

    const inserted = await pool.query(
      `INSERT INTO "services"
         (vendor_id, title, description, category, price_type, price_min, price_max,
          city, service_radius_km, cover_image, rating_avg, review_count, is_approved, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,TRUE,TRUE)
       RETURNING id`,
      [
        vendorId, s.title, s.description, s.category, s.price_type, s.price_min, s.price_max,
        s.city, s.service_radius_km, s.cover_image, s.rating_avg, s.review_count,
      ]
    );
    serviceIds.push(inserted.rows[0].id);
  }
  console.log(`  ✓ ${services.length} services seeded`);

  // 7. Seed bookings for couple1
  const existingBookings = await pool.query(`SELECT id FROM "bookings" WHERE wedding_id = $1 LIMIT 1`, [wedding1Id]);

  let bookingIds = [];
  if (existingBookings.rows.length === 0) {
    const bookingRows = [
      { venue_id: venueIds[0], service_id: null, vendor_id: userMap.vendorVenue1.id, booking_date: "2027-02-14", status: "confirmed", total_amount: 800000, platform_fee: 80000, vendor_payout: 720000, stripe_payment_intent_id: "mock_pi_venue_rosewood", notes: "Main wedding reception — 350 guests" },
      { venue_id: null, service_id: serviceIds[0], vendor_id: userMap.vendorPhoto.id, booking_date: "2027-02-13", status: "confirmed", total_amount: 350000, platform_fee: 35000, vendor_payout: 315000, stripe_payment_intent_id: "mock_pi_photo_goldenlens", notes: "Full coverage — mehndi, sangeet, wedding, reception + pre-wedding shoot" },
      { venue_id: null, service_id: serviceIds[3], vendor_id: userMap.vendorMakeup.id, booking_date: "2027-02-14", status: "pending", total_amount: 150000, platform_fee: 15000, vendor_payout: 135000, stripe_payment_intent_id: null, notes: "Bridal makeup for all 4 functions" },
      { venue_id: null, service_id: serviceIds[2], vendor_id: userMap.vendorCatering.id, booking_date: "2027-02-14", status: "in_progress", total_amount: 700000, platform_fee: 70000, vendor_payout: 630000, stripe_payment_intent_id: "mock_pi_catering_spice", notes: "350 guests — veg + non-veg buffet with live counters" },
    ];

    for (const b of bookingRows) {
      const inserted = await pool.query(
        `INSERT INTO "bookings"
           (wedding_id, venue_id, service_id, vendor_id, couple_id, booking_date, status,
            total_amount, platform_fee, vendor_payout, stripe_payment_intent_id, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
        [
          wedding1Id, b.venue_id, b.service_id, b.vendor_id, userMap.couple1.id, b.booking_date, b.status,
          b.total_amount, b.platform_fee, b.vendor_payout, b.stripe_payment_intent_id, b.notes,
        ]
      );
      bookingIds.push(inserted.rows[0].id);
    }
    console.log(`  ✓ 4 bookings seeded for Priya & Arjun`);
  } else {
    const all = await pool.query(`SELECT id FROM "bookings" WHERE wedding_id = $1`, [wedding1Id]);
    bookingIds = all.rows.map((b) => b.id);
    console.log(`  ✓ Bookings already exist for Priya & Arjun`);
  }

  // 8. Seed reviews
  if (bookingIds.length >= 2) {
    const existingReviews = await pool.query(
      `SELECT id FROM "reviews" WHERE booking_id = ANY($1::uuid[]) LIMIT 1`,
      [bookingIds.slice(0, 2)]
    );

    if (existingReviews.rows.length === 0) {
      const reviewRows = [
        { booking_id: bookingIds[0], vendor_id: userMap.vendorVenue1.id, rating: 5, title: "Dream venue — absolutely perfect!", body: "Rosewood Celebration Lawns made our wedding magical. The fairy-light canopy at sunset was breathtaking. The coordination team handled everything seamlessly. Our 350 guests had an incredible time." },
        { booking_id: bookingIds[1], vendor_id: userMap.vendorPhoto.id, rating: 5, title: "Photos that made us cry happy tears", body: "Golden Lens captured moments we didn't even know happened. The same-day edit at the reception was the highlight of our night. The drone shots of the venue were stunning. Worth every rupee." },
      ];
      for (const r of reviewRows) {
        await pool.query(
          `INSERT INTO "reviews" (booking_id, reviewer_id, vendor_id, rating, title, body, is_verified)
           VALUES ($1,$2,$3,$4,$5,$6,TRUE)`,
          [r.booking_id, userMap.couple1.id, r.vendor_id, r.rating, r.title, r.body]
        );
      }
      console.log(`  ✓ 2 verified reviews seeded`);
    }
  }

  // 9. Seed conversations & messages
  const conversations = [
    {
      couple: userMap.couple1,
      vendor: userMap.vendorVenue1,
      messages: [
        { sender: "couple", content: "Hi! We loved the venue photos. Is Feb 14, 2027 available for a 350-guest wedding?" },
        { sender: "vendor", content: "Hello Priya! Yes, Feb 14 is available. We'd love to host your wedding. Would you like to schedule a site visit this weekend?" },
        { sender: "couple", content: "That would be amazing! Saturday afternoon works for us. Can we also discuss the decor packages?" },
        { sender: "vendor", content: "Saturday at 3 PM works perfectly. I'll have our decor team ready with mood boards. See you then! 🌸" },
      ],
    },
    {
      couple: userMap.couple1,
      vendor: userMap.vendorPhoto,
      messages: [
        { sender: "couple", content: "Hi Golden Lens! We saw your portfolio and loved the candid style. Are you available for a Feb 2027 wedding?" },
        { sender: "vendor", content: "Thank you! We'd be thrilled to cover your wedding. Feb 2027 is open. Shall we set up a call to discuss your vision?" },
        { sender: "couple", content: "Yes please! We want a mix of candid and cinematic, with a pre-wedding shoot in Goa." },
      ],
    },
  ];

  for (const convo of conversations) {
    const upserted = await pool.query(
      `INSERT INTO "conversations" (couple_id, vendor_id, booking_id)
       VALUES ($1, $2, NULL)
       ON CONFLICT (couple_id, vendor_id) DO UPDATE SET updated_at = NOW()
       RETURNING id`,
      [convo.couple.id, convo.vendor.id]
    );
    const conversationId = upserted.rows[0].id;

    const existingMsgs = await pool.query(
      `SELECT id FROM "messages" WHERE conversation_id = $1 LIMIT 1`,
      [conversationId]
    );

    if (existingMsgs.rows.length === 0) {
      for (let i = 0; i < convo.messages.length; i++) {
        const m = convo.messages[i];
        const senderId = m.sender === "couple" ? convo.couple.id : convo.vendor.id;
        const readAt = i < convo.messages.length - 1 ? new Date().toISOString() : null;
        await pool.query(
          `INSERT INTO "messages" (conversation_id, sender_id, content, read_at) VALUES ($1,$2,$3,$4)`,
          [conversationId, senderId, m.content, readAt]
        );
      }
    }
  }
  console.log(`  ✓ ${conversations.length} conversations with messages seeded`);

  // 10. Seed journey steps for couple1
  const existingSteps = await pool.query(`SELECT id FROM "journey_steps" WHERE wedding_id = $1 LIMIT 1`, [wedding1Id]);

  if (existingSteps.rows.length === 0) {
    const steps = [
      { step_type: "venue", title: "Book your venue", description: "Secure the perfect venue and lock your wedding date.", status: "completed", order_index: 0, recommended_deadline: "2026-04-01", completed: true },
      { step_type: "photography", title: "Hire photo & video team", description: "Confirm your photographers and videographers for full-day coverage.", status: "completed", order_index: 1, recommended_deadline: "2026-07-01", completed: true },
      { step_type: "catering", title: "Finalize catering", description: "Shortlist menus, schedule tastings, and lock your catering partner.", status: "active", order_index: 2, recommended_deadline: "2026-08-01", completed: false },
      { step_type: "decor", title: "Plan decor & styling", description: "Set your visual theme — mandap design, floral plan, stage setup, and entrance decor.", status: "upcoming", order_index: 3, recommended_deadline: "2026-10-01", completed: false },
      { step_type: "makeup", title: "Book bridal makeup", description: "Schedule trials and book your makeup artist for all functions.", status: "upcoming", order_index: 4, recommended_deadline: "2026-11-01", completed: false },
      { step_type: "music", title: "Book sangeet entertainment", description: "Book DJ, choreographer, and live performers for sangeet and reception.", status: "upcoming", order_index: 5, recommended_deadline: "2026-12-01", completed: false },
      { step_type: "mehndi", title: "Arrange mehndi artist", description: "Book mehndi artist for bride and guests. Schedule timing for mehndi night.", status: "upcoming", order_index: 6, recommended_deadline: "2027-01-01", completed: false },
      { step_type: "finalization", title: "Final confirmations", description: "Confirm all vendors, finalize guest list, coordinate arrival timings, and do final walk-through.", status: "upcoming", order_index: 7, recommended_deadline: "2027-02-07", completed: false },
    ];
    for (const s of steps) {
      await pool.query(
        `INSERT INTO "journey_steps"
           (wedding_id, step_type, title, description, status, order_index, recommended_deadline, completed_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [wedding1Id, s.step_type, s.title, s.description, s.status, s.order_index, s.recommended_deadline, s.completed ? new Date().toISOString() : null]
      );
    }
    console.log(`  ✓ 8 journey steps seeded for Priya & Arjun`);
  }

  // ═══════════════════════════════════════════
  // Print demo accounts
  // ═══════════════════════════════════════════
  console.log("\n" + "═".repeat(52));
  console.log("  🌺 VivahVedam Demo Accounts");
  console.log("═".repeat(52));
  console.log(`  Password for all: ${PASSWORD}\n`);
  console.log("  COUPLES:");
  console.log(`    ${demoUsers.couple1.email.padEnd(32)} (Priya & Arjun)`);
  console.log(`    ${demoUsers.couple2.email.padEnd(32)} (Meera & Rohan)`);
  console.log("\n  VENDORS:");
  console.log(`    ${demoUsers.vendorVenue1.email.padEnd(32)} (Rosewood Estates)`);
  console.log(`    ${demoUsers.vendorVenue2.email.padEnd(32)} (Royal Mahal Group)`);
  console.log(`    ${demoUsers.vendorPhoto.email.padEnd(32)} (Golden Lens Studio)`);
  console.log(`    ${demoUsers.vendorDecor.email.padEnd(32)} (Pushpa Floral Designs)`);
  console.log(`    ${demoUsers.vendorCatering.email.padEnd(32)} (Spice Route Caterers)`);
  console.log(`    ${demoUsers.vendorMakeup.email.padEnd(32)} (Glamour by Kavita)`);
  console.log("\n  ADMIN:");
  console.log(`    ${demoUsers.admin.email.padEnd(32)} (Platform Admin)`);
  console.log("═".repeat(52) + "\n");
}

run()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
