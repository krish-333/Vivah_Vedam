import type { Metadata } from "next";
import { SignupForm } from "@/components/forms/signup-form";

export const metadata: Metadata = {
  title: "Create Account — Vivah Vedam",
  description: "Join Vivah Vedam and start planning your perfect wedding.",
};

export default function SignupPage() {
  return <SignupForm />;
}
