import type { Metadata } from "next"
import { HomePage } from "./HomePage"

export const metadata: Metadata = {
  title: "Home - Family ID Gujarat | Beneficiary Management Portal",
  description: "Official Gujarat Government portal for Family ID creation, verification, member management, and scheme eligibility.",
}

export default function Page() {
  return <HomePage />
}
