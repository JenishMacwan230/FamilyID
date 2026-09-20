import type { Metadata } from "next"
import { LoginPage } from "@/components/LoginPage"

export const metadata: Metadata = {
  title: "Head of Family Login - Family ID Gujarat",
  description: "Sign in using Mobile Number OTP or Family ID OTP to manage your family profile and welfare applications.",
}

export default function Page() {
  return <LoginPage />
}
