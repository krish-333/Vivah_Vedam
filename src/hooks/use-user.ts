"use client";

import { useState, useEffect, useCallback } from "react";
import type { Tables } from "@/types";

export type AuthUser = { id: string; email: string };

// Client-side auth state helper. Login/signup/logout each dispatch a "vv-auth-changed" window event right after they
// resolve, and this hook just re-fetches /api/auth/me when it hears one.
export function useUser() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Tables<"users"> | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      setAuthUser(json.user ?? null);
      setProfile(json.profile ?? null);
    } catch {
      setAuthUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("vv-auth-changed", refresh);
    return () => window.removeEventListener("vv-auth-changed", refresh);
  }, [refresh]);

  return { authUser, profile, loading };
}
