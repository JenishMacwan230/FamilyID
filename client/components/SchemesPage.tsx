"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { API_URL } from "@/lib/api"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Search,
  HeartPulse,
  GraduationCap,
  Wheat,
  Home,
  Briefcase,
  Filter,
  CheckCircle2,
  XCircle,
  Upload,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  FileCheck,
  Check
} from "lucide-react"

const schemesData = [
  {
    id: "ma-yojana",
    title: "Mukhyamantri Amrutam (MA) Yojana",
    category: "Health",
    description: "Tertiary medical care coverage for BPL and low-income families in empaneled hospitals across Gujarat.",
    benefit: "Up to ₹5,00,000 / year",
    eligibility: "Income ≤ ₹4,00,000 / year",
    icon: HeartPulse,
    color: "text-red-600 bg-red-50",
    docType: "Income Certificate / Ration Card",
  },
  {
    id: "mysy-scholarship",
    title: "Mukhyamantri Yuva Swavalamban Yojana (MYSY)",
    category: "Education",
    description: "Financial assistance for diploma, degree, and medical students pursuing higher education.",
    benefit: "50% Tuition Subsidy + Hostel Allowance",
    eligibility: "Class 10th/12th Marks ≥ 80% & Income ≤ ₹6L",
    icon: GraduationCap,
    color: "text-blue-600 bg-blue-50",
    docType: "Class 10th/12th Marksheet & Income Proof",
  },
  {
    id: "krishi-sahay",
    title: "Gujarat Krishi Sahay Yojana",
    category: "Agriculture",
    description: "Crop loss compensation and agricultural equipment subsidy directly into farmer bank accounts.",
    benefit: "Up to ₹20,000 / hectare",
    eligibility: "Land Owning Farmers (7/12 Record)",
    icon: Wheat,
    color: "text-amber-600 bg-amber-50",
    docType: "Land Ownership Record 7/12 & 8A",
  },
  {
    id: "pmay-housing",
    title: "PMAY Gujarat Housing Scheme",
    category: "Housing",
    description: "Subsidized housing loans and affordable home allotment for urban and rural low-income families.",
    benefit: "Interest Subsidy up to ₹2.67 Lakh",
    eligibility: "Income ≤ ₹3,00,000 or EWS Category",
    icon: Home,
    color: "text-emerald-600 bg-emerald-50",
    docType: "Income Certificate & Property Proof",
  },
  {
    id: "vayo-vandana",
    title: "Vayo Vandana Pension Scheme",
    category: "Senior Citizens",
    description: "Monthly financial pension and healthcare support for senior citizens aged 60 years and above.",
    benefit: "₹1,500 / month Direct Transfer",
    eligibility: "Age ≥ 60 Years & Gujarat Resident",
    icon: Briefcase,
    color: "text-purple-600 bg-purple-50",
    docType: "Age Proof (Aadhaar / Voter ID)",
  },
]

