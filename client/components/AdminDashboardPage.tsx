"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Building2,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Users,
  Eye,
  LogOut,
  AlertTriangle,
  RefreshCw,
  X,
  Filter,
  Check,
  Trash2,
  AlertCircle,
  FileCheck,
  Calendar,
  Home,
  Briefcase,
  FileSpreadsheet,
  Download,
  ExternalLink,
  CheckSquare,
  Award
} from "lucide-react"

export function AdminDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [officerName, setOfficerName] = useState("Gujarat Verification Officer")
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [actionSuccessMsg, setActionSuccessMsg] = useState("")
  const [actionErrorMsg, setActionErrorMsg] = useState("")

  // Inspect Modal State
  const [inspectingApp, setInspectingApp] = useState<any | null>(null)
  const [updatingStatusNo, setUpdatingStatusNo] = useState<string>("")
  const [deletingNo, setDeletingNo] = useState<string>("")

  // Document Viewer Preview Modal State
  const [previewingDoc, setPreviewingDoc] = useState<any | null>(null)

  // Delete Confirmation Modal State
  const [confirmDeleteApp, setConfirmDeleteApp] = useState<any | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("is_logged_in") === "true"
      const storedName = localStorage.getItem("user_name")
      
      setIsLoggedIn(loggedIn)
      if (storedName) setOfficerName(storedName)

      fetchAdminApplications()
    }
  }, [])

  const fetchAdminApplications = async () => {
    setLoading(true)
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    try {
      const res = await fetch(`${API_URL}/api/schemes/admin/all-applications`).catch(() => null)
      if (res && res.ok) {
        const data = await res.json()
        setApplications(data)
      } else {
        setApplications([])
      }
    } catch (err) {
      console.error("Error fetching applications for admin review:", err)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (applicationNo: string, newStatus: string) => {
    setUpdatingStatusNo(applicationNo)
    setActionSuccessMsg("")
    setActionErrorMsg("")

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    try {
      const res = await fetch(`${API_URL}/api/schemes/admin/application/${applicationNo}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()

      if (res.ok) {
        setActionSuccessMsg(data.message || `Application ${applicationNo} marked as '${newStatus}' successfully!`)
        // Update local state
        setApplications((prev) =>
          prev.map((app) => (app.applicationNo === applicationNo ? { ...app, status: newStatus } : app))
        )
        if (inspectingApp && inspectingApp.applicationNo === applicationNo) {
          setInspectingApp({ ...inspectingApp, status: newStatus })
        }
        setTimeout(() => setActionSuccessMsg(""), 4000)
      } else {
        setActionErrorMsg(data.message || "Failed to update application status")
      }
    } catch (err: any) {
      setActionErrorMsg("Network error updating application status.")
    } finally {
      setUpdatingStatusNo("")
    }
  }

  const handleDeleteApplication = async (applicationNo: string) => {
    setDeletingNo(applicationNo)
    setActionSuccessMsg("")
    setActionErrorMsg("")

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    try {
      const res = await fetch(`${API_URL}/api/schemes/admin/application/${applicationNo}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (res.ok) {
        setActionSuccessMsg(data.message || `Application ${applicationNo} deleted successfully from MongoDB!`)
        setApplications((prev) => prev.filter((app) => app.applicationNo !== applicationNo))
        if (inspectingApp && inspectingApp.applicationNo === applicationNo) {
          setInspectingApp(null)
        }
        setConfirmDeleteApp(null)
        setTimeout(() => setActionSuccessMsg(""), 4000)
      } else {
        setActionErrorMsg(data.message || "Failed to delete application")
      }
    } catch (err: any) {
      setActionErrorMsg("Network error deleting application.")
    } finally {
      setDeletingNo("")
    }
  }

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("is_logged_in")
      localStorage.removeItem("user_role")
      localStorage.removeItem("user_name")
      window.dispatchEvent(new Event("auth-change"))
      window.location.href = "/login"
    }
  }

  // Generate complete required documents checklist for any application
  const getRequiredDocumentsForApp = (app: any) => {
    const docs: {
      title: string
      filename: string
      description: string
      status: "Verified" | "Submitted" | "Required"
      category: string
    }[] = []

    const isReserved = app.caste && ["OBC", "SEBC / OBC", "SC", "ST", "EWS"].includes(app.caste)

    if (app.type === "FAMILY_CARD" || app.schemeId === "family-id-registration") {
      docs.push({
        title: "Head of Family Aadhaar Identification Proof",
        filename: `Aadhaar_${app.applicantName?.replace(/\s+/g, "_") || "Head"}.pdf`,
        description: "Original 12-digit Aadhaar Card & Biometric Proof",
        status: "Verified",
        category: "Identity Proof",
      })
      docs.push({
        title: "Gujarat Family Household Ration Card / Address Proof",
        filename: app.documentUploaded || "Ration_Card_Family_Proof.pdf",
        description: "Official Mamlatdar / Jan Seva Kendra Household Ration Card",
        status: "Verified",
        category: "Residence Proof",
      })
      docs.push({
        title: "Annual Household Income Declaration Certificate",
        filename: `Income_Certificate_2026_${app.familyId}.pdf`,
        description: "Revenue Department Annual Household Income Certificate",
        status: "Verified",
        category: "Income Proof",
      })
      if (isReserved) {
        docs.push({
          title: `Official Category / Caste Certificate (${app.caste})`,
          filename: app.casteCertificateUploaded || `Caste_Certificate_${app.caste}.pdf`,
          description: `Sub-Divisional Magistrate / Mamlatdar Issued ${app.caste} Certificate`,
          status: "Verified",
          category: "Caste Proof",
        })
      }
      docs.push({
        title: "All Household Family Members Aadhaar Proof Package",
        filename: `Family_Members_Aadhaar_Docs_${app.familyId}.pdf`,
        description: "Aadhaar cards for all registered family members",
        status: "Verified",
        category: "Member Proof",
      })

      return docs
    }

    // SCHEME SPECIFIC REQUIREMENTS
    switch (app.schemeId) {
      case "ma-yojana":
        docs.push({
          title: "Mukhyamantri Amrutam (MA) Health Card Beneficiary Proof",
          filename: app.documentUploaded || "MA_Yojana_Beneficiary_Proof.pdf",
          description: "BPL / Low Income Medical Coverage Health Card Document",
          status: "Verified",
          category: "Medical Scheme Proof",
        })
        docs.push({
          title: "Mamlatdar Family Income Certificate (≤ ₹4,00,000 / yr)",
          filename: "Income_Proof_Mamlatdar.pdf",
          description: "Official Tehsildar income proof below ₹4 Lakh ceiling",
          status: "Verified",
          category: "Income Ceiling Proof",
        })
        docs.push({
          title: "Gujarat Ration Card / Family Residence Proof",
          filename: "Ration_Card_Proof.pdf",
          description: "Resident verification proof in empaneled hospital database",
          status: "Verified",
          category: "Resident Proof",
        })
        if (isReserved) {
          docs.push({
            title: `Official ${app.caste} Caste Certificate`,
            filename: app.casteCertificateUploaded || `Caste_Certificate_${app.caste}.pdf`,
            description: "Required reserved category caste proof document",
            status: "Verified",
            category: "Caste Proof",
          })
        }
        break

      case "mysy-scholarship":
        docs.push({
          title: "Class 10th / 12th Board Academic Marksheet (≥ 80% Cutoff)",
          filename: app.documentUploaded || "Board_Marksheet_10th_12th.pdf",
          description: "GSEB / CBSE Board Passing Certificate & Marksheet showing ≥ 80%",
          status: "Verified",
          category: "Academic Proof",
        })
        docs.push({
          title: "College / University Admission Fee Receipt & Student ID",
          filename: "College_Admission_Fee_Receipt.pdf",
          description: "Higher education diploma/degree admission fee receipt",
          status: "Verified",
          category: "Student Proof",
        })
        docs.push({
          title: "Family Household Income Certificate (≤ ₹6,00,000 / yr)",
          filename: "Income_Certificate_Mamlatdar.pdf",
          description: "Competent authority family income proof",
          status: "Verified",
          category: "Income Proof",
        })
        docs.push({
          title: "Student Bank Account Passbook / Aadhaar Link Proof",
          filename: "Bank_Passbook_DBT.pdf",
          description: "Direct Benefit Transfer active bank account passbook copy",
          status: "Verified",
          category: "DBT Bank Proof",
        })
        if (isReserved) {
          docs.push({
            title: `Category Certificate (${app.caste})`,
            filename: app.casteCertificateUploaded || `Caste_Certificate_${app.caste}.pdf`,
            description: "Reserved category quota verification certificate",
            status: "Verified",
            category: "Caste Proof",
          })
        }
        break

      case "krishi-sahay":
        docs.push({
          title: "Land Ownership Record Form 7/12 & 8A",
          filename: app.documentUploaded || "Land_Ownership_Record_7_12.pdf",
          description: "Official Revenue Land Record 7/12 & 8A proof for agricultural land",
          status: "Verified",
          category: "Land Record",
        })
        docs.push({
          title: "Farmer Identity Card / i-Khedut Registration Proof",
          filename: "Farmer_Krishi_Card_Proof.pdf",
          description: "Gujarat i-Khedut portal registered farmer profile",
          status: "Verified",
          category: "Farmer Proof",
        })
        docs.push({
          title: "Agricultural Crop Survey / Compensation Verification",
          filename: "Crop_Loss_Verification.pdf",
          description: "Talati/Gram Sevak certified agricultural crop record",
          status: "Verified",
          category: "Crop Verification",
        })
        docs.push({
          title: "Farmer Bank Account Passbook for Compensation Transfer",
          filename: "Bank_Passbook_DBT.pdf",
          description: "Bank account copy for direct crop subsidy credit",
          status: "Verified",
          category: "Bank DBT Proof",
        })
        break

      case "pmay-housing":
        docs.push({
          title: "Family Income Certificate (≤ ₹3,00,000) or EWS Proof",
          filename: app.documentUploaded || "EWS_Income_Proof.pdf",
          description: "Low Income Group (LIG) or EWS category certificate",
          status: "Verified",
          category: "Income / EWS Proof",
        })
        docs.push({
          title: "No-Pucca House Ownership Declaration Affidavit",
          filename: "No_House_Declaration.pdf",
          description: "Affidavit certifying non-ownership of permanent home in India",
          status: "Verified",
          category: "Housing Affidavit",
        })
        docs.push({
          title: "Gujarat Resident Domicile & Electricity Bill Proof",
          filename: "Domicile_Electricity_Proof.pdf",
          description: "Proof of long-term residence in Gujarat municipality/gram panchayat",
          status: "Verified",
          category: "Residence Proof",
        })
        break

      case "vayo-vandana":
        docs.push({
          title: "Senior Citizen Age Proof (Aadhaar / Birth Certificate Age ≥ 60)",
          filename: app.documentUploaded || "Senior_Citizen_Age_Proof.pdf",
          description: "Aadhaar Card / Voter ID proving applicant age is 60+ years",
          status: "Verified",
          category: "Age Proof",
        })
        docs.push({
          title: "Gujarat Permanent Resident Domicile Certificate",
          filename: "Gujarat_Domicile_Proof.pdf",
          description: "State domicile proof for senior citizen pension eligibility",
          status: "Verified",
          category: "Domicile Proof",
        })
        docs.push({
          title: "Senior Citizen Bank Passbook for Monthly Pension Direct Credit",
          filename: "Bank_Passbook_Pension.pdf",
          description: "Aadhaar linked bank account for monthly pension transfer",
          status: "Verified",
          category: "Pension Bank Proof",
        })
        break

      default:
        docs.push({
          title: "Applicant Identity & Gujarat Residence Proof",
          filename: app.documentUploaded || "Verified_Proof.pdf",
          description: "Standard Gujarat DBT scheme identity proof",
          status: "Verified",
          category: "General Proof",
        })
        break
    }

    return docs
  }

  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === "All" || app.status === statusFilter
    const matchesType = typeFilter === "All" || app.type === typeFilter
    const matchesSearch =
      app.applicationNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.familyId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.schemeTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesType && matchesSearch
  })

  // Summary counts
  const totalApps = applications.length
  const pendingCount = applications.filter((a) => a.status === "Submitted" || a.status === "Pending Verification").length
  const approvedCount = applications.filter((a) => a.status === "Approved" || a.status === "Verified").length
  const rejectedCount = applications.filter((a) => a.status === "Rejected").length

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
      <Navbar />

      {/* Top Officer Header */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="solidOrange" className="text-xs font-bold uppercase tracking-wider px-3 py-1">
                Gujarat State Official Verification Center
              </Badge>
              <Badge variant="outline" className="text-xs text-orange-300 border-orange-400/40 font-mono">
                Officer Username: Familyadmin
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <Building2 className="w-8 h-8 text-orange-400" />
              <span>{officerName}</span>
            </h1>
            <p className="text-slate-300 text-sm">
              Citizen Application Queue • Scheme Eligibility Verification & Family ID Approval Console
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchAdminApplications}
              className="text-xs text-white border-white/30 hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh Queue
            </Button>
            <Button variant="ghost" onClick={handleSignOut} className="text-xs text-red-300 hover:text-red-100 hover:bg-red-500/20">
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Policy Enforced Banner */}
        <div className="bg-blue-900 text-white p-4 rounded-xl shadow-md border border-blue-700 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-orange-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm text-orange-300">
              State Policy Enforced: Restricted Government Data Access (Use Case #8)
            </p>
            <p className="text-blue-100">
              Under Gujarat Beneficiary Management Rules, government officers can inspect family details, documents, and member lists <strong>only for citizen applications that have been submitted</strong> for verification or scheme benefits.
            </p>
          </div>
        </div>

        {/* Global Action Notifications */}
        {actionSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl shadow-md flex items-center justify-between animate-fade-in text-xs font-bold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg("")} className="text-emerald-700 hover:text-emerald-950">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {actionErrorMsg && (
          <div className="bg-red-50 border border-red-300 text-red-900 px-4 py-3 rounded-xl shadow-md flex items-center justify-between animate-fade-in text-xs font-bold">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>{actionErrorMsg}</span>
            </div>
            <button onClick={() => setActionErrorMsg("")} className="text-red-700 hover:text-red-950">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-l-4 border-l-blue-600 shadow-md">
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Total Submissions</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{totalApps}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-orange-500 shadow-md">
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Pending Verification</p>
                <p className="text-3xl font-black text-orange-600 mt-1">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-emerald-600 shadow-md">
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Verified / Approved</p>
                <p className="text-3xl font-black text-emerald-600 mt-1">{approvedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-red-600 shadow-md">
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Rejected / Flagged</p>
                <p className="text-3xl font-black text-red-600 mt-1">{rejectedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <XCircle className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <Input
              placeholder="Search by App No (e.g. SCH-2026 / GJ-2026), Name, Family ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              {["All", "SCHEME", "FAMILY_CARD"].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-2.5 py-1 rounded transition-all ${
                    typeFilter === type
                      ? "bg-blue-900 text-white shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {type === "All" ? "All Types" : type === "SCHEME" ? "Welfare Schemes" : "Family Cards"}
                </button>
              ))}
            </div>

            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

            {["All", "Submitted", "Under Review", "Approved", "Rejected"].map((st) => (
              <Button
                key={st}
                variant={statusFilter === st ? "orange" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(st)}
                className="text-xs font-semibold rounded-lg shrink-0 h-9"
              >
                {st}
              </Button>
            ))}
          </div>
        </div>

        {/* Submitted Applications Table */}
        <Card className="bg-white border border-slate-200 shadow-xl overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" /> Submitted Citizen Application Verification Queue
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Every application has a unique reference number. Click on any application to view all required documents, family details, and take officer action.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs text-slate-700 bg-white font-mono font-bold">
                {filteredApps.length} Record(s)
              </Badge>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Application Ref No</th>
                  <th className="p-3.5">Type & Scheme Title</th>
                  <th className="p-3.5">Applicant Name & Aadhaar</th>
                  <th className="p-3.5">Family ID</th>
                  <th className="p-3.5">Verification Slot / Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Loading citizen applications from MongoDB...
                    </td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No citizen applications found matching the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app: any, idx: number) => {
                    const isUpdating = updatingStatusNo === app.applicationNo
                    const isDeleting = deletingNo === app.applicationNo
                    const isFamilyCard = app.type === "FAMILY_CARD"

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                        onClick={() => setInspectingApp(app)}
                      >
                        <td className="p-3.5 font-mono font-bold text-blue-900 flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="underline decoration-blue-300 underline-offset-2">{app.applicationNo}</span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Badge variant={isFamilyCard ? "outline" : "solidOrange"} className="text-[9px] px-1.5 py-0 uppercase">
                              {isFamilyCard ? "Family Card Reg" : app.category || "Scheme"}
                            </Badge>
                          </div>
                          <p className="font-bold text-slate-900">{app.schemeTitle}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">{app.applicantName}</p>
                          <p className="font-mono text-[11px] text-slate-500">{app.applicantAadhaar}</p>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-orange-600">{app.familyId}</td>
                        <td className="p-3.5 text-xs text-slate-700 font-semibold">{app.verificationSlot || "Pending Appointment"}</td>
                        <td className="p-3.5">
                          <Badge
                            className={`text-[10px] font-bold uppercase ${
                              app.status === "Approved" || app.status === "Verified"
                                ? "bg-emerald-600 text-white"
                                : app.status === "Rejected"
                                ? "bg-red-600 text-white"
                                : app.status === "Under Review"
                                ? "bg-amber-500 text-white"
                                : "bg-blue-100 text-blue-900 border border-blue-300"
                            }`}
                          >
                            {app.status || "Submitted"}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setInspectingApp(app)}
                              className="h-8 px-2 text-[11px] text-blue-800 border-blue-200 hover:bg-blue-50 font-semibold"
                            >
                              Inspect Details
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isUpdating || app.status === "Approved" || app.status === "Verified"}
                              onClick={() => handleUpdateStatus(app.applicationNo, "Approved")}
                              className="h-8 px-2 text-[11px] text-emerald-700 border-emerald-300 hover:bg-emerald-50 font-semibold"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" /> Approve
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isUpdating || app.status === "Rejected"}
                              onClick={() => handleUpdateStatus(app.applicationNo, "Rejected")}
                              className="h-8 px-2 text-[11px] text-red-700 border-red-300 hover:bg-red-50 font-semibold"
                            >
                              <X className="w-3.5 h-3.5 mr-1" /> Reject
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isDeleting}
                              onClick={() => setConfirmDeleteApp(app)}
                              className="h-8 px-2 text-[11px] text-slate-600 border-slate-300 hover:bg-red-50 hover:text-red-700 font-semibold"
                              title="Delete application record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </main>

      {/* DETAILED INSPECTION MODAL (Shows scheme requirements, all submitted documents, family details, & action buttons) */}
      {inspectingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <Card className="bg-white border-2 border-blue-900 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden relative my-6 animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <CardHeader className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 relative shrink-0">
              <button
                type="button"
                onClick={() => setInspectingApp(null)}
                className="absolute right-4 top-4 text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Badge variant="solidOrange" className="text-[10px] uppercase font-bold">
                  {inspectingApp.type === "FAMILY_CARD" ? "Family ID Verification" : "Scheme Application Review"}
                </Badge>
                <span className="text-xs text-blue-200">Enforcing Gujarat Use Case #8</span>
              </div>
              <CardTitle className="text-xl font-bold text-white mt-1 flex items-center justify-between pr-8">
                <span>Application Ref: <strong className="font-mono text-orange-400">{inspectingApp.applicationNo}</strong></span>
              </CardTitle>
            </CardHeader>

            {/* Modal Content */}
            <CardContent className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Application Summary Box */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-blue-800 font-bold uppercase">{inspectingApp.schemeTitle}</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">
                      Applicant: {inspectingApp.applicantName} (Aadhaar: <span className="font-mono text-blue-900">{inspectingApp.applicantAadhaar}</span>)
                    </p>
                  </div>
                  <Badge
                    className={`text-[10px] font-bold uppercase ${
                      inspectingApp.status === "Approved" || inspectingApp.status === "Verified"
                        ? "bg-emerald-600 text-white"
                        : inspectingApp.status === "Rejected"
                        ? "bg-red-600 text-white"
                        : inspectingApp.status === "Under Review"
                        ? "bg-amber-500 text-white"
                        : "bg-blue-900 text-white"
                    }`}
                  >
                    Current Status: {inspectingApp.status || "Submitted"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-blue-200/60">
                  <div>
                    <span className="text-slate-500">Family ID:</span>
                    <p className="font-mono font-bold text-orange-600">{inspectingApp.familyId}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Category / Caste:</span>
                    <p className="font-bold text-slate-900">{inspectingApp.caste || "General"}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Annual Income:</span>
                    <p className="font-bold text-blue-900">₹ {(Number(inspectingApp.income) || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Verification Window:</span>
                    <p className="font-semibold text-slate-800 text-[11px]">{inspectingApp.verificationSlot}</p>
                  </div>
                </div>
              </div>

              {/* ALL SUBMITTED REQUIRED DOCUMENTS CHECKLIST */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-blue-600" /> Complete Required Documents Verification Checklist
                  </h4>
                  <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-700">
                    {getRequiredDocumentsForApp(inspectingApp).length} Mandatory Documents
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getRequiredDocumentsForApp(inspectingApp).map((doc, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 transition-all flex flex-col justify-between space-y-2"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5">
                          <Badge variant="outline" className="text-[9px] text-blue-800 bg-blue-50 border-blue-200 mb-1">
                            {doc.category}
                          </Badge>
                          <p className="font-bold text-slate-900 text-xs">{doc.title}</p>
                          <p className="text-[11px] text-slate-500">{doc.description}</p>
                        </div>
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-200/70 text-[11px]">
                        <span className="font-mono text-blue-900 font-semibold truncate max-w-[180px]" title={doc.filename}>
                          📄 {doc.filename}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPreviewingDoc({
                              ...doc,
                              appNo: inspectingApp.applicationNo,
                              applicantName: inspectingApp.applicantName,
                              familyId: inspectingApp.familyId,
                            })
                          }
                          className="h-7 text-[10px] px-2 text-blue-700 border-blue-300 hover:bg-blue-100 font-semibold"
                        >
                          <Eye className="w-3 h-3 mr-1" /> Preview Document
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Family Household Inspection (UseCase #8) */}
              {inspectingApp.familyDetails && (
                <div className="space-y-3 p-4 bg-orange-50/70 border border-orange-200 rounded-xl">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-orange-950 text-xs flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-orange-600" /> Family Household Data & Member Roster (Use Case #8)
                    </h4>
                    <span className="text-[11px] font-mono text-orange-800 font-bold">
                      {inspectingApp.familyDetails.totalMembers} Members Registered
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-lg border border-orange-200">
                    <div>
                      <span className="text-slate-500">Address:</span>
                      <p className="font-semibold text-slate-900">{inspectingApp.familyDetails.address}, {inspectingApp.familyDetails.district}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Social Category:</span>
                      <p className="font-semibold text-slate-900">{inspectingApp.familyDetails.caste} ({inspectingApp.familyDetails.religion})</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Head Mobile:</span>
                      <p className="font-mono font-semibold text-slate-900">+91 {inspectingApp.familyDetails.headMobile}</p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <p className="font-bold text-slate-800 text-[11px] mb-2">Member Breakdown:</p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {inspectingApp.familyDetails.members?.map((m: any, mIdx: number) => (
                        <div key={mIdx} className="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center text-[11px]">
                          <div>
                            <span className="font-bold text-slate-900">{m.name}</span>
                            <span className="text-slate-500 ml-1.5">({m.relation} • {m.occupation || "Member"})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-slate-600">Aadhaar: {m.aadhaar}</span>
                            <span className="font-bold text-blue-700">₹ {(Number(m.income) || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Officer Verdict Action Controls at bottom */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Government Officer Verification Verdict:</p>
                
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="orange"
                      size="sm"
                      onClick={() => handleUpdateStatus(inspectingApp.applicationNo, "Approved")}
                      className="text-xs font-bold cursor-pointer"
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve / Verify Benefit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(inspectingApp.applicationNo, "Under Review")}
                      className="text-xs font-semibold text-amber-800 border-amber-300 bg-amber-50 hover:bg-amber-100 cursor-pointer"
                    >
                      <Clock className="w-4 h-4 mr-1" /> Set in Pending List / Review
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(inspectingApp.applicationNo, "Rejected")}
                      className="text-xs font-semibold text-red-700 border-red-300 bg-red-50 hover:bg-red-100 cursor-pointer"
                    >
                      <X className="w-4 h-4 mr-1" /> Reject Application
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDeleteApp(inspectingApp)}
                    className="text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 mr-1 text-red-500" /> Delete Application
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="bg-white border-2 border-blue-900 shadow-2xl max-w-2xl w-full overflow-hidden text-xs">
            <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-950 text-white p-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">Jan Seva Kendra Document Preview</p>
                <CardTitle className="text-lg font-bold text-white mt-0.5">{previewingDoc.title}</CardTitle>
              </div>
              <button
                onClick={() => setPreviewingDoc(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 flex justify-between items-center font-mono text-xs">
                <div>
                  <p className="font-bold text-slate-900">Filename: {previewingDoc.filename}</p>
                  <p className="text-[11px] text-slate-500">Application Ref: {previewingDoc.appNo} • Family ID: {previewingDoc.familyId}</p>
                </div>
                <Badge variant="solidOrange" className="text-[9px]">PDF/A Signed</Badge>
              </div>

              {/* Simulated Document Viewer Certificate Paper Box */}
              <div className="border-2 border-slate-300 rounded-xl p-6 bg-amber-50/30 text-center space-y-4 shadow-inner">
                <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-7 h-7 text-orange-400" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-blue-950 uppercase tracking-wide">Government of Gujarat</h3>
                  <p className="text-xs text-slate-700 font-bold">Revenue & Direct Benefit Transfer Department</p>
                  <p className="text-[11px] text-slate-500">{previewingDoc.title} — Verified Official Record</p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-lg text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Applicant Name:</span>
                    <strong className="text-slate-900">{previewingDoc.applicantName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Document Type:</span>
                    <strong className="text-blue-900">{previewingDoc.category}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Verification Authority:</span>
                    <strong className="text-slate-900">Mamlatdar & Revenue Officer, Gujarat</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Digital Seal Status:</span>
                    <strong className="text-emerald-700 font-mono">✓ Verified Digital Signature (e-Sign)</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  This document has been uploaded by the applicant and verified against the Gujarat State Database.
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-slate-500">File format: PDF Document (1.8 MB)</span>
                <Button variant="outline" size="sm" onClick={() => setPreviewingDoc(null)} className="text-xs font-semibold">
                  Close Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmDeleteApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="bg-white border-2 border-red-300 shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Delete Application Record?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete application <strong className="font-mono text-red-600">{confirmDeleteApp.applicationNo}</strong> ({confirmDeleteApp.applicantName}) from MongoDB? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full text-xs font-semibold"
                onClick={() => setConfirmDeleteApp(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="w-full text-xs font-bold bg-red-600 hover:bg-red-700"
                onClick={() => handleDeleteApplication(confirmDeleteApp.applicationNo)}
              >
                Yes, Delete Record
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}
