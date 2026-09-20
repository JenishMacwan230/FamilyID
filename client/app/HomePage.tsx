"use client"

import React from "react"
import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/HeroSection"
import { QuickServices } from "@/components/QuickServices"
import { SchemeHighlights } from "@/components/SchemeHighlights"
import { Footer } from "@/components/Footer"

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        {/* <QuickServices />
        <SchemeHighlights /> */}
      </main>
      <Footer />
    </div>
  )
}
