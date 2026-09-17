import { db } from "@/lib/db";
import type { Database } from "@/types";

export type VenueItem = {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  city: string;
  country: string;
  capacityMin: number;
  capacityMax: number;
  pricePerDay: number;
  ratingAvg: number;
  reviewCount: number;
  coverImage: string;
  amenities: string[];
};

export type ServiceItem = {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  category: string;
  city: string;
  priceMin: number;
  priceMax: number;
  ratingAvg: number;
  reviewCount: number;
  coverImage: string;
};

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type VendorItem = {
  id: string;
  fullName: string;
  phone: string | null;
};

export type BookingListItem = {
  id: string;
  status: Database["public"]["Tables"]["bookings"]["Row"]["status"];
  bookingDate: string;
  totalAmount: number;
  platformFee: number;
  vendorPayout: number;
  notes: string | null;
  createdAt: string;
  venueId: string | null;
  serviceId: string | null;
  vendorId: string;
  coupleId: string;
  venueName: string | null;
  serviceTitle: string | null;
  vendorName: string;
  coupleName: string;
  paymentReference: string | null;
};

const fallbackVenues: VenueItem[] = [
  {
    id: "v-fallback-1",
    vendorId: "u-vendor-1",
    name: "The Royal Mahal Palace",
    description:
      "Heritage palace venue with sprawling Mughal gardens, grand ballrooms, and lakeside mandap setup for up to 500 guests.",
    city: "Udaipur",
    country: "India",
    capacityMin: 150,
    capacityMax: 500,
    pricePerDay: 1200000,
    ratingAvg: 4.9,
    reviewCount: 87,
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&q=80",
    amenities: ["lakeside", "heritage", "valet parking", "bridal suite", "in-house decor"],
  },
  {
    id: "v-fallback-2",
    vendorId: "u-vendor-2",
    name: "Bloom Garden Lawns",
    description:
      "Open-air garden venue with fairy-light canopy, manicured lawns, and climate-controlled indoor backup hall.",
    city: "Jaipur",
    country: "India",
    capacityMin: 100,
    capacityMax: 350,
    pricePerDay: 550000,
    ratingAvg: 4.7,
    reviewCount: 124,
    coverImage: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop&q=80",
    amenities: ["garden", "fairy lights", "indoor backup", "parking", "sound system"],
  },
  {
    id: "v-fallback-3",
    vendorId: "u-vendor-3",
    name: "Saffron Banquets",
    description:
      "Premium banquet hall in the heart of Mumbai with crystal chandeliers, grand stage, and dedicated bridal prep rooms.",
    city: "Mumbai",
    country: "India",
    capacityMin: 200,
    capacityMax: 800,
    pricePerDay: 800000,
    ratingAvg: 4.8,
    reviewCount: 203,
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&q=80",
    amenities: ["banquet hall", "valet parking", "bridal suite", "in-house catering", "ac"],
  },
  {
    id: "v-fallback-4",
    vendorId: "u-vendor-1",
    name: "Sunset Beach Resort",
    description:
      "Beachfront resort with dedicated wedding lawn, poolside cocktail area, and ocean-view mandap for destination weddings.",
    city: "Goa",
    country: "India",
    capacityMin: 50,
    capacityMax: 250,
    pricePerDay: 650000,
    ratingAvg: 4.8,
    reviewCount: 56,
    coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&q=80",
    amenities: ["beachfront", "pool", "resort stay", "destination wedding", "sound system"],
  },
  {
    id: "v-fallback-5",
    vendorId: "u-vendor-2",
    name: "The Grand Meridian",
    description:
      "Five-star hotel ballroom in South Delhi with luxury decor packages, world-class catering, and 24/7 wedding coordination.",
    city: "Delhi",
    country: "India",
    capacityMin: 250,
    capacityMax: 1000,
    pricePerDay: 1500000,
    ratingAvg: 4.6,
    reviewCount: 312,
    coverImage: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop&q=80",
    amenities: ["5-star hotel", "in-house catering", "valet", "ac", "bridal suite", "helipad"],
  },
  {
    id: "v-fallback-6",
    vendorId: "u-vendor-3",
    name: "Vineyard Estate",
    description:
      "Rustic farmhouse venue with vineyard views, bonfire area, and bohemian-style outdoor mandap surrounded by nature.",
    city: "Bangalore",
    country: "India",
    capacityMin: 80,
    capacityMax: 200,
    pricePerDay: 400000,
    ratingAvg: 4.9,
    reviewCount: 45,
    coverImage: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop&q=80",
    amenities: ["farmhouse", "outdoor", "bonfire", "parking", "nature views"],
  },
];

