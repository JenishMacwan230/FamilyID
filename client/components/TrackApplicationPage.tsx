"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { API_URL } from "@/lib/api"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, CheckCircle2, FileCheck, ShieldCheck, ArrowRight, Bell, AlertCircle } from "lucide-react"

export function TrackApplicationPage() {
  const [query, setQuery] = useState("GJ-2026-984210")
  const [searched, setSearched] = useState(true)
  const [isSimulatedVerified, setIsSimulatedVerified] = useState(false)
  const [familyData, setFamilyData] = useState<any>(null)
  const [submittedDate, setSubmittedDate] = useState<string>("2026-09-20")
  const [applicationsQueue, setApplicationsQueue] = useState<any[]>([])
  const [reschedulingAppNo, setReschedulingAppNo] = useState<string>("")
  const [newSlotSelected, setNewSlotSelected] = useState<string>("")
  const [slotUpdateMsg, setSlotUpdateMsg] = useState<string>("")

  useEffect(() => {
    setSubmittedDate(new Date().toLocaleDateString("en-IN"))
    if (typeof window !== "undefined") {
      const savedId = localStorage.getItem("current_family_id")
      if (savedId) {
        setQuery(savedId)
        fetchFamilyRecord(savedId)
        fetchFamilyApplications(savedId)
      } else {
        fetchFamilyRecord("GJ-2026-984210")
        fetchFamilyApplications("GJ-2026-984210")
      }
    }
  }, [])

  const fetchFamilyRecord = async (searchId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/families/${searchId}`).catch(() => null)
      if (res && res.ok) {
        const data = await res.json()
        setFamilyData(data)
        if (data.familyId) {
          fetchFamilyApplications(data.familyId)
        }
      }
    } catch (err) {
      console.log("Using demo tracking data")
    }
  }

  const fetchFamilyApplications = async (familyId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/schemes/family/${familyId}`).catch(() => null)
      if (res && res.ok) {
        const apps = await res.json()
        setApplicationsQueue(apps)
      }
    } catch (err) {
      console.log("Could not fetch scheme applications queue")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearched(true)
    if (query) {
      fetchFamilyRecord(query)
      fetchFamilyApplications(query)
    }
  }

  const handleRescheduleSlot = async (appNo: string) => {
    if (!newSlotSelected) return
    try {
      const res = await fetch(`${API_URL}/api/schemes/application/${appNo}/slot`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationSlot: newSlotSelected }),
      })
      const data = await res.json()
      if (res.ok) {
        setSlotUpdateMsg(`Appointment window updated to ${newSlotSelected}`)
        setReschedulingAppNo("")
        if (familyData?.familyId) {
          fetchFamilyApplications(familyData.familyId)
        }
        setTimeout(() => setSlotUpdateMsg(""), 4000)
      }
    } catch (err) {
      alert("Failed to update appointment slot")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="solidOrange" className="text-xs font-bold uppercase tracking-wider px-3 py-1">
            Application & Benefit Tracker
          </Badge>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Track Family Application & Verification Queue
          </h1>
          <p className="text-sm text-slate-600">
            Monitor document verification status and select or reschedule available physical verification time slots.
          </p>
        </div>

        {slotUpdateMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{slotUpdateMsg}</span>
            </div>
          </div>
        )}

        {/* Search Bar Form */}
        <Card className="bg-white border border-slate-200 shadow-md">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <Input
                  placeholder="Enter Application No (e.g. GJ-2026-984210) or Mobile No..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <Button type="submit" variant="orange" className="h-11 px-6 font-semibold">
                Track Status
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* SECTION: Submitted Scheme Applications Queue with Verification Slot Selection */}
        {applicationsQueue && applicationsQueue.length > 0 && (
          <Card className="bg-white border-2 border-orange-200 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-950 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Badge variant="solidOrange" className="text-[10px] uppercase font-bold px-2 py-0.5 mb-1">
                  Active Applications Queue
                </Badge>
                <CardTitle className="text-xl font-bold text-white">Submitted Scheme Applications</CardTitle>
                <CardDescription className="text-xs text-blue-200">
                  Physical document verification window appointments for Family ID {familyData?.familyId || query}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs text-blue-100 border-blue-400/40">
                {applicationsQueue.length} Active Application(s)
              </Badge>
            </CardHeader>

            <CardContent className="p-6 divide-y divide-slate-150 space-y-6">
              {applicationsQueue.map((app: any, idx: number) => (
                <div key={idx} className="pt-4 first:pt-0 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-orange-600">{app.applicationNo}</span>
                      <h4 className="text-base font-bold text-slate-900">{app.schemeTitle}</h4>
                      <p className="text-slate-600 text-xs">
                        Applicant: <strong>{app.applicantName}</strong> (Aadhaar: {app.applicantAadhaar}) • Category: {app.caste}
                      </p>
                    </div>
                    <Badge variant="solidOrange" className="self-start sm:self-center font-bold px-3 py-1 uppercase text-[10px]">
                      {app.status || "Submitted"}
                    </Badge>
                  </div>

                  {/* Scheduled Physical Verification Slot Display */}
                  <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div className="flex items-center gap-2 font-bold text-blue-950">
                        <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                        <span>Scheduled Document Verification Appointment Window:</span>
                      </div>

                      {reschedulingAppNo !== app.applicationNo && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReschedulingAppNo(app.applicationNo)
                            setNewSlotSelected(app.verificationSlot || "Sep 22, 2026 • 10:00 AM - 12:00 PM (Jan Seva Kendra, Gandhinagar)")
                          }}
                          className="h-7 text-[11px] font-bold text-blue-700 border-blue-300 hover:bg-blue-100"
                        >
                          Change / Select Available Window
                        </Button>
                      )}
                    </div>

                    <p className="font-mono font-bold text-slate-900 text-xs pl-6">
                      📍 {app.verificationSlot || "Sep 22, 2026 • 10:00 AM - 12:00 PM (Jan Seva Kendra, Gandhinagar)"}
                    </p>

                    {/* Reschedule Slot Form */}
                    {reschedulingAppNo === app.applicationNo && (
                      <div className="pt-2 pl-6 space-y-2 border-t border-blue-200 mt-2">
                        <p className="font-bold text-blue-900 text-[11px]">Select New Physical Verification Time Slot:</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <select
                            value={newSlotSelected}
                            onChange={(e) => setNewSlotSelected(e.target.value)}
                            className="flex-1 h-9 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900"
                          >
                            <option value="Sep 22, 2026 • 10:00 AM - 12:00 PM (Jan Seva Kendra, Gandhinagar)">
                              Sep 22, 2026 • 10:00 AM - 12:00 PM (Jan Seva Kendra, Gandhinagar)
                            </option>
                            <option value="Sep 22, 2026 • 02:00 PM - 04:00 PM (District Mamlatdar Office)">
                              Sep 22, 2026 • 02:00 PM - 04:00 PM (District Mamlatdar Office)
                            </option>
                            <option value="Sep 23, 2026 • 11:00 AM - 01:00 PM (Jan Seva Kendra, Gandhinagar)">
                              Sep 23, 2026 • 11:00 AM - 01:00 PM (Jan Seva Kendra, Gandhinagar)
                            </option>
                            <option value="Sep 24, 2026 • 10:00 AM - 12:00 PM (E-Gram Panchayat Center)">
                              Sep 24, 2026 • 10:00 AM - 12:00 PM (E-Gram Panchayat Center)
                            </option>
                            <option value="Sep 25, 2026 • 03:00 PM - 05:00 PM (District Collectorate Office)">
                              Sep 25, 2026 • 03:00 PM - 05:00 PM (District Collectorate Office)
                            </option>
                          </select>
                          <div className="flex gap-2">
                            <Button
                              variant="orange"
                              size="sm"
                              className="h-9 text-xs font-semibold"
                              onClick={() => handleRescheduleSlot(app.applicationNo)}
                            >
                              Confirm Window
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 text-xs"
                              onClick={() => setReschedulingAppNo("")}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Application Status Timeline Card */}
        {searched && (
          <Card className="bg-white border border-slate-200 shadow-xl overflow-hidden">
            <CardHeader className="bg-slate-100/70 border-b border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Application Reference / Family ID</p>
                <h3 className="text-2xl font-mono font-bold text-blue-700">{query || "GJ-2026-984210"}</h3>
                <p className="text-xs text-slate-600 pt-0.5" suppressHydrationWarning>
                  Submitted on: {submittedDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={isSimulatedVerified ? "default" : "orange"} className="text-xs font-bold px-3 py-1">
                  {isSimulatedVerified ? "VERIFIED & APPROVED" : (familyData?.status || "PENDING VERIFICATION")}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              
              {/* Verification Notification Alert Box */}
              <div className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                isSimulatedVerified
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold">
                    <Bell className="w-4 h-4 text-orange-500" />
                    <span>Notification for Verification</span>
                  </div>
                  <Button
                    variant="orangeOutline"
                    size="sm"
                    className="text-[11px] h-7 px-2.5"
                    onClick={() => setIsSimulatedVerified(!isSimulatedVerified)}
                  >
                    {isSimulatedVerified ? "Reset Status" : "Simulate Officer Verification"}
                  </Button>
                </div>
                <p className="leading-relaxed">
                  {isSimulatedVerified
                    ? "🎉 Notification: All submitted documents (Aadhaar cards, Electricity Light Bill, Income Certificate) have been officially verified by the District Officer. Your Family ID is generated!"
                    : "⏳ Notification: Your application is currently under document verification. Local officers are reviewing submitted Aadhaar cards, Light bill, and Income certificate."}
                </p>
              </div>

              {familyData && familyData.members && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <p className="font-bold text-slate-800">Submitted Family Details (MongoDB)</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                    <div>Address: <strong>{familyData.address}, {familyData.district}</strong></div>
                    <div>Head Mobile: <strong>{familyData.headMobile}</strong></div>
                    <div>Category: <strong>{familyData.caste}</strong></div>
                    <div>Total Members: <strong>{familyData.members.length} Members</strong></div>
                  </div>
                </div>
              )}

              {/* Status Timeline */}
              <div className="space-y-6 relative pl-6 border-l-2 border-slate-200">
                
                {/* Stage 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Application Submitted</h4>
                    <p className="text-xs text-slate-500">Head of family OTP verified and application saved in MongoDB.</p>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="relative">
                  <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                    isSimulatedVerified ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                  }`}>
                    {isSimulatedVerified ? "✓" : "2"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Document Verification Desk</h4>
                    <p className="text-xs text-slate-500">Aadhaar cards, Light Bill / Land Bill, and Income Certificate review.</p>
                    <span className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                      isSimulatedVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {isSimulatedVerified ? "Documents Verified" : "Pending Officer Inspection"}
                    </span>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="relative">
                  <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                    isSimulatedVerified ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                  }`}>
                    {isSimulatedVerified ? "✓" : "3"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Anti-Duplication & Aadhaar Check</h4>
                    <p className="text-xs text-slate-500">Unique Aadhaar verification passed. No duplicate member in any other family.</p>
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="relative">
                  <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                    isSimulatedVerified ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                  }`}>
                    {isSimulatedVerified ? "✓" : "4"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Family ID Card Generation</h4>
                    <p className="text-xs text-slate-500">Official Gujarat Family ID card issued with QR verification.</p>
                  </div>
                </div>

              </div>

            </CardContent>

            <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 flex justify-between items-center text-xs">
              <span className="text-slate-500">Need help with verification? Call 1800-XXX-XXXX</span>
              <Link href="/schemes">
                <Button variant="orangeOutline" size="sm">
                  Check Eligible Schemes <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}

      </main>

      <Footer />
    </div>
  )
}
