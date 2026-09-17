export type {
  Database,
  UserRole,
  WeddingStatus,
  BookingStatus,
  PriceType,
  JourneyStepStatus,
  VendorVerificationStatus,
  ContractStatus,
  Json,
} from "./database.types";

import type { Database } from "./database.types";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
