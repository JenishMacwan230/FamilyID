import type { Metadata } from "next"
import { SchemesPage } from "@/components/SchemesPage"

export const metadata: Metadata = {
  title: "Eligible Schemes - Family ID Gujarat | Welfare Database",
  description: "Search and filter eligible government schemes for your family including MA Yojana, MYSY, Krishi Sahay, and PMAY.",
}

export default function Page() {
  return <SchemesPage />
}
