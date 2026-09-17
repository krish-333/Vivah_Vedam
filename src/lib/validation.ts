import { z } from "zod";

export const bookingCreateSchema = z.object({
  bookingType: z.enum(["venue", "service"]),
  listingId: z.uuid(),
  bookingDate: z.iso.date(),
  notes: z.string().trim().max(2000).optional().default(""),
  returnTo: z.string().optional(),
});

export const bookingStatusSchema = z.object({
  bookingId: z.uuid(),
  action: z.enum([
    "confirm",
    "decline",
    "complete",
    "cancel",
    "pay",
    "admin_confirm",
    "admin_cancel",
  ]),
  returnTo: z.string().optional(),
});

export const journeyInitSchema = z.object({
  returnTo: z.string().optional(),
});

export const journeyStatusSchema = z.object({
  stepId: z.uuid(),
  action: z.enum(["complete", "activate", "skip"]),
  returnTo: z.string().optional(),
});

export const messageConversationSchema = z.object({
  targetUserId: z.uuid(),
  asRole: z.enum(["couple", "vendor"]),
  returnTo: z.string().optional(),
});

export const messageSendSchema = z.object({
  conversationId: z.uuid(),
  content: z.string().trim().min(1).max(4000),
  returnTo: z.string().optional(),
});

export const messageReadSchema = z.object({
  conversationId: z.uuid(),
  returnTo: z.string().optional(),
});

export const vendorListingSchema = z
  .object({
    listingType: z.enum(["venue", "service"]),
    returnTo: z.string().optional(),
    name: z.string().trim().min(2).max(120).optional(),
    title: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().min(2).max(3000).optional(),
    category: z.string().trim().min(2).max(80).optional(),
    city: z.string().trim().min(2).max(120),
    state: z.string().trim().max(80).optional(),
    country: z.string().trim().max(80).optional(),
    address: z.string().trim().max(240).optional(),
    capacityMin: z.coerce.number().int().min(1).optional(),
    capacityMax: z.coerce.number().int().min(1).optional(),
    pricePerDay: z.coerce.number().min(1).optional(),
    priceMin: z.coerce.number().min(1).optional(),
    priceMax: z.coerce.number().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.listingType === "venue") {
      if (!data.name) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["name"], message: "Name is required" });
      if (!data.capacityMin) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["capacityMin"], message: "capacityMin is required" });
      if (!data.capacityMax) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["capacityMax"], message: "capacityMax is required" });
      if (!data.pricePerDay) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["pricePerDay"], message: "pricePerDay is required" });
      if (data.capacityMin && data.capacityMax && data.capacityMax < data.capacityMin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["capacityMax"],
          message: "capacityMax must be greater than or equal to capacityMin",
        });
      }
    }

    if (data.listingType === "service") {
      if (!data.title) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["title"], message: "Title is required" });
      if (!data.category) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["category"], message: "Category is required" });
      if (!data.priceMin) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["priceMin"], message: "priceMin is required" });
      if (!data.priceMax) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["priceMax"], message: "priceMax is required" });
      if (data.priceMin && data.priceMax && data.priceMax < data.priceMin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["priceMax"],
          message: "priceMax must be greater than or equal to priceMin",
        });
      }
    }
  });

export const adminModerateSchema = z.object({
  action: z.enum([
    "approve_venue",
    "reject_venue",
    "approve_service",
    "reject_service",
    "approve_category",
    "reject_category",
    "remove_review",
  ]),
  targetId: z.uuid(),
  returnTo: z.string().optional(),
});

export const accountProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(32).optional().default(""),
  avatarUrl: z.url().optional().or(z.literal("")),
  returnTo: z.string().optional(),
});

export const vendorBusinessProfileSchema = z.object({
  businessName: z.string().trim().min(2).max(160).optional().default(""),
  description: z.string().trim().max(3000).optional().default(""),
  city: z.string().trim().max(120).optional().default(""),
  address: z.string().trim().max(240).optional().default(""),
  serviceRadiusKm: z.coerce.number().int().min(0).max(1000).optional(),
  websiteUrl: z.url().optional().or(z.literal("")),
  instagramUrl: z.url().optional().or(z.literal("")),
  gstin: z.string().trim().max(20).optional().default(""),
  bankAccountName: z.string().trim().max(160).optional().default(""),
  bankAccountNumber: z.string().trim().max(34).optional().default(""), // only last 4 are persisted
  bankIfsc: z.string().trim().max(20).optional().default(""),
  upiId: z.string().trim().max(80).optional().default(""),
  returnTo: z.string().optional(),
});

export const vendorAvailabilityWeeklySchema = z.object({
  // present in the form data only for days the vendor left checked
  weekday0: z.coerce.boolean().optional(),
  weekday1: z.coerce.boolean().optional(),
  weekday2: z.coerce.boolean().optional(),
  weekday3: z.coerce.boolean().optional(),
  weekday4: z.coerce.boolean().optional(),
  weekday5: z.coerce.boolean().optional(),
  weekday6: z.coerce.boolean().optional(),
  returnTo: z.string().optional(),
});

export const vendorAvailabilityOverrideCreateSchema = z.object({
  date: z.iso.date(),
  isAvailable: z.enum(["true", "false"]),
  reason: z.string().trim().max(200).optional().default(""),
  returnTo: z.string().optional(),
});

export const vendorAvailabilityOverrideDeleteSchema = z.object({
  overrideId: z.uuid(),
  returnTo: z.string().optional(),
});

export const adminVendorVerifySchema = z.object({
  vendorId: z.uuid(),
  action: z.enum(["verify", "reject"]),
  notes: z.string().trim().max(1000).optional().default(""),
  returnTo: z.string().optional(),
});

export const adminVendorContractSchema = z.object({
  vendorId: z.uuid(),
  status: z.enum(["draft", "active", "expired", "terminated"]),
  commissionRate: z.coerce.number().min(0).max(100),
  payoutTerms: z.string().trim().max(2000).optional().default(""),
  startDate: z.iso.date().optional().or(z.literal("")),
  endDate: z.iso.date().optional().or(z.literal("")),
  notes: z.string().trim().max(4000).optional().default(""),
  returnTo: z.string().optional(),
});
