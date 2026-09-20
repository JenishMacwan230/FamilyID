"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { API_URL } from "@/lib/api"
import { ShieldCheck, ArrowRight, UserCheck, Sparkles, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [familyData, setFamilyData] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const status = localStorage.getItem("is_logged_in") === "true"
      setIsLoggedIn(status)
      if (status) {
        const savedId = localStorage.getItem("current_family_id")

        const loadFamilyFromMongoDB = async () => {
          let realFamily: any = null
          try {
            if (savedId && savedId !== "latest") {
              const res = await fetch(`${API_URL}/api/families/${savedId}`).catch(() => null)
              if (res && res.ok) {
                const data = await res.json()
                if (data && data.familyId) realFamily = data
              }
            }

            if (!realFamily) {
              const res = await fetch(`${API_URL}/api/families/latest`).catch(() => null)
              if (res && res.ok) {
                const data = await res.json()
                if (data && data.familyId) realFamily = data
                else if (Array.isArray(data) && data.length > 0) realFamily = data[0]
              }
            }

            if (!realFamily) {
              const res = await fetch(`${API_URL}/api/families`).catch(() => null)
              if (res && res.ok) {
                const data = await res.json()
                if (Array.isArray(data) && data.length > 0) realFamily = data[0]
              }
            }
          } catch (err) {
            console.error("Error loading family from MongoDB in HeroSection:", err)
          }

          if (realFamily) {
            setFamilyData(realFamily)
          } else {
            setFamilyData(null)
          }
        }

        loadFamilyFromMongoDB()
      }
    }
  }, [])

  // Derive dynamic card display info from real MongoDB document
  const headMember = familyData?.members?.find((m: any) => m.relation === "Head of Family") || familyData?.members?.[0]
  const cardHeadName = isLoggedIn && headMember?.name ? headMember.name : "Unregistered Citizen"
  const cardFamilyId = isLoggedIn && familyData?.familyId ? familyData.familyId : "GJ-2026-XXXX-XX"
  const cardMemberCount = isLoggedIn && familyData?.members ? `${familyData.members.length} Family Members` : "0 Family Members"
  const cardCaste = isLoggedIn && familyData?.caste ? familyData.caste : "Category N/A"
  const totalIncome = familyData?.members?.reduce((sum: number, m: any) => sum + (Number(m.income) || 0), 0) || 0
  const cardIncome = isLoggedIn && familyData ? `₹ ${totalIncome.toLocaleString()} / yr` : "Income N/A"

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-orange-50/30 py-16 lg:py-24">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Gujarat State Government Portal</span>
              <Badge variant="solidOrange" className="ml-1 text-[10px]">NEW</Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Unified <span className="text-blue-600">Family ID</span> for Seamless Welfare & Schemes
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Empowering families across Gujarat with a single digital identity. Check scheme eligibility, apply for benefits with verified family proofs, and prevent duplicate benefit claims.
            </p>

            {/* Feature Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-700 font-medium">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Head of Family OTP Verification</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                <span>Split or Add Family Members</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                <span>Automated Scheme Eligibility</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Strict Data Privacy Controls</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href={isLoggedIn ? "/dashboard" : "/create-family"} className="w-full sm:w-auto">
                <Button size="lg" variant="default" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 shadow-lg">
                  {isLoggedIn ? "Go to Dashboard" : "Create New Family ID"} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              {!isLoggedIn && (
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="orangeOutline" className="w-full sm:w-auto">
                    <UserCheck className="w-5 h-5 mr-2" /> Head Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right Dynamic Family Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <Card className="border-2 border-blue-100 shadow-2xl bg-white/90 backdrop-blur-sm p-2 overflow-hidden rounded-2xl">
                <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 text-white relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Government of Gujarat</p>
                      <h3 className="text-xl font-bold tracking-tight text-white mt-1">Gujarat Family Card</h3>
                    </div>
                    <Badge variant="solidOrange" className="text-xs font-bold px-2.5 py-1 uppercase">
                      {isLoggedIn && familyData ? (familyData.status || "VERIFIED") : "UNVERIFIED"}
                    </Badge>
                  </div>

                  <div className="mt-8 space-y-3">
                    <div className="flex justify-between text-xs text-blue-200">
                      <span>Family ID Number</span>
                      <span>Head of Family</span>
                    </div>
                    <div className="flex justify-between text-lg font-mono font-bold tracking-wider text-orange-300">
                      <span>{cardFamilyId}</span>
                      <span className="font-sans font-semibold text-white">{cardHeadName}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-blue-500/40 flex justify-between items-center text-xs text-blue-100">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-orange-400" />
                      <span>{isLoggedIn ? "Encrypted MongoDB Record" : "Citizen Identity System"}</span>
                    </div>
                    <span className="font-medium text-blue-200">{cardMemberCount}</span>
                  </div>
                </div>

                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                        %
                      </div>
                      <div>
                        <p className="text-xs text-orange-900 font-bold">Eligible Welfare Schemes</p>
                        <p className="text-xs text-orange-700">Automated Benefit Evaluation</p>
                      </div>
                    </div>
                    <Link href="/schemes">
                      <Button variant="orange" size="sm" className="text-xs">
                        Check
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Income Slab</p>
                      <p className="text-sm font-bold text-slate-800">{cardIncome}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Category</p>
                      <p className="text-sm font-bold text-blue-700">{cardCaste}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Stat Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-blue-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Gujarat Portal</p>
                  <p className="text-base font-black text-slate-900">Official Database</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
