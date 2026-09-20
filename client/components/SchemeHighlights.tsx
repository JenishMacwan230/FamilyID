"use client"

import React from "react"
import { Search, HeartPulse, GraduationCap, Wheat, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const schemes = [
  {
    icon: HeartPulse,
    title: "Mukhyamantri Amrutam Yojana",
    category: "Health & Medical",
    coverage: "Up to ₹5,000,000 / year",
    eligibility: "Income < ₹4,00,000 / yr",
    color: "text-red-500 bg-red-50",
  },
  {
    icon: GraduationCap,
    title: "MYSY Education Scholarship",
    category: "Students & Youth",
    coverage: "50% Tuition Fee Subsidy",
    eligibility: "Class 10th/12th > 80%",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Wheat,
    title: "Gujarat Krishi Sahay Yojana",
    category: "Agriculture & Farmers",
    coverage: "Direct Bank Transfer",
    eligibility: "Land Owning Farmers",
    color: "text-amber-600 bg-amber-50",
  },
]

export function SchemeHighlights() {
  return (
    <section id="schemes" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <Badge variant="default" className="px-3 py-1 text-xs font-bold uppercase tracking-wider">
              Beneficiary Matching
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Government Schemes
            </h2>
            <p className="text-slate-600 text-base max-w-xl">
              Family ID automatically evaluates your family income, caste, and member count to match eligible welfare schemes.
            </p>
          </div>

          {/* Quick Eligibility Search */}
          <div className="flex items-center gap-2 max-w-md w-full">
            <Input placeholder="Enter Family ID or Aadhaar No..." className="h-11 shadow-xs" />
            <Button variant="orange" className="h-11 px-5 shrink-0">
              <Search className="w-4 h-4 mr-1" /> Check
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {schemes.map((scheme, idx) => {
            const Icon = scheme.icon
            return (
              <Card key={idx} className="border border-slate-200 hover:border-orange-300 shadow-sm hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${scheme.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline">{scheme.category}</Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    {scheme.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-t border-slate-100">
                    <span className="text-slate-500">Coverage</span>
                    <span className="font-bold text-blue-700">{scheme.coverage}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-slate-100">
                    <span className="text-slate-500">Eligibility</span>
                    <span className="font-medium text-slate-800">{scheme.eligibility}</span>
                  </div>
                  <div className="pt-2">
                    <Button variant="orangeOutline" size="sm" className="w-full text-xs font-semibold">
                      View Scheme Criteria
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Notice Banner */}
        <div className="mt-12 bg-blue-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-orange-400">One Benefit Per Eligible Member Rule</h3>
            <p className="text-sm text-blue-100 max-w-2xl">
              Family ID prevents duplicate scheme claims. Government officials review family proof only when you explicitly submit an application.
            </p>
          </div>
          <Button variant="orange" size="lg" className="shrink-0">
            Apply For Scheme
          </Button>
        </div>

      </div>
    </section>
  )
}
