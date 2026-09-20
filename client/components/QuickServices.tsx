"use client"

import React from "react"
import { PlusCircle, GitFork, UserPen, Award, CheckCircle, ShieldAlert, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const services = [
  {
    icon: PlusCircle,
    badge: "Step 1",
    title: "Create Family ID",
    description: "Register head of family with mobile OTP verification and initial proof uploads.",
    color: "bg-blue-500",
    badgeVariant: "default" as const,
    buttonVariant: "default" as const,
  },
  {
    icon: GitFork,
    badge: "Split / Move",
    title: "Create Sub-Family",
    description: "Derive a new family unit from an existing family tree seamlessly.",
    color: "bg-orange-500",
    badgeVariant: "orange" as const,
    buttonVariant: "orange" as const,
  },
  {
    icon: UserPen,
    badge: "CRUD",
    title: "Update Family Details",
    description: "Modify address, income, caste, religion, or flag govt officials and abroad members.",
    color: "bg-blue-600",
    badgeVariant: "default" as const,
    buttonVariant: "outline" as const,
  },
  {
    icon: Award,
    badge: "Eligibility",
    title: "Check Scheme Benefits",
    description: "Discover all government schemes you or specific family members qualify for.",
    color: "bg-orange-600",
    badgeVariant: "orange" as const,
    buttonVariant: "orangeOutline" as const,
  },
  {
    icon: CheckCircle,
    badge: "Verification",
    title: "Member Deduplication",
    description: "System automatically ensures no single citizen belongs to multiple family IDs.",
    color: "bg-blue-700",
    badgeVariant: "default" as const,
    buttonVariant: "outline" as const,
  },
  {
    icon: ShieldAlert,
    badge: "Privacy",
    title: "Government Access Control",
    description: "Your data remains confidential and is accessible only when you apply for scheme benefits.",
    color: "bg-orange-500",
    badgeVariant: "orange" as const,
    buttonVariant: "orangeOutline" as const,
  },
]

export function QuickServices() {
  return (
    <section id="services" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <Badge variant="orange" className="px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Gujarat Citizen Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Key Services & Portal Features
          </h2>
          <p className="text-slate-600 text-base">
            Everything you need to manage your family record, discover welfare schemes, and secure your government benefits.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="group hover:-translate-y-1 hover:border-blue-300 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className={`w-12 h-12 rounded-xl ${service.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={service.badgeVariant}>{service.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-blue-700 transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="pt-2 text-sm text-slate-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Subtle Divider */}
                  <div className="h-px bg-slate-100 my-2" />
                </CardContent>
                <CardFooter>
                  <Button variant={service.buttonVariant} className="w-full text-xs font-semibold">
                    Access Service <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

      </div>
    </section>
  )
}