const fallbackServices: ServiceItem[] = [
  {
    id: "s-fallback-1",
    vendorId: "u-vendor-1",
    title: "Candid Wedding Photography & Films",
    description:
      "Two-day candid + cinematic coverage with drone shots, same-day edit highlight reel, and premium coffee-table album.",
    category: "photography",
    city: "Mumbai",
    priceMin: 150000,
    priceMax: 500000,
    ratingAvg: 4.9,
    reviewCount: 156,
    coverImage: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "s-fallback-2",
    vendorId: "u-vendor-2",
    title: "Royal Floral & Stage Decor",
    description:
      "End-to-end wedding decor — mandap design, floral installations, stage setup, table styling, and entrance gates.",
    category: "decor",
    city: "Delhi",
    priceMin: 200000,
    priceMax: 1000000,
    ratingAvg: 4.8,
    reviewCount: 89,
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "s-fallback-3",
    vendorId: "u-vendor-3",
    title: "DJ & Sangeet Entertainment",
    description:
      "High-energy DJ sets, sangeet choreography coordination, LED dance floor setup, and live emcee for all events.",
    category: "music-dj",
    city: "Bangalore",
    priceMin: 75000,
    priceMax: 300000,
    ratingAvg: 4.7,
    reviewCount: 67,
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "s-fallback-4",
    vendorId: "u-vendor-1",
    title: "Bridal Makeup & Styling",
    description:
      "HD/airbrush bridal makeup for all functions — mehndi, sangeet, wedding day, and reception. Includes draping and hair.",
    category: "makeup",
    city: "Mumbai",
    priceMin: 40000,
    priceMax: 200000,
    ratingAvg: 4.9,
    reviewCount: 234,
    coverImage: "https://images.unsplash.com/photo-1600038938045-b5fadbc55083?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "s-fallback-5",
    vendorId: "u-vendor-2",
    title: "Premium Wedding Catering",
    description:
      "Multi-cuisine buffet and plated service — North Indian, South Indian, Chinese, and live counters. ₹1,200-2,800 per plate.",
    category: "catering",
    city: "Delhi",
    priceMin: 350000,
    priceMax: 900000,
    ratingAvg: 4.6,
    reviewCount: 178,
    coverImage: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "s-fallback-6",
    vendorId: "u-vendor-3",
    title: "Mehndi Artist — Bridal & Guests",
    description:
      "Intricate bridal mehndi (both hands and feet) plus guest mehndi service for up to 50 guests. Arabic and Rajasthani styles.",
    category: "mehndi",
    city: "Jaipur",
    priceMin: 15000,
    priceMax: 80000,
    ratingAvg: 4.8,
    reviewCount: 92,
    coverImage: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=800&h=600&fit=crop&q=80",
  },
];

const fallbackCategories: CategoryItem[] = [
  {
    id: "c-1",
    name: "Venues",
    slug: "venues",
    description: "Banquet halls, garden lawns, heritage palaces, resorts, and farmhouse venues.",
  },
  {
    id: "c-2",
    name: "Photography",
    slug: "photography",
    description: "Candid photography, cinematic films, drone coverage, and pre-wedding shoots.",
  },
  {
    id: "c-3",
    name: "Catering",
    slug: "catering",
    description: "Multi-cuisine buffets, plated service, live counters, and beverage packages.",
  },
  {
    id: "c-4",
    name: "Decor",
    slug: "decor",
    description: "Mandap design, floral installations, stage setup, and theme styling.",
  },
  {
    id: "c-5",
    name: "Makeup",
    slug: "makeup",
    description: "Bridal makeup, airbrush HD, hair styling, and draping for all functions.",
  },
  {
    id: "c-6",
    name: "Music & DJ",
    slug: "music-dj",
    description: "DJ sets, live bands, sangeet entertainment, and sound system rental.",
  },
  {
    id: "c-7",
    name: "Mehndi",
    slug: "mehndi",
    description: "Bridal mehndi, guest mehndi, Arabic and Rajasthani designs.",
  },
  {
    id: "c-8",
    name: "Wedding Planning",
    slug: "planning",
    description: "End-to-end coordination, day-of management, and destination wedding planning.",
  },
];

