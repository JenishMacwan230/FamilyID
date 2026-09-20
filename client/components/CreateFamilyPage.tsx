"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  ShieldCheck,
  UserCheck,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Globe,
  Home,
  Users
} from "lucide-react"

export interface FamilyMember {
  id: string
  name: string
  aadhaar: string
  dob: string
  relation: string
  income: string
  caste: string
  religion: string
  occupation: string
  isGovtOfficial: boolean
  isAbroad: boolean
}

export function CreateFamilyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1: Head Verification
  const [headMobile, setHeadMobile] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [isHeadVerified, setIsHeadVerified] = useState(false)
  const [step1Error, setStep1Error] = useState("")

  // Step 2: Household Info
  const [address, setAddress] = useState("")
  const [district, setDistrict] = useState("Gandhinagar")
  const [caste, setCaste] = useState("General")
  const [religion, setReligion] = useState("Hinduism")

  // Step 3: Members List
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      name: "",
      aadhaar: "",
      dob: "",
      relation: "Head of Family",
      income: "0",
      caste: "General",
      religion: "Hinduism",
      occupation: "Private Sector Job",
      isGovtOfficial: false,
      isAbroad: false,
    },
  ])

  // Step 4: Documents Upload State & Errors
  const [uploadedAadhaar, setUploadedAadhaar] = useState(false)
  const [uploadedLightBill, setUploadedLightBill] = useState(false)
  const [uploadedIncomeCert, setUploadedIncomeCert] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 5: Application Output
  const [applicationId, setApplicationId] = useState("")

  // Check mobile registered helper
  const checkMobileRegistered = async (mobile: string): Promise<{ isRegistered: boolean; msg?: string }> => {
    // Local storage check
    if (typeof window !== "undefined") {
      const registeredMobiles = JSON.parse(localStorage.getItem("registered_mobiles") || "[]")
      if (registeredMobiles.includes(mobile.trim())) {
        return {
          isRegistered: true,
          msg: `Mobile number +91 ${mobile} is already registered under a Family ID. You cannot create duplicate accounts with the same mobile number.`,
        }
      }
    }

    // Backend API check
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const res = await fetch(`${API_URL}/api/families/check-mobile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headMobile: mobile }),
      }).catch(() => null)

      if (res && !res.ok) {
        const data = await res.json()
        return {
          isRegistered: true,
          msg: data.message || `Mobile number +91 ${mobile} is already registered under a Family ID. Please Sign In.`,
        }
      }
    } catch (err) {
      // Ignore network errors
    }

    return { isRegistered: false }
  }

  // Step 1 Handlers
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!headMobile || headMobile.length < 10) {
      setStep1Error("Please enter a valid 10-digit mobile number")
      return
    }
    setStep1Error("")

    const check = await checkMobileRegistered(headMobile)
    if (check.isRegistered) {
      setStep1Error(check.msg || "Mobile number is already registered under another Family ID. Please Sign In instead.")
      return
    }

    setOtpSent(true)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.trim() !== "111111") {
      setStep1Error("Invalid OTP. Please enter test 6-digit OTP: 111111")
      return
    }

    // Verify mobile registration again during OTP verification
    const check = await checkMobileRegistered(headMobile)
    if (check.isRegistered) {
      setStep1Error(check.msg || "Mobile number is already registered. You cannot create a duplicate account.")
      return
    }

    setStep1Error("")
    setIsHeadVerified(true)
    if (typeof window !== "undefined") {
      localStorage.setItem("is_logged_in", "true")
      window.dispatchEvent(new Event("auth-change"))
    }
    setStep(2)
  }

  // Member CRUD
  const addMember = () => {
    setMembers([
      ...members,
      {
        id: Date.now().toString(),
        name: "",
        aadhaar: "",
        dob: "",
        relation: "Spouse",
        income: "0",
        caste: caste,
        religion: religion,
        occupation: "Private Sector Job",
        isGovtOfficial: false,
        isAbroad: false,
      },
    ])
  }

  const removeMember = (id: string) => {
    if (members.length <= 1) return
    setMembers(members.filter((m) => m.id !== id))
  }

  const updateMember = (id: string, field: keyof FamilyMember, value: any) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  // Submit Application to MongoDB & Redirect to Application Tracking Page
  const handleSubmitApplication = async () => {
    setSubmitError("")
    setIsSubmitting(true)

    // Check 1: Ensure name and 12-digit Aadhaar for all members
    for (let i = 0; i < members.length; i++) {
      if (!members[i].name || !members[i].aadhaar || members[i].aadhaar.trim().length < 12) {
        setSubmitError(`Please enter a valid Name and 12-digit Aadhaar number for Member #${i + 1}`)
        setIsSubmitting(false)
        return
      }
    }

    // Check 2: Unique Aadhaar numbers within form
    const aadhaars = members.map((m) => m.aadhaar.trim())
    if (new Set(aadhaars).size !== aadhaars.length) {
      setSubmitError("Duplicate Aadhaar numbers entered in the member list. Each family member must have a unique Aadhaar number.")
      setIsSubmitting(false)
      return
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const res = await fetch(`${API_URL}/api/families`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headMobile,
          address,
          district,
          caste,
          religion,
          members,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setSubmitError(data.message || "Failed to submit Family ID application")
        setIsSubmitting(false)
        return
      }

      const createdFamilyId = data.family?.familyId || `GJ-2026-${Math.floor(100000 + Math.random() * 900000)}`
      setApplicationId(createdFamilyId)

      if (typeof window !== "undefined") {
        localStorage.setItem("is_logged_in", "true")
        localStorage.setItem("current_family_id", createdFamilyId)
        const registeredMobiles = JSON.parse(localStorage.getItem("registered_mobiles") || "[]")
        if (!registeredMobiles.includes(headMobile.trim())) {
          registeredMobiles.push(headMobile.trim())
          localStorage.setItem("registered_mobiles", JSON.stringify(registeredMobiles))
        }
        window.dispatchEvent(new Event("auth-change"))
      }

      // Redirect immediately to Application Page (/track)
      router.push(`/track?appId=${createdFamilyId}`)
    } catch (err: any) {
      // Fallback if offline
      const fallbackId = `GJ-2026-${Math.floor(100000 + Math.random() * 900000)}`
      setApplicationId(fallbackId)
      if (typeof window !== "undefined") {
        localStorage.setItem("is_logged_in", "true")
        localStorage.setItem("current_family_id", fallbackId)
        const registeredMobiles = JSON.parse(localStorage.getItem("registered_mobiles") || "[]")
        if (!registeredMobiles.includes(headMobile.trim())) {
          registeredMobiles.push(headMobile.trim())
          localStorage.setItem("registered_mobiles", JSON.stringify(registeredMobiles))
        }
        window.dispatchEvent(new Event("auth-change"))
      }
      router.push(`/track?appId=${fallbackId}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Wizard Header */}
        <div className="mb-10 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="solidOrange" className="text-xs font-bold uppercase tracking-wider px-3 py-1">
              Gujarat Family Registration
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Create New Family ID Application
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Fill in head verification, household address, member demographics, and document proofs.
          </p>
          <p className="text-xs text-slate-500 pt-1">
            Already registered?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Sign In to your Family Profile →
            </Link>
          </p>
        </div>

        {/* Step Progress Tracker */}
        <div className="mb-8 grid grid-cols-5 gap-2 text-center text-xs font-semibold">
          {[
            { s: 1, label: "1. OTP Verify" },
            { s: 2, label: "2. Household" },
            { s: 3, label: "3. Members" },
            { s: 4, label: "4. Documents" },
            { s: 5, label: "5. Status" },
          ].map((item) => (
            <div
              key={item.s}
              className={`py-2 rounded-lg border transition-all ${
                step === item.s
                  ? "bg-blue-600 text-white border-blue-600 font-bold shadow-sm"
                  : step > item.s
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-white text-slate-400 border-slate-200"
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* STEP 1: Head Verification */}
        {step === 1 && (
          <Card className="bg-white border border-slate-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Step 1: Head of Family Mobile Verification</CardTitle>
                  <CardDescription>Verify mobile number via OTP before creating family record.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {step1Error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{step1Error}</span>
                  </div>
                  {step1Error.toLowerCase().includes("already registered") && (
                    <div className="pt-1">
                      <Link href="/login">
                        <Button variant="orange" size="sm" className="text-xs font-bold">
                          Go to Sign In Page →
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-1.5">
                    <Label htmlFor="headMobile">Head of Family Mobile Number</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">+91</span>
                      <Input
                        id="headMobile"
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={headMobile}
                        onChange={(e) => setHeadMobile(e.target.value.replace(/\D/g, ""))}
                        className="pl-12 h-11"
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="orange" className="w-full h-11 font-semibold">
                    Send Verification OTP <ShieldCheck className="w-4 h-4 ml-1.5" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-md mx-auto">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex justify-between items-center">
                    <div>
                      <p className="font-bold">OTP sent to +91 {headMobile}</p>
                      <p className="text-blue-700">Enter test OTP: <strong>111111</strong></p>
                    </div>
                    <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-orange-600 font-bold underline">
                      Change
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="headOtp">Enter 6-Digit Security OTP</Label>
                    <Input
                      id="headOtp"
                      type="text"
                      maxLength={6}
                      placeholder="111111"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="h-11 text-center font-mono text-lg tracking-widest"
                    />
                  </div>

                  <Button type="submit" variant="default" className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold">
                    Verify & Proceed <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* STEP 2: Household & Address Info */}
        {step === 2 && (
          <Card className="bg-white border border-slate-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Step 2: Household & Residence Address</CardTitle>
                  <CardDescription>Enter primary residential address and social demographics.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="address">Full House Address & Street Name</Label>
                  <Input
                    id="address"
                    placeholder="Plot No. 42, Sector 11, Near District Court..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="district">District in Gujarat</Label>
                  <select
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Gandhinagar">Gandhinagar</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Surat">Surat</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Rajkot">Rajkot</option>
                    <option value="Bhavnagar">Bhavnagar</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="caste">Social Category / Caste</Label>
                  <select
                    id="caste"
                    value={caste}
                    onChange={(e) => setCaste(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="SEBC / OBC">SEBC / OBC</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="religion">Religion</Label>
                  <select
                    id="religion"
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Hinduism">Hinduism</option>
                    <option value="Islam">Islam</option>
                    <option value="Jainism">Jainism</option>
                    <option value="Christianity">Christianity</option>
                    <option value="Sikhism">Sikhism</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-slate-100 p-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button variant="orange" onClick={() => setStep(3)}>
                Proceed to Family Members <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 3: Family Members Form */}
        {step === 3 && (
          <Card className="bg-white border border-slate-200 shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Step 3: Family Members Demographics</CardTitle>
                  <CardDescription>Add details for all members residing in the family household.</CardDescription>
                </div>
              </div>
              <Button variant="orangeOutline" size="sm" onClick={addMember}>
                <Plus className="w-4 h-4 mr-1" /> Add Member
              </Button>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {members.map((m, idx) => (
                <div key={m.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4 relative">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={idx === 0 ? "solidOrange" : "default"}>
                        {idx === 0 ? "Head of Family" : `Member #${idx + 1}`}
                      </Badge>
                      {m.name && <span className="font-bold text-slate-800 text-sm">{m.name}</span>}
                    </div>
                    {members.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(m.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <Label>Full Name</Label>
                      <Input
                        placeholder="Full Name as per Aadhaar"
                        value={m.name}
                        onChange={(e) => updateMember(m.id, "name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Aadhaar Number (12 Digits - Unique)</Label>
                      <Input
                        maxLength={12}
                        placeholder="XXXX XXXX XXXX"
                        value={m.aadhaar}
                        onChange={(e) => updateMember(m.id, "aadhaar", e.target.value.replace(/\D/g, ""))}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Date of Birth (DOB)</Label>
                      <Input
                        type="date"
                        value={m.dob}
                        onChange={(e) => updateMember(m.id, "dob", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Relation to Head</Label>
                      <select
                        value={m.relation}
                        onChange={(e) => updateMember(m.id, "relation", e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs"
                      >
                        <option value="Head of Family">Head of Family</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Other">Other Relative</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label>Annual Individual Income (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={m.income}
                        onChange={(e) => updateMember(m.id, "income", e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Occupation / Work Status *</Label>
                      <select
                        value={m.occupation || (m.isGovtOfficial ? "Government Employee" : m.isAbroad ? "NRI / Living Abroad" : "Private Sector Job")}
                        onChange={(e) => {
                          const val = e.target.value
                          setMembers(
                            members.map((item) =>
                              item.id === m.id
                                ? {
                                    ...item,
                                    occupation: val,
                                    isGovtOfficial: val === "Government Employee",
                                    isAbroad: val === "NRI / Living Abroad",
                                  }
                                : item
                            )
                          )
                        }}
                        className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
                      >
                        <option value="Government Employee">Government Employee</option>
                        <option value="Student">Student</option>
                        <option value="NRI / Living Abroad">NRI / Living Abroad</option>
                        <option value="Business / Self-Employed">Business / Self-Employed</option>
                        <option value="Private Sector Job">Private Sector Job</option>
                        <option value="Farmer / Agriculture">Farmer / Agriculture</option>
                        <option value="Homemaker / Unemployed">Homemaker / Unemployed</option>
                        <option value="Retired / Pensioner">Retired / Pensioner</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label>Social Category</Label>
                      <Input value={caste} disabled className="bg-slate-100 text-slate-500" />
                    </div>

                    {/* Checkbox Flags */}
                    <div className="md:col-span-3 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300">
                        <input
                          type="checkbox"
                          checked={m.isGovtOfficial}
                          onChange={(e) => updateMember(m.id, "isGovtOfficial", e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-xs flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Government Employee?
                          </p>
                          <p className="text-[11px] text-slate-500">Check if member holds a state/central govt job</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-orange-300">
                        <input
                          type="checkbox"
                          checked={m.isAbroad}
                          onChange={(e) => updateMember(m.id, "isAbroad", e.target.checked)}
                          className="w-4 h-4 text-orange-500 rounded"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-xs flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5 text-orange-500" /> Residing Abroad / NRI?
                          </p>
                          <p className="text-[11px] text-slate-500">Check if member lives outside India</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter className="flex justify-between border-t border-slate-100 p-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button variant="orange" onClick={() => setStep(4)}>
                Proceed to Document Proofs <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 4: Documents Upload & Final Submission */}
        {step === 4 && (
          <Card className="bg-white border border-slate-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Step 4: Upload Verification Documents</CardTitle>
                  <CardDescription>Upload proof documents required for official government verification.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {submitError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="font-semibold">{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Doc 1: Aadhaar */}
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Aadhaar Card Copies</h4>
                    <p className="text-xs text-slate-500">All members Aadhaar PDF / JPG</p>
                  </div>
                  <Button
                    variant={uploadedAadhaar ? "secondary" : "outline"}
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setUploadedAadhaar(!uploadedAadhaar)}
                  >
                    {uploadedAadhaar ? "✓ Uploaded (aadhaar_proof.pdf)" : "Select File"}
                  </Button>
                </div>

                {/* Doc 2: Address Proof */}
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Address Proof</h4>
                    <p className="text-xs text-slate-500">Light bill / Electricity / Land bill</p>
                  </div>
                  <Button
                    variant={uploadedLightBill ? "secondary" : "outline"}
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setUploadedLightBill(!uploadedLightBill)}
                  >
                    {uploadedLightBill ? "✓ Uploaded (light_bill.pdf)" : "Select File"}
                  </Button>
                </div>

                {/* Doc 3: Income Cert */}
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Income Certificate</h4>
                    <p className="text-xs text-slate-500">Issued by Mamlatdar / Tehsildar</p>
                  </div>
                  <Button
                    variant={uploadedIncomeCert ? "secondary" : "outline"}
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setUploadedIncomeCert(!uploadedIncomeCert)}
                  >
                    {uploadedIncomeCert ? "✓ Uploaded (income_cert.pdf)" : "Select File"}
                  </Button>
                </div>

              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Verification Timeline</p>
                  <p>Once submitted, local verification officers review uploaded proofs within 3 to 5 working days. You will receive an SMS alert upon verification.</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-slate-100 p-4">
              <Button variant="outline" onClick={() => setStep(3)} disabled={isSubmitting}>
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button variant="orange" size="lg" onClick={handleSubmitApplication} disabled={isSubmitting}>
                {isSubmitting ? "Submitting to DB..." : "Submit Application"} <CheckCircle2 className="w-4 h-4 ml-1.5" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 5: Redirecting to Application Page */}
        {step === 5 && (
          <Card className="bg-white border-2 border-orange-200 shadow-2xl">
            <CardHeader className="text-center space-y-3 pt-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900">
                Application Submitted Successfully!
              </CardTitle>
              <CardDescription className="text-sm max-w-md mx-auto">
                Redirecting to Application Tracking Page...
              </CardDescription>
            </CardHeader>
          </Card>
        )}

      </main>

      <Footer />
    </div>
  )
}
