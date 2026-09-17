import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock the useUser hook to return a logged-out state
vi.mock("@/hooks/use-user", () => ({
  useUser: vi.fn(() => ({
    authUser: null,
    profile: null,
    loading: false,
  })),
}));

// Stub fetch (Navbar's sign-out calls /api/auth/logout directly)
vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }));

import { Navbar } from "@/components/layouts/navbar";

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Vivah Vedam brand name", () => {
    render(<Navbar />);
    expect(screen.getByText("vivah")).toBeInTheDocument();
    expect(screen.getByText("vedam")).toBeInTheDocument();
  });

  it("shows Sign In and Get Started buttons when not authenticated", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /get started/i })).toBeInTheDocument();
  });
});