const fallbackVendors: VendorItem[] = [
  { id: "u-vendor-1", fullName: "Golden Lens Studio", phone: "+91 98200 12345" },
  { id: "u-vendor-2", fullName: "Marigold Events Co.", phone: "+91 98110 56789" },
  { id: "u-vendor-3", fullName: "Shagun Celebrations", phone: "+91 99001 78900" },
];

function normalizeAmenities(value: Database["public"]["Tables"]["venues"]["Row"]["amenities"]): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry));
  }
  if (value && typeof value === "object") {
    return Object.entries(value)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([key]) => key);
  }
  return [];
}

function getPublicClient() {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  return db();
}

export async function getVenueResults(filters: {
  city?: string;
  minCapacity?: number;
  maxPrice?: number;
}) {
  const db = getPublicClient();
  if (!db) {
    return filterVenues(fallbackVenues, filters);
  }

  try {
    let query = db
      .from("venues")
      .select(
        "id,vendor_id,name,description,city,country,capacity_min,capacity_max,price_per_day,rating_avg,review_count,cover_image,amenities"
      )
      .eq("is_approved", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(40);

    if (filters.city) {
      query = query.ilike("city", `%${filters.city}%`);
    }
    if (typeof filters.minCapacity === "number" && Number.isFinite(filters.minCapacity)) {
      query = query.gte("capacity_max", filters.minCapacity);
    }
    if (typeof filters.maxPrice === "number" && Number.isFinite(filters.maxPrice)) {
      query = query.lte("price_per_day", filters.maxPrice);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return filterVenues(fallbackVenues, filters);
    }

    const mapped: VenueItem[] = data.map((venue) => ({
      id: venue.id,
      vendorId: venue.vendor_id,
      name: venue.name,
      description: venue.description,
      city: venue.city,
      country: venue.country,
      capacityMin: venue.capacity_min,
      capacityMax: venue.capacity_max,
      pricePerDay: venue.price_per_day,
      ratingAvg: venue.rating_avg,
      reviewCount: venue.review_count,
      coverImage: venue.cover_image,
      amenities: normalizeAmenities(venue.amenities),
    }));

    return mapped;
  } catch {
    return filterVenues(fallbackVenues, filters);
  }
}

export async function getVenueById(id: string) {
  const db = getPublicClient();
  if (!db) {
    return fallbackVenues.find((venue) => venue.id === id) ?? null;
  }

  try {
    const { data, error } = await db
      .from("venues")
      .select(
        "id,vendor_id,name,description,city,country,capacity_min,capacity_max,price_per_day,rating_avg,review_count,cover_image,amenities"
      )
      .eq("id", id)
      .eq("is_approved", true)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return fallbackVenues.find((venue) => venue.id === id) ?? null;
    }

    return {
      id: data.id,
      vendorId: data.vendor_id,
      name: data.name,
      description: data.description,
      city: data.city,
      country: data.country,
      capacityMin: data.capacity_min,
      capacityMax: data.capacity_max,
      pricePerDay: data.price_per_day,
      ratingAvg: data.rating_avg,
      reviewCount: data.review_count,
      coverImage: data.cover_image,
      amenities: normalizeAmenities(data.amenities),
    } satisfies VenueItem;
  } catch {
    return fallbackVenues.find((venue) => venue.id === id) ?? null;
  }
}

