"use client"

import React from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Users, FileLock, Layers, GitFork, UserCheck, CheckCircle2, Lock } from "lucide-react"

const portalObjectives = [
  {
    icon: ShieldCheck,
    title: "1. Family ID & Head Verification",
    description: "A head of family creates the Family ID linked with mobile OTP verification and residential proof.",
  },
  {
    icon: GitFork,
    title: "2. Family Unit Sub-Division",
    description: "Derive a new family unit from an existing parent family record seamlessly without duplicate data entry.",
  },
  {
    icon: Users,
    title: "3. Comprehensive Family CRUD",
    description: "Manage household address, members, annual income, caste, religion, government official status, and abroad members.",
  },
  {
    icon: Layers,
    title: "4. Automated Scheme Matching",
    description: "Instant evaluation of eligible welfare schemes for the whole family or specific family members.",
  },
  {
    icon: UserCheck,
    title: "5. Strict Member Deduplication",
    description: "Cross-system check guaranteeing that 1 citizen cannot belong to more than 1 family ID across Gujarat.",
  },
  {
    icon: FileLock,
    title: "6. Single Benefit Rule",
    description: "Ensures duplicate claims are automatically blocked so welfare reaches every eligible household fairly.",
  },
  {
    icon: Lock,
    title: "7. Zero Unwanted Surveillance",
    description: "Strict privacy safeguards. Government officials cannot view family data unless you explicitly apply for a scheme or request verification.",
  },
]

export function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <Badge variant="solidOrange" className="text-xs font-bold uppercase tracking-wider px-3 py-1">
            Government Mandate
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            About <span className="text-orange-400">Family ID Gujarat</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Introduction of Family ID in Gujarat to improve beneficiary management, streamline government welfare delivery, and safeguard citizen privacy.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Mission Statement */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="max-w-3xl space-y-4">
            <Badge variant="orange">Vision & Mission</Badge>
            <h2 className="text-3xl font-extrabold text-slate-900">
              One Family, One Identity, Equal Opportunity
            </h2>
            <p className="text-slate-600 leading-relaxed">
              The Family ID system acts as a single, authentic, and verified family database for Gujarat state. It eliminates paperwork for scheme applications, prevents fraudulent double-dipping of benefits, and respects strict citizen data privacy.
            </p>
          </div>
        </div>

        {/* Core Rules & Specifications */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">System Functional Specifications</h3>
            <p className="text-sm text-slate-600">Overview of official governance rules and capabilities implemented in the portal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portalObjectives.map((obj, idx) => {
              const Icon = obj.icon
              return (
                <Card key={idx} className="bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      {obj.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-600 pt-1 leading-relaxed">
                      {obj.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Privacy Highlight Card */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-2xl p-8 border border-blue-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 font-bold text-sm uppercase">Citizen Privacy Commitment</span>
            </div>
            <h4 className="text-2xl font-bold">Government Data Access Policy</h4>
            <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
              Under strict state privacy guidelines, your family records cannot be inspected or browsed by government officials unless you formally submit a benefit application or request official verification.
            </p>
          </div>
          <Badge variant="solidOrange" className="text-sm px-4 py-2 font-bold shrink-0">
            ENCRYPTED & COMPLIANT
          </Badge>
        </div>

      </main>

      <Footer />
    </div>
  )
}
