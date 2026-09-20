import type { Metadata } from "next"
import { AboutPage } from "@/components/AboutPage"

export const metadata: Metadata = {
  title: "About Portal - Family ID Gujarat | Beneficiary System Overview",
  description: "Learn about Gujarat State's Family ID initiative for beneficiary management, deduplication, and privacy-first welfare delivery.",
}

export default function Page() {
  return <AboutPage />
}