export async function getServiceResults(filters: {
  city?: string;
  category?: string;
  maxPrice?: number;
}) {
  const db = getPublicClient();
  if (!db) {
    return filterServices(fallbackServices, filters);
  }

  try {
    let query = db
      .from("services")
      .select(
        "id,vendor_id,title,description,category,city,price_min,price_max,rating_avg,review_count,cover_image"
      )
      .eq("is_approved", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(40);

    if (filters.city) {
      query = query.ilike("city", `%${filters.city}%`);
    }
    if (filters.category) {
      query = query.eq("category", filters.category);
    }
    if (typeof filters.maxPrice === "number" && Number.isFinite(filters.maxPrice)) {
      query = query.lte("price_max", filters.maxPrice);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return filterServices(fallbackServices, filters);
    }

    return data.map((service) => ({
      id: service.id,
      vendorId: service.vendor_id,
      title: service.title,
      description: service.description,
      category: service.category,
      city: service.city,
      priceMin: service.price_min,
      priceMax: service.price_max,
      ratingAvg: service.rating_avg,
      reviewCount: service.review_count,
      coverImage: service.cover_image,
    })) satisfies ServiceItem[];
  } catch {
    return filterServices(fallbackServices, filters);
  }
}

export async function getServiceById(id: string) {
  const db = getPublicClient();
  if (!db) {
    return fallbackServices.find((service) => service.id === id) ?? null;
  }

  try {
    const { data, error } = await db
      .from("services")
      .select(
        "id,vendor_id,title,description,category,city,price_min,price_max,rating_avg,review_count,cover_image"
      )
      .eq("id", id)
      .eq("is_approved", true)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return fallbackServices.find((service) => service.id === id) ?? null;
    }

    return {
      id: data.id,
      vendorId: data.vendor_id,
      title: data.title,
      description: data.description,
      category: data.category,
      city: data.city,
      priceMin: data.price_min,
      priceMax: data.price_max,
      ratingAvg: data.rating_avg,
      reviewCount: data.review_count,
      coverImage: data.cover_image,
    } satisfies ServiceItem;
  } catch {
    return fallbackServices.find((service) => service.id === id) ?? null;
  }
}

export async function getVendorById(id: string) {
  const db = getPublicClient();
  if (!db) {
    return fallbackVendors.find((vendor) => vendor.id === id) ?? null;
  }

  try {
    const { data, error } = await db
      .from("users")
      .select("id,full_name,phone")
      .eq("id", id)
      .eq("role", "vendor")
      .single();

    if (error || !data) {
      return fallbackVendors.find((vendor) => vendor.id === id) ?? null;
    }

    return {
      id: data.id,
      fullName: data.full_name,
      phone: data.phone,
    } satisfies VendorItem;
  } catch {
    return fallbackVendors.find((vendor) => vendor.id === id) ?? null;
  }
}

export async function getVendorServices(vendorId: string) {
  const services = await getServiceResults({});
  return services.filter((service) => service.vendorId === vendorId);
}

export async function getVendorVenues(vendorId: string) {
  const venues = await getVenueResults({});
  return venues.filter((venue) => venue.vendorId === vendorId);
}

export async function getCategories() {
  const db = getPublicClient();
  if (!db) {
    return fallbackCategories;
  }

  try {
    const { data, error } = await db
      .from("categories")
      .select("id,name,slug,description")
      .eq("is_approved", true)
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackCategories;
    }

    return data.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
    })) satisfies CategoryItem[];
  } catch {
    return fallbackCategories;
  }
}

export async function getBookingsForCouple(coupleId: string) {
  const db = getPublicClient();
  if (!db) {
    return [] as BookingListItem[];
  }

  try {
    const { data: bookings, error } = await db
      .from("bookings")
      .select(
        "id,status,booking_date,total_amount,platform_fee,vendor_payout,notes,created_at,venue_id,service_id,vendor_id,couple_id,stripe_payment_intent_id"
      )
      .eq("couple_id", coupleId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error || !bookings || bookings.length === 0) {
      return [] as BookingListItem[];
    }

    return hydrateBookings(db, bookings);
  } catch {
    return [] as BookingListItem[];
  }
}

export async function getBookingsForVendor(vendorId: string) {
  const db = getPublicClient();
  if (!db) {
    return [] as BookingListItem[];
  }

  try {
    const { data: bookings, error } = await db
      .from("bookings")
      .select(
        "id,status,booking_date,total_amount,platform_fee,vendor_payout,notes,created_at,venue_id,service_id,vendor_id,couple_id,stripe_payment_intent_id"
      )
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error || !bookings || bookings.length === 0) {
      return [] as BookingListItem[];
    }

    return hydrateBookings(db, bookings);
  } catch {
    return [] as BookingListItem[];
  }
}

