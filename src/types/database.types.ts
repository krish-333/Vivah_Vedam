export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "couple" | "vendor" | "admin";
export type WeddingStatus = "planning" | "confirmed" | "completed" | "cancelled";
export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "disputed";
export type PriceType = "fixed" | "hourly" | "custom";
export type JourneyStepStatus = "upcoming" | "active" | "completed" | "skipped";
export type VendorVerificationStatus = "pending" | "verified" | "rejected";
export type ContractStatus = "draft" | "active" | "expired" | "terminated";

export interface Database {
  public: {
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string | null;
          oauth_provider: string | null;
          oauth_id: string | null;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          role: UserRole;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
        Relationships: [];
      };
      weddings: {
        Row: {
          id: string;
          couple_id: string;
          partner_1_name: string;
          partner_2_name: string;
          wedding_date: string;
          city: string;
          guest_count: number;
          budget_total: number;
          budget_spent: number;
          status: WeddingStatus;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["weddings"]["Row"], "id" | "budget_spent" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["weddings"]["Insert"]>;
        Relationships: [];
      };
      venues: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          description: string;
          address: string;
          city: string;
          state: string;
          country: string;
          capacity_min: number;
          capacity_max: number;
          price_per_day: number;
          amenities: Json;
          photos: string[];
          cover_image: string;
          rating_avg: number;
          review_count: number;
          is_approved: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["venues"]["Row"], "id" | "rating_avg" | "review_count" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["venues"]["Insert"]>;
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          vendor_id: string;
          title: string;
          description: string;
          category: string;
          price_type: PriceType;
          price_min: number;
          price_max: number;
          portfolio_images: string[];
          cover_image: string;
          city: string;
          service_radius_km: number;
          rating_avg: number;
          review_count: number;
          is_approved: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["services"]["Row"], "id" | "rating_avg" | "review_count" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          wedding_id: string;
          venue_id: string | null;
          service_id: string | null;
          vendor_id: string;
          couple_id: string;
          booking_date: string;
          status: BookingStatus;
          total_amount: number;
          platform_fee: number;
          vendor_payout: number;
          stripe_payment_intent_id: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          reviewer_id: string;
          vendor_id: string;
          rating: number;
          title: string;
          body: string;
          is_verified: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          couple_id: string;
          vendor_id: string;
          booking_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["conversations"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };
      journey_steps: {
        Row: {
          id: string;
          wedding_id: string;
          step_type: string;
          title: string;
          description: string;
          status: JourneyStepStatus;
          order_index: number;
          recommended_deadline: string;
          completed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["journey_steps"]["Row"], "id" | "completed_at">;
        Update: Partial<Database["public"]["Tables"]["journey_steps"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string;
          description: string;
          is_system: boolean;
          is_approved: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      venue_availability: {
        Row: {
          id: string;
          venue_id: string;
          date: string;
          is_available: boolean;
          blocked_reason: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["venue_availability"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["venue_availability"]["Insert"]>;
        Relationships: [];
      };
      admin_audit_log: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          target_type: string;
          target_id: string;
          details: Json;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_audit_log"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["admin_audit_log"]["Insert"]>;
        Relationships: [];
      };
      vendor_profiles: {
        Row: {
          vendor_id: string;
          business_name: string | null;
          description: string | null;
          city: string | null;
          address: string | null;
          service_radius_km: number | null;
          logo_url: string | null;
          cover_image_url: string | null;
          website_url: string | null;
          instagram_url: string | null;
          gstin: string | null;
          bank_account_name: string | null;
          bank_account_number_last4: string | null;
          bank_ifsc: string | null;
          upi_id: string | null;
          verification_status: VendorVerificationStatus;
          verification_notes: string | null;
          verified_at: string | null;
          verified_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Omit<Database["public"]["Tables"]["vendor_profiles"]["Row"], "vendor_id">> & {
          vendor_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["vendor_profiles"]["Insert"]>;
        Relationships: [];
      };
      vendor_contracts: {
        Row: {
          id: string;
          vendor_id: string;
          status: ContractStatus;
          commission_rate: number;
          payout_terms: string | null;
          start_date: string | null;
          end_date: string | null;
          notes: string | null;
          pdf_url: string | null;
          pdf_uploaded_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Omit<Database["public"]["Tables"]["vendor_contracts"]["Row"], "vendor_id">> & {
          vendor_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["vendor_contracts"]["Insert"]>;
        Relationships: [];
      };
      vendor_availability_weekly: {
        Row: {
          vendor_id: string;
          weekday: number;
          is_available: boolean;
        };
        Insert: Database["public"]["Tables"]["vendor_availability_weekly"]["Row"];
        Update: Partial<Database["public"]["Tables"]["vendor_availability_weekly"]["Insert"]>;
        Relationships: [];
      };
      vendor_availability_overrides: {
        Row: {
          id: string;
          vendor_id: string;
          date: string;
          is_available: boolean;
          reason: string | null;
          created_at: string;
        };
        Insert: Partial<Omit<Database["public"]["Tables"]["vendor_availability_overrides"]["Row"], "vendor_id" | "date">> & {
          vendor_id: string;
          date: string;
        };
        Update: Partial<Database["public"]["Tables"]["vendor_availability_overrides"]["Insert"]>;
        Relationships: [];
      };
    };
  };
}
