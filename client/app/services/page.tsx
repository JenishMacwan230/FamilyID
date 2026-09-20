import type { Metadata } from "next"
import { ServicesPage } from "@/components/ServicesPage"

export const metadata: Metadata = {
  title: "Services - Family ID Gujarat | Family Registration & Management",
  description: "Explore services for Family ID creation, verification, family splitting, updating member details, and checking scheme eligibility.",
}

export default function Page() {
  return <ServicesPage />
}
