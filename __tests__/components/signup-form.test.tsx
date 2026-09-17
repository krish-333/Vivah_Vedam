import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}));

// Stub fetch (SignupForm now calls /api/auth/signup directly)
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: "u1", role: "couple" } }),
    })
  );
});

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

import { SignupForm } from "@/components/forms/signup-form";

describe("SignupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders name, email, and password inputs", () => {
    render(<SignupForm />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders role selection with couple and vendor options", () => {
    render(<SignupForm />);
    expect(screen.getByText(/couple/i)).toBeInTheDocument();
    expect(screen.getByText(/vendor/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<SignupForm />);
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });
});
