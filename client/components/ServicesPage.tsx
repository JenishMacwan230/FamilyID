"use client"

import React from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, GitFork, UserPen, Award, CheckCircle, ShieldAlert, Trash2, ArrowRight, FileCheck } from "lucide-react"

const allServices = [
  {
    icon: PlusCircle,
    badge: "Registration",
    title: "Create Family ID + Verification",
    description: "Register head of family with mobile OTP verification, Aadhaar linking, and initial residence proof upload.",
    features: ["Head of Family Mobile OTP", "Aadhaar Card Linkage", "Address & Residence Proof"],
    color: "bg-blue-600",
  },
  {
    icon: GitFork,
    badge: "Sub-Division",
    title: "Split Family Unit",
    description: "Create a new family ID derived from an existing family unit (e.g. after marriage or household split).",
    features: ["Derive from Parent Family ID", "No Data Re-entry Required", "Instant Relationship Transfer"],
    color: "bg-orange-500",
  },
  {
    icon: UserPen,
    badge: "Member CRUD",
    title: "Update Family Details",
    description: "Update address, add/remove members, update household income, caste, religion, or flag government officials.",
    features: ["Add / Remove Members", "Income & Caste Updates", "Govt Official & Abroad Flag"],
    color: "bg-blue-700",
  },
  {
    icon: Trash2,
    badge: "Deletion",
    title: "Delete Family ID",
    description: "Request deactivation or deletion of duplicate/unclaimed family IDs with mandatory admin verification.",
    features: ["Reason for Deletion", "Admin Verification Step", "Audit Trail Recorded"],
    color: "bg-red-500",
  },
  {
    icon: Award,
    badge: "Eligibility",
    title: "Check Scheme Benefits",
    description: "Discover all government schemes you or specific family members qualify for based on demographics.",
    features: ["Family & Member Level", "Automated Benefit Matching", "Single Benefit Enforcement"],
    color: "bg-orange-600",
  },
  {
    icon: CheckCircle,
    badge: "Anti-Duplication",
    title: "Member Deduplication Check",
    description: "Advanced validation ensuring no single citizen can belong to more than one family ID across Gujarat.",
    features: ["Cross-Database Search", "Biometric & Aadhaar Match", "Real-time Alert"],
    color: "bg-blue-800",
  },
  {
    icon: ShieldAlert,
    badge: "Data Privacy",
    title: "Government Access Protection",
    description: "Government officials cannot view your family data until and unless you explicitly apply for a scheme.",
    features: ["Explicit Consent Model", "Encrypted Storage", "Privacy Compliance"],
    color: "bg-orange-700",
  },
  {
    icon: FileCheck,
    badge: "Proof Upload",
    title: "Document Verification Hub",
    description: "Upload and manage income certificates, ration cards, caste certificates, and utility bills.",
    features: ["OCR Extraction", "Digital Locker Sync", "Verification Status Tracker"],
    color: "bg-blue-600",
  }
]

export function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
      <Navbar />
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <Badge variant="solidOrange" className="text-xs font-bold uppercase tracking-wider px-3 py-1">
            Gujarat Citizen Portal
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Family ID <span className="text-orange-400">Services & Operations</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Explore all available services for registering family units, updating member details, splitting families, and managing welfare scheme access.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allServices.map((service, idx) => {
            const Icon = service.icon
            return (
              <Card key={idx} className="bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between">
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <div className={`w-12 h-12 rounded-xl ${service.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline">{service.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 pt-1">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Highlights</p>
                  {service.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="pt-4 border-t border-slate-100">
                  <Button variant="default" className="w-full text-xs font-semibold bg-blue-600 hover:bg-blue-700">
                    Launch Service <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}
