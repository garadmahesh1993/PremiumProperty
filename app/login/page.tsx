import type { Metadata } from "next";
import { AuthExperience } from "@/components/auth/AuthExperience";

export const metadata: Metadata = { title: "Log in", description: "Log in to your PremiumProperty account." };

export default function LoginPage() {
  return <AuthExperience initialMode="login"/>;
}
