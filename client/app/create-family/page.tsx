import type { Metadata } from "next"
import { CreateFamilyPage } from "@/components/CreateFamilyPage"

export const metadata: Metadata = {
  title: "Create Family ID Application - Family ID Gujarat",
  description: "Register a new Gujarat Family ID with head mobile verification, member details, income, caste, and document proof uploads.",
}

export default function Page() {
  return <CreateFamilyPage />
}
