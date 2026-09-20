import type { Metadata } from "next"
import { DashboardPage } from "@/components/DashboardPage"

export const metadata: Metadata = {
  title: "Citizen Dashboard - Family ID Gujarat",
  description: "View your verified Gujarat Family ID profile, family members list, active welfare benefits, and application details.",
}

export default function Page() {
  return <DashboardPage />
}