export async function getBookingsForAdmin() {
  const db = getPublicClient();
  if (!db) {
    return [] as BookingListItem[];
  }

  try {
    const { data: bookings, error } = await db
      .from("bookings")
      .select(
        "id,status,booking_date,total_amount,platform_fee,vendor_payout,notes,created_at,venue_id,service_id,vendor_id,couple_id,stripe_payment_intent_id"
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (error || !bookings || bookings.length === 0) {
      return [] as BookingListItem[];
    }

    return hydrateBookings(db, bookings);
  } catch {
    return [] as BookingListItem[];
  }
}

async function hydrateBookings(
  dbClient: ReturnType<typeof db>,
  bookings: Array<
    Pick<
      Database["public"]["Tables"]["bookings"]["Row"],
      | "id"
      | "status"
      | "booking_date"
      | "total_amount"
      | "platform_fee"
      | "vendor_payout"
      | "notes"
      | "created_at"
      | "venue_id"
      | "service_id"
      | "vendor_id"
      | "couple_id"
      | "stripe_payment_intent_id"
    >
  >
) {
  const venueIds = Array.from(new Set(bookings.map((booking) => booking.venue_id).filter(Boolean))) as string[];
  const serviceIds = Array.from(new Set(bookings.map((booking) => booking.service_id).filter(Boolean))) as string[];
  const userIds = Array.from(
    new Set(bookings.flatMap((booking) => [booking.vendor_id, booking.couple_id]))
  );

  const [venuesRes, servicesRes, usersRes] = await Promise.all([
    venueIds.length
      ? dbClient.from("venues").select("id,name").in("id", venueIds)
      : Promise.resolve({ data: [] as Array<{ id: string; name: string }>, error: null }),
    serviceIds.length
      ? dbClient.from("services").select("id,title").in("id", serviceIds)
      : Promise.resolve({ data: [] as Array<{ id: string; title: string }>, error: null }),
    userIds.length
      ? dbClient.from("users").select("id,full_name").in("id", userIds)
      : Promise.resolve({ data: [] as Array<{ id: string; full_name: string }>, error: null }),
  ]);

  const venueMap = new Map((venuesRes.data ?? []).map((venue) => [venue.id, venue.name]));
  const serviceMap = new Map((servicesRes.data ?? []).map((service) => [service.id, service.title]));
  const userMap = new Map((usersRes.data ?? []).map((user) => [user.id, user.full_name]));

  return bookings.map((booking) => ({
    id: booking.id,
    status: booking.status,
    bookingDate: booking.booking_date,
    totalAmount: booking.total_amount,
    platformFee: booking.platform_fee,
    vendorPayout: booking.vendor_payout,
    notes: booking.notes,
    createdAt: booking.created_at,
    venueId: booking.venue_id,
    serviceId: booking.service_id,
    vendorId: booking.vendor_id,
    coupleId: booking.couple_id,
    venueName: booking.venue_id ? (venueMap.get(booking.venue_id) ?? null) : null,
    serviceTitle: booking.service_id ? (serviceMap.get(booking.service_id) ?? null) : null,
    vendorName: userMap.get(booking.vendor_id) ?? "Vendor",
    coupleName: userMap.get(booking.couple_id) ?? "Couple",
    paymentReference: booking.stripe_payment_intent_id,
  })) satisfies BookingListItem[];
}

function filterVenues(
  venues: VenueItem[],
  filters: { city?: string; minCapacity?: number; maxPrice?: number }
) {
  return venues.filter((venue) => {
    if (filters.city && !venue.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    if (typeof filters.minCapacity === "number" && venue.capacityMax < filters.minCapacity) {
      return false;
    }
    if (typeof filters.maxPrice === "number" && venue.pricePerDay > filters.maxPrice) {
      return false;
    }
    return true;
  });
}

function filterServices(
  services: ServiceItem[],
  filters: { city?: string; category?: string; maxPrice?: number }
) {
  return services.filter((service) => {
    if (filters.city && !service.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    if (filters.category && service.category !== filters.category) {
      return false;
    }
    if (typeof filters.maxPrice === "number" && service.priceMax > filters.maxPrice) {
      return false;
    }
    return true;
  });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
