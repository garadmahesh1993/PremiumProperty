import type { Metadata } from "next";
import { AuthExperience } from "@/components/auth/AuthExperience";

export const metadata: Metadata = { title: "Create an account", description: "Create a PremiumProperty account to save homes and start a property listing draft." };

export default function SignupPage() {
  return <AuthExperience initialMode="signup"/>;
}