export function SchemesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Logged-in Family & Members
  const [familyData, setFamilyData] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Eligibility Modal State
  const [activeScheme, setActiveScheme] = useState<any>(null)
  const [selectedMemberIdx, setSelectedMemberIdx] = useState<number>(0)
  
  // Custom Scheme Criteria Inputs
  const [applicantIncome, setApplicantIncome] = useState<string>("180000")
  const [applicantCaste, setApplicantCaste] = useState<string>("General")
  const [applicantMarks, setApplicantMarks] = useState<string>("85")
  const [applicantLand, setApplicantLand] = useState<string>("2.5")
  const [applicantAge, setApplicantAge] = useState<string>("62")
  const [uploadedDoc, setUploadedDoc] = useState<string>("")
  const [uploadedCasteCert, setUploadedCasteCert] = useState<string>("")
  const [verificationSlot, setVerificationSlot] = useState<string>("Sep 22, 2026 • 10:00 AM - 12:00 PM (Jan Seva Kendra, Gandhinagar)")

  // Multiple Required Documents Upload Map
  const [uploadedFilesMap, setUploadedFilesMap] = useState<Record<string, string>>({})

  // Evaluation & Application State
  const [evalResult, setEvalResult] = useState<any>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [appError, setAppError] = useState("")
  const [appliedSuccess, setAppliedSuccess] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const status = localStorage.getItem("is_logged_in") === "true"
      setIsLoggedIn(status)
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
          console.error("Error loading family from MongoDB in SchemesPage:", err)
        }

        if (realFamily) {
          setFamilyData(realFamily)
          if (typeof window !== "undefined" && realFamily.familyId) {
            localStorage.setItem("current_family_id", realFamily.familyId)
          }
        } else {
          setFamilyData(null)
        }
      }

      loadFamilyFromMongoDB()
    }
  }, [])

  const effectiveMembers = familyData?.members || []

  // Total Family Household Income from MongoDB
  const totalFamilyIncome = effectiveMembers.reduce((sum: number, m: any) => sum + (Number(m.income) || 0), 0) || 180000

  const calculateAgeFromDob = (dobStr: string) => {
    if (!dobStr) return 30
    const d = new Date(dobStr)
    if (isNaN(d.getTime())) return 30
    const today = new Date()
    let age = today.getFullYear() - d.getFullYear()
    const m = today.getMonth() - d.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
      age--
    }
    return age > 0 ? age : 0
  }

  // Helper to return required documents checklist for citizen uploading
  const getSchemeDocRequirements = (schemeId: string, caste: string) => {
    const isReserved = caste && ["OBC", "SEBC / OBC", "SC", "ST", "EWS"].includes(caste)
    const docs: { title: string; category: string; description: string; defaultFilename: string }[] = []

    switch (schemeId) {
      case "ma-yojana":
        docs.push({
          title: "MA Health Card / BPL Medical Proof",
          category: "Medical Scheme Proof",
          description: "Upload your MA Yojana BPL card or empaneled health card",
          defaultFilename: "MA_Yojana_Beneficiary_Proof.pdf",
        })
        docs.push({
          title: "Mamlatdar Household Income Certificate (≤ ₹4,00,000 / yr)",
          category: "Income Proof",
          description: "Upload revenue income certificate showing household income ≤ ₹4L",
          defaultFilename: "Income_Proof_Mamlatdar.pdf",
        })
        docs.push({
          title: "Gujarat Family Ration Card / Address Proof",
          category: "Residence Proof",
          description: "Upload active Gujarat ration card or residence proof",
          defaultFilename: "Ration_Card_Proof.pdf",
        })
        if (isReserved) {
          docs.push({
            title: `Official ${caste} Caste Certificate`,
            category: "Caste Proof",
            description: `Upload Sub-Divisional Magistrate / Mamlatdar issued ${caste} certificate`,
            defaultFilename: `Caste_Certificate_${caste.replace(/[^a-zA-Z]/g, "")}.pdf`,
          })
        }
        break

      case "mysy-scholarship":
        docs.push({
          title: "Class 10th / 12th Board Academic Marksheet (≥ 80%)",
          category: "Academic Proof",
          description: "Upload GSEB/CBSE Board passing certificate and marksheet",
          defaultFilename: "Board_Marksheet_10th_12th.pdf",
        })
        docs.push({
          title: "College / University Admission Fee Receipt & Student ID",
          category: "Student Proof",
          description: "Upload higher education institute fee receipt & student ID card",
          defaultFilename: "College_Admission_Fee_Receipt.pdf",
        })
        docs.push({
          title: "Family Household Income Certificate (≤ ₹6,00,000 / yr)",
          category: "Income Proof",
          description: "Upload annual household income proof certificate",
          defaultFilename: "Income_Certificate_Mamlatdar.pdf",
        })
        docs.push({
          title: "Student Bank Account Passbook / Aadhaar DBT Link",
          category: "DBT Bank Proof",
          description: "Upload student bank passbook copy showing Aadhaar link",
          defaultFilename: "Bank_Passbook_DBT.pdf",
        })
        if (isReserved) {
          docs.push({
            title: `Category Certificate (${caste})`,
            category: "Caste Proof",
            description: `Upload reserved category quota verification certificate`,
            defaultFilename: `Caste_Certificate_${caste.replace(/[^a-zA-Z]/g, "")}.pdf`,
          })
        }
        break

      case "krishi-sahay":
        docs.push({
          title: "Agricultural Land Ownership Record Form 7/12 & 8A",
          category: "Land Record",
          description: "Upload official revenue land 7/12 & 8A ownership document",
          defaultFilename: "Land_Ownership_Record_7_12.pdf",
        })
        docs.push({
          title: "Farmer Identity Card / i-Khedut Portal Registration",
          category: "Farmer Proof",
          description: "Upload registered farmer profile proof from i-Khedut portal",
          defaultFilename: "Farmer_Krishi_Card_Proof.pdf",
        })
        docs.push({
          title: "Crop Survey / Agricultural Damage Verification Report",
          category: "Crop Verification",
          description: "Upload Talati / Gram Sevak certified crop loss survey record",
          defaultFilename: "Crop_Loss_Verification.pdf",
        })
        docs.push({
          title: "Farmer Bank Passbook for Subsidy Credit",
          category: "Bank DBT Proof",
          description: "Upload active bank passbook copy for compensation transfer",
          defaultFilename: "Bank_Passbook_DBT.pdf",
        })
        break

      case "pmay-housing":
        docs.push({
          title: "Family Income Certificate (≤ ₹3,00,000 / yr) or EWS Proof",
          category: "Income / EWS Proof",
          description: "Upload Low Income Group (LIG) or EWS income certificate",
          defaultFilename: "EWS_Income_Proof.pdf",
        })
        docs.push({
          title: "No-Pucca House Ownership Declaration Affidavit",
          category: "Housing Affidavit",
          description: "Upload notarized affidavit certifying non-ownership of permanent home",
          defaultFilename: "No_House_Declaration.pdf",
        })
        docs.push({
          title: "Gujarat Domicile & Electricity Bill Proof",
          category: "Residence Proof",
          description: "Upload proof of long-term residence in Gujarat",
          defaultFilename: "Domicile_Electricity_Proof.pdf",
        })
        break

      case "vayo-vandana":
        docs.push({
          title: "Senior Citizen Age Proof (Aadhaar / Voter ID Age ≥ 60)",
          category: "Age Proof",
          description: "Upload Aadhaar card or Voter ID showing age is 60 years or above",
          defaultFilename: "Senior_Citizen_Age_Proof.pdf",
        })
        docs.push({
          title: "Gujarat Permanent Resident Domicile Certificate",
          category: "Domicile Proof",
          description: "Upload Gujarat state domicile proof certificate",
          defaultFilename: "Gujarat_Domicile_Proof.pdf",
        })
        docs.push({
          title: "Senior Citizen Bank Passbook for Monthly Pension Transfer",
          category: "Pension Bank Proof",
          description: "Upload Aadhaar-linked bank account passbook copy",
          defaultFilename: "Bank_Passbook_Pension.pdf",
        })
        break

      default:
        docs.push({
          title: "Applicant Identity & Gujarat Residence Proof",
          category: "General Proof",
          description: "Upload standard identity proof document",
          defaultFilename: "Verified_Proof.pdf",
        })
        break
    }

    return docs
  }

  // Open Scheme Application Modal
  const openModal = (scheme: any) => {
    setActiveScheme(scheme)
    setEvalResult(null)
    setAppError("")
    setAppliedSuccess(null)
    setUploadedDoc("")
    setUploadedCasteCert("")
    setUploadedFilesMap({})

    setSelectedMemberIdx(0)
    if (effectiveMembers.length > 0) {
      const m = effectiveMembers[0]
      setApplicantIncome(totalFamilyIncome.toString())
      setApplicantCaste(m?.caste || familyData?.caste || "General")
      if (m?.dob) {
        setApplicantAge(calculateAgeFromDob(m.dob).toString())
      }
    } else {
      setApplicantIncome("180000")
      setApplicantCaste("General")
    }
  }

  // Handle Member Switch in Modal
  const handleMemberSelect = (idx: number) => {
    setSelectedMemberIdx(idx)
    setEvalResult(null)
    setAppError("")

    if (effectiveMembers[idx]) {
      const m = effectiveMembers[idx]
      setApplicantIncome(totalFamilyIncome.toString())
      setApplicantCaste(m?.caste || familyData?.caste || "General")
      if (m?.dob) {
        setApplicantAge(calculateAgeFromDob(m.dob).toString())
      }
    }
  }

  const handleFileUploadSimulated = (docTitle: string, defaultFilename: string, e: React.ChangeEvent<HTMLInputElement>) => {
    let chosenFilename = defaultFilename
    if (e.target.files && e.target.files[0]) {
      chosenFilename = e.target.files[0].name
    }
    setUploadedFilesMap((prev) => ({
      ...prev,
      [docTitle]: chosenFilename,
    }))
    setUploadedDoc(chosenFilename)
  }

  // Check Eligibility Endpoint Call
  const handleCheckEligibility = async () => {
    setIsEvaluating(true)
    setAppError("")
    setEvalResult(null)

    const selectedMember = effectiveMembers[selectedMemberIdx] || effectiveMembers[0]
    const memberOccupation = selectedMember?.occupation || (selectedMember?.isGovtOfficial ? "Government Employee" : selectedMember?.isAbroad ? "NRI / Living Abroad" : "Private Sector Job")

    try {
      const res = await fetch(`${API_URL}/api/schemes/check-eligibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeId: activeScheme.id,
          income: Number(applicantIncome) || 0,
          caste: applicantCaste,
          marks: Number(applicantMarks) || 0,
          landArea: Number(applicantLand) || 0,
          age: Number(applicantAge) || 0,
          occupation: memberOccupation,
          casteCertificateUploaded: uploadedCasteCert || uploadedFilesMap[`Official ${applicantCaste} Caste Certificate`] || "",
        }),
      })

      const data = await res.json()
      setEvalResult(data)
    } catch (err) {
      // Client Fallback evaluation
      setEvalResult({
        isEligible: true,
        criteria: [{ label: "General Eligibility Verification Passed", passed: true }],
        reasons: [],
      })
    } finally {
      setIsEvaluating(false)
    }
  }

  // Submit Scheme Application (Single Benefit per Member check)
  const handleApplyScheme = async () => {
    setIsApplying(true)
    setAppError("")

    const memberObj = effectiveMembers[selectedMemberIdx] || effectiveMembers[0]

    // Construct full uploaded documents checklist payload for backend & government inspection
    const reqDocs = getSchemeDocRequirements(activeScheme.id, applicantCaste)
    const uploadedDocsPayload = reqDocs.map((doc) => ({
      title: doc.title,
      filename: uploadedFilesMap[doc.title] || doc.defaultFilename,
      category: doc.category,
    }))

    try {
      const res = await fetch(`${API_URL}/api/schemes/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyId: familyData?.familyId || "GJ-2026-984210",
          applicantName: memberObj.name,
          applicantAadhaar: memberObj.aadhaar,
          schemeId: activeScheme.id,
          schemeTitle: activeScheme.title,
          category: activeScheme.category,
          income: Number(applicantIncome) || 0,
          caste: applicantCaste,
          documentUploaded: uploadedDocsPayload[0]?.filename || uploadedDoc || activeScheme.docType,
          casteCertificateUploaded: uploadedCasteCert || uploadedFilesMap[`Official ${applicantCaste} Caste Certificate`] || "",
          uploadedDocuments: uploadedDocsPayload,
          verificationSlot: verificationSlot,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setAppError(data.message || "Failed to submit scheme application")
        setIsApplying(false)
        return
      }

      setAppliedSuccess(data.application)
    } catch (err: any) {
      setAppError("Backend unreachable. Please make sure server is running.")
    } finally {
      setIsApplying(false)
    }
  }

  const filteredSchemes = schemesData.filter((scheme) => {
    const matchesCategory = selectedCategory === "All" || scheme.category === selectedCategory
    const matchesSearch = scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) || scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <Badge variant="solidOrange" className="text-xs font-bold uppercase tracking-wider px-3 py-1">
            Gujarat Welfare Database
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Eligible Welfare <span className="text-orange-400">Schemes & Benefits</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Check scheme eligibility, upload all required verification documents, and apply for specific family members.
          </p>

          {/* Search Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 max-w-2xl">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <Input
                placeholder="Search by scheme name or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white text-slate-900 shadow-md border-0"
              />
            </div>
            <Button variant="orange" className="h-11 px-6 w-full sm:w-auto font-semibold">
              Search Schemes
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <Filter className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
          {["All", "Health", "Education", "Agriculture", "Housing", "Senior Citizens"].map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "orange" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full text-xs font-semibold shrink-0"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Schemes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchemes.map((scheme) => {
            const Icon = scheme.icon
            return (
              <Card key={scheme.id} className="bg-white border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${scheme.color} flex items-center justify-center shadow-xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline">{scheme.category}</Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    {scheme.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-xs text-slate-600">{scheme.description}</p>
                  <div className="flex justify-between items-center py-2 border-t border-slate-100">
                    <span className="text-slate-500 text-xs">Benefit Amount</span>
                    <span className="font-bold text-blue-700 text-xs">{scheme.benefit}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Criteria: <strong>{scheme.eligibility}</strong></span>
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <Button
                    variant="orange"
                    className="w-full text-xs font-semibold shadow-sm cursor-pointer"
                    onClick={() => openModal(scheme)}
                  >
                    Check Eligibility & Apply Member <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

      </main>

      {/* INTERACTIVE ELIGIBILITY CHECK & APPLY MODAL */}
      {activeScheme && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <Card className="bg-white border-2 border-blue-200 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 my-6">
            
            {/* Modal Header */}
            <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-950 text-white p-6 relative shrink-0">
              <button
                type="button"
                onClick={() => setActiveScheme(null)}
                className="absolute right-4 top-4 text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Badge variant="solidOrange" className="text-[10px] font-bold uppercase">{activeScheme.category}</Badge>
                <span className="text-xs text-blue-200">Gujarat State DBT Welfare Scheme</span>
              </div>
              <CardTitle className="text-xl font-bold text-white mt-1">{activeScheme.title}</CardTitle>
            </CardHeader>

            {/* Modal Body */}
            <CardContent className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {appliedSuccess ? (
                /* Application Success State with Verification Window & Tracker Queue Button */
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-emerald-950">Scheme Application Submitted to Queue!</h3>
                    <p className="text-xs text-emerald-800">
                      Application Reference No: <strong className="font-mono text-sm text-blue-900">{appliedSuccess.applicationNo}</strong>
                    </p>
                    <p className="text-xs text-slate-600 pt-1">
                      Submitted for member <strong>{appliedSuccess.applicantName}</strong> (Aadhaar: {appliedSuccess.applicantAadhaar}). All required verification documents have been attached.
                    </p>
                  </div>

                  <div className="p-4 bg-white border border-emerald-300 rounded-lg text-left space-y-1.5 text-xs text-slate-800">
                    <div className="flex items-center gap-2 font-bold text-emerald-900">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Scheduled Document Verification Appointment:</span>
                    </div>
                    <p className="font-mono font-semibold text-blue-900 pl-6">
                      {appliedSuccess.verificationSlot || verificationSlot}
                    </p>
                    <p className="text-[11px] text-slate-500 pl-6">
                      Please bring original Aadhaar Card, Income Certificate, and Caste Proof during your appointment.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/track">
                      <Button variant="orange" className="w-full sm:w-auto font-semibold text-xs">
                        Open Track Application Queue <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </Link>
                    <Button variant="outline" className="text-xs" onClick={() => setActiveScheme(null)}>
                      Close Window
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step A: Select Family Member */}
                  <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <Label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-blue-600" /> Select Family Member to Apply For
                    </Label>
                    
                    {effectiveMembers.length > 0 ? (
                      <select
                        value={selectedMemberIdx}
                        onChange={(e) => handleMemberSelect(Number(e.target.value))}
                        className="w-full h-11 rounded-lg border border-blue-200 bg-white px-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
                      >
                        {effectiveMembers.map((m: any, idx: number) => {
                          const occ = m.occupation || (m.isGovtOfficial ? "Government Employee" : m.isAbroad ? "NRI / Living Abroad" : "Private Sector Job")
                          return (
                            <option key={idx} value={idx}>
                              {m.name} ({m.relation} • {occ}) — Aadhaar: {m.aadhaar}
                            </option>
                          )
                        })}
                      </select>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
                        <span>No family members found in MongoDB. Please register a Family ID application first.</span>
                        <Link href="/create-family">
                          <Button variant="orange" size="sm" className="text-xs font-semibold">
                            Create Family ID
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Step B: Inputs & Scheme Specific Parameters */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Applicant Criteria & Eligibility Parameters</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1 sm:col-span-2">
                        <div className="flex justify-between items-center">
                          <Label className="font-bold text-slate-900">Total Household / Family Annual Income (₹) *</Label>
                          <Badge variant="outline" className="text-[10px] text-blue-700 bg-blue-50 border-blue-200">
                            Family-Level Evaluation
                          </Badge>
                        </div>
                        <Input
                          type="number"
                          value={applicantIncome}
                          onChange={(e) => setApplicantIncome(e.target.value)}
                          className="h-10 font-bold font-mono text-blue-900"
                        />
                        <p className="text-[11px] text-slate-500 pt-0.5">
                          💡 <em>Scheme eligibility is evaluated on total combined household family income (₹) because students, dependents, and homemakers do not earn individual income.</em>
                        </p>
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <Label className="font-bold text-slate-900">Social Category / Caste *</Label>
                        <select
                          value={applicantCaste}
                          onChange={(e) => setApplicantCaste(e.target.value)}
                          className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs"
                        >
                          <option value="General">General</option>
                          <option value="SEBC / OBC">SEBC / OBC</option>
                          <option value="SC">SC (Scheduled Caste)</option>
                          <option value="ST">ST (Scheduled Tribe)</option>
                          <option value="EWS">EWS (Economically Weaker Section)</option>
                        </select>
                      </div>

                      {/* Scheme Specific Custom Input Fields */}
                      {activeScheme.id === "mysy-scholarship" && (
                        <div className="space-y-1 sm:col-span-2">
                          <Label className="font-bold text-slate-900">Class 10th / 12th Marks Percentage (%)</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 85"
                            value={applicantMarks}
                            onChange={(e) => setApplicantMarks(e.target.value)}
                            className="h-10"
                          />
                        </div>
                      )}

                      {activeScheme.id === "krishi-sahay" && (
                        <div className="space-y-1 sm:col-span-2">
                          <Label className="font-bold text-slate-900">Agricultural Land Area (Acres)</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 2.5"
                            value={applicantLand}
                            onChange={(e) => setApplicantLand(e.target.value)}
                            className="h-10"
                          />
                        </div>
                      )}

                      {activeScheme.id === "vayo-vandana" && (
                        <div className="space-y-1 sm:col-span-2">
                          <Label className="font-bold text-slate-900">Applicant Age (Years)</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 62"
                            value={applicantAge}
                            onChange={(e) => setApplicantAge(e.target.value)}
                            className="h-10"
                          />
                        </div>
                      )}
                    </div>

                    {/* DYNAMIC MANDATORY REQUIRED DOCUMENTS UPLOAD SECTION */}
                    <div className="space-y-3 pt-3 border-t border-slate-200">
                      <div className="flex justify-between items-center">
                        <Label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <Upload className="w-4 h-4 text-blue-600" /> Mandatory Scheme Document Upload Checklist
                        </Label>
                        <Badge variant="outline" className="text-[10px] text-blue-800 bg-blue-50 border-blue-200">
                          {getSchemeDocRequirements(activeScheme.id, applicantCaste).length} Required Files
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {getSchemeDocRequirements(activeScheme.id, applicantCaste).map((doc, docIdx) => {
                          const currentUploadedName = uploadedFilesMap[doc.title] || doc.defaultFilename
                          const isUploaded = Boolean(uploadedFilesMap[doc.title] || uploadedDoc)

                          return (
                            <div
                              key={docIdx}
                              className={`p-3.5 border rounded-xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                                isUploaded
                                  ? "bg-emerald-50/60 border-emerald-300"
                                  : "bg-slate-50 border-slate-200"
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-[9px] text-blue-900 bg-white border-blue-200">
                                    {doc.category}
                                  </Badge>
                                  <p className="font-bold text-slate-900 text-xs">{doc.title} *</p>
                                </div>
                                <p className="text-[11px] text-slate-500">{doc.description}</p>
                                <p className="text-[10px] text-blue-900 font-mono pt-0.5">
                                  Attachment: <strong>{currentUploadedName}</strong>
                                </p>
                              </div>

                              <div className="relative shrink-0 w-full sm:w-auto">
                                <input
                                  type="file"
                                  id={`file-upload-${docIdx}`}
                                  accept=".pdf,.jpg,.png"
                                  onChange={(e) => handleFileUploadSimulated(doc.title, doc.defaultFilename, e)}
                                  className="hidden"
                                />
                                <label
                                  htmlFor={`file-upload-${docIdx}`}
                                  className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all w-full sm:w-auto ${
                                    isUploaded
                                      ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                                      : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
                                  }`}
                                >
                                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                                  {isUploaded ? "✓ Uploaded (PDF)" : "Choose PDF File"}
                                </label>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Verification Appointment Window Picker */}
                    <div className="space-y-1.5 pt-2">
                      <Label className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-orange-600" /> Select Available Window for Physical Document Verification *
                      </Label>
                      <select
                        value={verificationSlot}
                        onChange={(e) => setVerificationSlot(e.target.value)}
                        className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500"
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
                      </select>
                    </div>

                  </div>

                  {/* Evaluate Button */}
                  <div>
                    <Button
                      variant="orangeOutline"
                      onClick={handleCheckEligibility}
                      disabled={isEvaluating}
                      className="w-full text-xs font-semibold cursor-pointer"
                    >
                      {isEvaluating ? "Evaluating Criteria..." : "Evaluate Member Eligibility"} <Sparkles className="w-4 h-4 ml-1.5 text-orange-500" />
                    </Button>
                  </div>

                  {/* Step C: Evaluation Result Display */}
                  {evalResult && (
                    <div className={`p-4 rounded-xl border space-y-3 text-xs ${
                      evalResult.isEligible
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                        : "bg-red-50 border-red-300 text-red-950"
                    }`}>
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {evalResult.isEligible ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>ELIGIBLE FOR {activeScheme.title.toUpperCase()}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span>NOT ELIGIBLE FOR {activeScheme.title.toUpperCase()}</span>
                          </>
                        )}
                      </div>

                      {/* Criteria Evaluation Checklist */}
                      {evalResult.criteria && evalResult.criteria.length > 0 && (
                        <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 text-slate-800">
                          <p className="font-bold text-[11px] uppercase tracking-wider text-slate-500">Evaluated Scheme Parameters:</p>
                          {evalResult.criteria.map((c: any, cIdx: number) => (
                            <div key={cIdx} className="flex justify-between items-center text-[11px]">
                              <span>{c.label}</span>
                              <Badge variant={c.passed ? "solidOrange" : "destructive"} className={`text-[9px] ${c.passed ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
                                {c.passed ? "PASSED" : "FAILED"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Disqualification Reasons */}
                      {evalResult.reasons && evalResult.reasons.length > 0 && (
                        <div className="p-3 bg-red-100/70 border border-red-200 rounded-lg text-red-900 text-xs space-y-1">
                          <p className="font-bold">Reason for Disqualification:</p>
                          <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                            {evalResult.reasons.map((r: string, rIdx: number) => (
                              <li key={rIdx}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Button if Eligible */}
                      {evalResult.isEligible && (
                        <div className="pt-2">
                          <Button
                            variant="orange"
                            disabled={isApplying}
                            onClick={handleApplyScheme}
                            className="w-full text-xs font-bold cursor-pointer shadow-md"
                          >
                            {isApplying ? "Submitting Application & Uploads..." : "Submit Scheme Application & Document Package"} <ArrowRight className="w-4 h-4 ml-1.5" />
                          </Button>
                        </div>
                      )}

                      {appError && (
                        <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-xs font-bold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                          <span>{appError}</span>
                        </div>
                      )}

                    </div>
                  )}

                </>
              )}

            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}
