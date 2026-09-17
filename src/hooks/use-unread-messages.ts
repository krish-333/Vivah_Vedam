"use client";

import { useEffect, useState, useCallback } from "react";

export function useUnreadMessages() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/messages/unread-count");
      const json = await res.json();
      setCount(json.count ?? 0);
    } catch {
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    window.addEventListener("vv-auth-changed", load);
    return () => window.removeEventListener("vv-auth-changed", load);
  }, [load]);

  return { count, loading };
}
