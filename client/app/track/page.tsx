import type { Metadata } from "next"
import { TrackApplicationPage } from "@/components/TrackApplicationPage"

export const metadata: Metadata = {
  title: "Track Application Status - Family ID Gujarat",
  description: "Track your Gujarat Family ID application status, document verification progress, and notifications.",
}

export default function Page() {
  return <TrackApplicationPage />
}
