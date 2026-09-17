export function safeReturnTo(rawValue: unknown, fallback: string) {
  if (typeof rawValue !== "string") {
    return fallback;
  }

  const value = rawValue.trim();
  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(value, "http://localhost");
    return `${url.pathname}${url.search}`;
  } catch {
    return fallback;
  }
}
