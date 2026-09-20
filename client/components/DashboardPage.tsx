"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Users,
  ShieldCheck,
  Award,
  Search,
  UserCheck,
  FileText,
  Plus,
  ArrowRight,
  Briefcase,
  Globe,
  Home,
  CheckCircle2,
  Clock,
  LogOut,
  QrCode,
  AlertCircle,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react"

export function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [loading, setLoading] = useState(true)
  const [familyData, setFamilyData] = useState<any>(null)
  const [appliedSchemes, setAppliedSchemes] = useState<any[]>([])
  const [errorMsg, setErrorMsg] = useState("")
  const [actionSuccessMsg, setActionSuccessMsg] = useState("")

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [submittingAdd, setSubmittingAdd] = useState(false)
  const [addError, setAddError] = useState("")
  const [newMember, setNewMember] = useState({
    name: "",
    aadhaar: "",
    dob: "",
    relation: "Spouse",
    income: "0",
    caste: "General",
    religion: "Hinduism",
    occupation: "Private Sector Job",
    isGovtOfficial: false,
    isAbroad: false,
  })

  // Edit Member Modal State
  const [editingMember, setEditingMember] = useState<any | null>(null)
  const [submittingEdit, setSubmittingEdit] = useState(false)
  const [editError, setEditError] = useState("")
  const [editForm, setEditForm] = useState({
    _id: "",
    name: "",
    aadhaar: "",
    dob: "",
    relation: "",
    income: "0",
    caste: "",
    religion: "",
    occupation: "Private Sector Job",
    isGovtOfficial: false,
    isAbroad: false,
  })

  // Delete Member Modal State
  const [deletingMember, setDeletingMember] = useState<any | null>(null)
  const [submittingDelete, setSubmittingDelete] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const status = localStorage.getItem("is_logged_in") === "true"
      setIsLoggedIn(status)
      const currentFamilyId = localStorage.getItem("current_family_id")
      fetchOriginalFamilyData(currentFamilyId || "")
    }
  }, [])

  const fetchOriginalFamilyData = async (familyIdQuery: string) => {
    setLoading(true)
    setErrorMsg("")
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    
    let realFamily: any = null

    try {
      // 1. Try querying specific family ID if provided
      if (familyIdQuery && familyIdQuery !== "latest") {
        const res = await fetch(`${API_URL}/api/families/${familyIdQuery}`).catch(() => null)
        if (res && res.ok) {
          const data = await res.json()
          if (data && data.familyId) realFamily = data
        }
      }

      // 2. Try querying latest family created in MongoDB
      if (!realFamily) {
        const res = await fetch(`${API_URL}/api/families/latest`).catch(() => null)
        if (res && res.ok) {
          const data = await res.json()
          if (data && data.familyId) realFamily = data
          else if (Array.isArray(data) && data.length > 0) realFamily = data[0]
        }
      }

      // 3. Fallback: try fetching all families from MongoDB
      if (!realFamily) {
        const res = await fetch(`${API_URL}/api/families`).catch(() => null)
        if (res && res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) realFamily = data[0]
        }
      }
    } catch (err: any) {
      console.error("Error fetching family data from MongoDB:", err)
    }

    if (realFamily) {
      setFamilyData(realFamily)
      if (typeof window !== "undefined" && realFamily.familyId) {
        localStorage.setItem("current_family_id", realFamily.familyId)
      }
      // Fetch applied schemes for this family from MongoDB
      try {
        const appRes = await fetch(`${API_URL}/api/schemes/family/${realFamily.familyId}`).catch(() => null)
        if (appRes && appRes.ok) {
          const apps = await appRes.json()
          setAppliedSchemes(apps)
        }
      } catch (err) {
        console.error("Error fetching scheme applications:", err)
      }
    } else {
      setFamilyData(null)
      setErrorMsg("No Family ID record found in MongoDB database. Please create a Family ID application.")
    }
    setLoading(false)
  }

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("is_logged_in")
      localStorage.removeItem("current_family_id")
      setIsLoggedIn(false)
      window.dispatchEvent(new Event("auth-change"))
      window.location.href = "/"
    }
  }

  const showSuccess = (msg: string) => {
    setActionSuccessMsg(msg)
    setTimeout(() => {
      setActionSuccessMsg("")
    }, 4000)
  }

  // --- Add Member Handlers ---
  const handleOpenAddModal = () => {
    setAddError("")
    setNewMember({
      name: "",
      aadhaar: "",
      dob: "",
      relation: "Spouse",
      income: "0",
      caste: familyData?.caste || "General",
      religion: familyData?.religion || "Hinduism",
      occupation: "Private Sector Job",
      isGovtOfficial: false,
      isAbroad: false,
    })
    setIsAddModalOpen(true)
  }

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError("")

    if (!newMember.name.trim()) {
      setAddError("Member name is required.")
      return
    }
    const cleanAadhaar = newMember.aadhaar.trim()
    if (cleanAadhaar.length !== 12 || !/^\d{12}$/.test(cleanAadhaar)) {
      setAddError("Aadhaar must be exactly 12 numeric digits.")
      return
    }
    if (!newMember.dob) {
      setAddError("Date of Birth is required.")
      return
    }

    setSubmittingAdd(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const res = await fetch(`${API_URL}/api/families/${familyData.familyId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMember,
          income: Number(newMember.income) || 0,
        }),
      })

      const result = await res.json()
      if (res.ok && result.family) {
        setFamilyData(result.family)
        setIsAddModalOpen(false)
        showSuccess(result.message || "New family member added successfully!")
      } else {
        setAddError(result.message || "Failed to add member.")
      }
    } catch (err: any) {
      setAddError("Network error. Please try again.")
    } finally {
      setSubmittingAdd(false)
    }
  }

  // --- Edit Member Handlers ---
  const handleOpenEditModal = (member: any) => {
    setEditError("")
    setEditingMember(member)
    setEditForm({
      _id: member._id || member.aadhaar,
      name: member.name || "",
      aadhaar: member.aadhaar || "",
      dob: member.dob || "",
      relation: member.relation || "Member",
      income: String(member.income || 0),
      caste: member.caste || familyData?.caste || "General",
      religion: member.religion || familyData?.religion || "Hinduism",
      occupation: member.occupation || (member.isGovtOfficial ? "Government Employee" : member.isAbroad ? "NRI / Living Abroad" : "Private Sector Job"),
      isGovtOfficial: Boolean(member.isGovtOfficial),
      isAbroad: Boolean(member.isAbroad),
    })
  }

  const handleEditMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError("")

    if (!editForm.name.trim()) {
      setEditError("Member name is required.")
      return
    }
    const cleanAadhaar = editForm.aadhaar.trim()
    if (cleanAadhaar.length !== 12 || !/^\d{12}$/.test(cleanAadhaar)) {
      setEditError("Aadhaar must be exactly 12 numeric digits.")
      return
    }
    if (!editForm.dob) {
      setEditError("Date of Birth is required.")
      return
    }

    setSubmittingEdit(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const memberIdentifier = editForm._id || editingMember.aadhaar
      const res = await fetch(`${API_URL}/api/families/${familyData.familyId}/members/${memberIdentifier}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          income: Number(editForm.income) || 0,
        }),
      })

      const result = await res.json()
      if (res.ok && result.family) {
        setFamilyData(result.family)
        setEditingMember(null)
        showSuccess(result.message || "Family member updated successfully!")
      } else {
        setEditError(result.message || "Failed to update member.")
      }
    } catch (err: any) {
      setEditError("Network error. Please try again.")
    } finally {
      setSubmittingEdit(false)
    }
  }

  // --- Delete Member Handlers ---
  const handleOpenDeleteModal = (member: any) => {
    if (member.relation === "Head of Family") {
      alert("Head of Family cannot be deleted. You can edit their member details instead.")
      return
    }
    if (familyData.members.length <= 1) {
      alert("Cannot delete the only member in a family.")
      return
    }
    setDeleteError("")
    setDeletingMember(member)
  }

  const handleDeleteMemberConfirm = async () => {
    if (!deletingMember) return
    setDeleteError("")
    setSubmittingDelete(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const memberIdentifier = deletingMember._id || deletingMember.aadhaar
      const res = await fetch(`${API_URL}/api/families/${familyData.familyId}/members/${memberIdentifier}`, {
        method: "DELETE",
      })

      const result = await res.json()
      if (res.ok && result.family) {
        setFamilyData(result.family)
        setDeletingMember(null)
        showSuccess(result.message || "Family member removed successfully!")
      } else {
        setDeleteError(result.message || "Failed to delete member.")
      }
    } catch (err: any) {
      setDeleteError("Network error. Please try again.")
    } finally {
      setSubmittingDelete(false)
    }
  }

  // Extract head name
  const headMember = familyData?.members?.find((m: any) => m.relation === "Head of Family") || familyData?.members?.[0]
  const headName = headMember?.name || "XXX (Family Head)"

  // Calculate total household income
  const totalIncome = familyData?.members?.reduce((sum: number, m: any) => sum + (Number(m.income) || 0), 0) || 0

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
      <Navbar />

      {/* Top Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="solidOrange" className="text-xs font-bold uppercase tracking-wider px-3 py-1">
                Verified Head of Family Dashboard
              </Badge>
              <Badge variant="outline" className="text-xs text-blue-200 border-blue-400/40">
                {familyData?.district || "Gujarat"} District
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome, <span className="text-orange-400">{headName}</span>
            </h1>
            <p className="text-blue-100 text-sm">
              Head of Family Profile • Family ID: <strong className="text-orange-300 font-mono">{familyData?.familyId || "GJ-2026-XXXX-XX"}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/track">
              <Button variant="orange" className="text-xs font-semibold">
                <Search className="w-4 h-4 mr-1.5" /> Track Application
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* Global Toast Success Notification */}
        {actionSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl shadow-md flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold">{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg("")} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm flex justify-center items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> Fetching family record from MongoDB...
          </div>
        ) : !familyData ? (
          <Card className="bg-white border border-slate-200 shadow-md p-8 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">No Family ID Found</h3>
              <p className="text-xs text-slate-600">
                {errorMsg || "You have not registered a Family ID record in MongoDB yet."}
              </p>
            </div>
            <Link href="/create-family">
              <Button variant="orange" className="w-full text-xs font-semibold">
                Create Family ID Application <Plus className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Top Showcase: Family Card & Track Application Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Real Digital Family Card */}
              <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white border-0 shadow-xl overflow-hidden md:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">State of Gujarat</p>
                      <CardTitle className="text-2xl font-black text-white mt-1">Official Family ID Card</CardTitle>
                    </div>
                    <Badge variant="solidOrange" className="text-xs font-bold px-3 py-1 uppercase">
                      {familyData.status || "VERIFIED"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-xs text-xs">
                    <div>
                      <p className="text-blue-200">Family ID</p>
                      <p className="font-mono font-bold text-orange-300 text-sm">{familyData.familyId}</p>
                    </div>
                    <div>
                      <p className="text-blue-200">Head of Family</p>
                      <p className="font-bold text-white text-sm">{headName}</p>
                    </div>
                    <div>
                      <p className="text-blue-200">Total Members</p>
                      <p className="font-bold text-white text-sm">{familyData.members?.length || 0} Persons</p>
                    </div>
                    <div>
                      <p className="text-blue-200">Annual Income</p>
                      <p className="font-bold text-white text-sm">₹ {totalIncome.toLocaleString()} / yr</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-100 pt-2">
                    <div>Address: <strong>{familyData.address}, {familyData.district}</strong></div>
                    <div>Social Category: <strong>{familyData.caste} ({familyData.religion})</strong></div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs text-blue-100 gap-3 border-t border-blue-500/40 pt-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-orange-400" />
                      <span>MongoDB Authenticated & Verified Proofs</span>
                    </div>
                    <div className="flex items-center gap-2 text-white font-mono">
                      <QrCode className="w-4 h-4 text-orange-300" />
                      <span>Digital QR Verified</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Track Application Section on Dashboard */}
              <Card className="bg-white border-2 border-orange-200 shadow-lg flex flex-col justify-between p-2">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
                    <Search className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900">Track Application Status</CardTitle>
                  <CardDescription className="text-xs text-slate-600">
                    Monitor document verification timestamps and officer approval logs for Family ID <strong>{familyData.familyId}</strong>.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-orange-900">Verification Status</p>
                      <p className="text-orange-700">{familyData.status || "Pending Document Review"}</p>
                    </div>
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <Link href="/track" className="w-full">
                    <Button variant="orange" size="default" className="w-full text-xs font-semibold">
                      Open Application Tracker <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

            </div>

            {/* Family Members Table Section (Head Management) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Manage Family Members</h2>
                  <p className="text-xs text-slate-500">
                    As Head of Family, you can add new members, edit details, or remove members from Family ID {familyData.familyId}.
                  </p>
                </div>
                <Button variant="orange" size="sm" onClick={handleOpenAddModal} className="text-xs font-semibold cursor-pointer shadow-sm hover:shadow">
                  <Plus className="w-4 h-4 mr-1" /> Add Family Member
                </Button>
              </div>

              <Card className="bg-white border border-slate-200 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Member Name</th>
                        <th className="p-3.5">Relation</th>
                        <th className="p-3.5">Aadhaar No (Unique)</th>
                        <th className="p-3.5">DOB</th>
                        <th className="p-3.5">Annual Income</th>
                        <th className="p-3.5">Occupation / Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {familyData.members?.map((m: any, idx: number) => {
                        const isHead = m.relation === "Head of Family"
                        const memberOccupation = m.occupation || (m.isGovtOfficial ? "Government Employee" : m.isAbroad ? "NRI / Living Abroad" : "Private Sector Job")
                        return (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                              <span>{m.name}</span>
                              {isHead && (
                                <Badge variant="solidOrange" className="text-[9px] px-1.5 py-0">HEAD</Badge>
                              )}
                            </td>
                            <td className="p-3.5 text-slate-600">{m.relation}</td>
                            <td className="p-3.5 font-mono text-slate-700">{m.aadhaar}</td>
                            <td className="p-3.5 text-slate-600">{m.dob}</td>
                            <td className="p-3.5 text-blue-700 font-bold">
                              {Number(m.income) > 0 ? `₹ ${Number(m.income).toLocaleString()}` : <span className="text-slate-400 font-normal">No Income</span>}
                            </td>
                            <td className="p-3.5">
                              <Badge variant="outline" className="text-[11px] font-semibold text-slate-800 bg-slate-100 border-slate-300">
                                {memberOccupation}
                              </Badge>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenEditModal(m)}
                                  className="h-8 px-2 text-[11px] text-blue-700 border-blue-200 hover:bg-blue-50"
                                >
                                  <Pencil className="w-3 h-3 mr-1" /> Edit
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={isHead}
                                  onClick={() => handleOpenDeleteModal(m)}
                                  className={`h-8 px-2 text-[11px] ${
                                    isHead
                                      ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-400"
                                      : "text-red-600 border-red-200 hover:bg-red-50"
                                  }`}
                                  title={isHead ? "Head of Family cannot be deleted" : "Delete member"}
                                >
                                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Applied Schemes & Benefits Status Section */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Applied Welfare Schemes & DBT Benefits</h2>
                  <p className="text-xs text-slate-500">
                    Active scheme applications submitted for members under Family ID {familyData.familyId}.
                  </p>
                </div>
                <Link href="/schemes">
                  <Button variant="orange" size="sm" className="text-xs font-semibold">
                    <Plus className="w-4 h-4 mr-1" /> Check More Schemes
                  </Button>
                </Link>
              </div>

              {appliedSchemes && appliedSchemes.length > 0 ? (
                <Card className="bg-white border border-slate-200 shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                        <tr>
                          <th className="p-3.5">App Ref No</th>
                          <th className="p-3.5">Scheme Title</th>
                          <th className="p-3.5">Applicant Member</th>
                          <th className="p-3.5">Aadhaar No</th>
                          <th className="p-3.5">Verification Slot</th>
                          <th className="p-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {appliedSchemes.map((app: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3.5 font-mono font-bold text-orange-600">{app.applicationNo}</td>
                            <td className="p-3.5 font-bold text-slate-900">{app.schemeTitle}</td>
                            <td className="p-3.5 text-slate-700">{app.applicantName}</td>
                            <td className="p-3.5 font-mono text-slate-600">{app.applicantAadhaar}</td>
                            <td className="p-3.5 text-xs text-blue-900 font-semibold">{app.verificationSlot || "Sep 22, 2026 • 10:00 AM"}</td>
                            <td className="p-3.5">
                              <Badge variant="solidOrange" className="text-[10px]">
                                {app.status || "Submitted"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : (
                <Card className="bg-white border border-dashed border-slate-300 p-6 text-center space-y-2">
                  <p className="text-xs text-slate-500 font-medium">
                    No active scheme applications submitted yet for this family card.
                  </p>
                  <Link href="/schemes">
                    <Button variant="outline" size="sm" className="text-xs font-semibold">
                      Browse Gujarat Welfare Schemes & Apply
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          </>
        )}

      </main>

      {/* --- ADD MEMBER MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-8">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Add Family Member</h3>
                <p className="text-xs text-blue-200">Linked to Family ID {familyData?.familyId}</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="p-6 space-y-4 text-xs">
              {addError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{addError}</span>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="add-name" className="font-semibold text-slate-700">Full Name *</Label>
                <Input
                  id="add-name"
                  placeholder="e.g. Ramesh Macwan"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="add-aadhaar" className="font-semibold text-slate-700">Aadhaar Number (12 Digits) *</Label>
                  <Input
                    id="add-aadhaar"
                    placeholder="123456789012"
                    maxLength={12}
                    value={newMember.aadhaar}
                    onChange={(e) => setNewMember({ ...newMember, aadhaar: e.target.value.replace(/\D/g, "") })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="add-dob" className="font-semibold text-slate-700">Date of Birth *</Label>
                  <Input
                    id="add-dob"
                    type="date"
                    value={newMember.dob}
                    onChange={(e) => setNewMember({ ...newMember, dob: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="add-relation" className="font-semibold text-slate-700">Relation to Head *</Label>
                  <select
                    id="add-relation"
                    className="w-full h-9 px-3 border border-slate-300 rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={newMember.relation}
                    onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Daughter-in-law">Daughter-in-law</option>
                    <option value="Grandson">Grandson</option>
                    <option value="Granddaughter">Granddaughter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="add-income" className="font-semibold text-slate-700">Annual Income (₹)</Label>
                  <Input
                    id="add-income"
                    type="number"
                    placeholder="0"
                    value={newMember.income}
                    onChange={(e) => setNewMember({ ...newMember, income: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="add-caste" className="font-semibold text-slate-700">Category / Caste</Label>
                  <select
                    id="add-caste"
                    className="w-full h-9 px-3 border border-slate-300 rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={newMember.caste}
                    onChange={(e) => setNewMember({ ...newMember, caste: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="add-occupation" className="font-semibold text-slate-700">Occupation / Work Status *</Label>
                  <select
                    id="add-occupation"
                    className="w-full h-9 px-3 border border-slate-300 rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={newMember.occupation}
                    onChange={(e) => {
                      const val = e.target.value
                      setNewMember({
                        ...newMember,
                        occupation: val,
                        isGovtOfficial: val === "Government Employee",
                        isAbroad: val === "NRI / Living Abroad",
                      })
                    }}
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
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMember.isGovtOfficial}
                    onChange={(e) => setNewMember({ ...newMember, isGovtOfficial: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <span className="font-medium text-slate-800">Is Government Employee?</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMember.isAbroad}
                    onChange={(e) => setNewMember({ ...newMember, isAbroad: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded border-slate-300"
                  />
                  <span className="font-medium text-slate-800">Is Living Abroad / NRI?</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="orange" disabled={submittingAdd}>
                  {submittingAdd ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                  Save Member
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT MEMBER MODAL --- */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-8">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Edit Member Details</h3>
                <p className="text-xs text-blue-200">Updating member record: {editingMember.name}</p>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditMemberSubmit} className="p-6 space-y-4 text-xs">
              {editError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="edit-name" className="font-semibold text-slate-700">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="edit-aadhaar" className="font-semibold text-slate-700">Aadhaar Number *</Label>
                  <Input
                    id="edit-aadhaar"
                    maxLength={12}
                    value={editForm.aadhaar}
                    onChange={(e) => setEditForm({ ...editForm, aadhaar: e.target.value.replace(/\D/g, "") })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="edit-dob" className="font-semibold text-slate-700">Date of Birth *</Label>
                  <Input
                    id="edit-dob"
                    type="date"
                    value={editForm.dob}
                    onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="edit-relation" className="font-semibold text-slate-700">Relation to Head *</Label>
                  <select
                    id="edit-relation"
                    disabled={editingMember.relation === "Head of Family"}
                    className="w-full h-9 px-3 border border-slate-300 rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100"
                    value={editForm.relation}
                    onChange={(e) => setEditForm({ ...editForm, relation: e.target.value })}
                  >
                    <option value="Head of Family">Head of Family</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Daughter-in-law">Daughter-in-law</option>
                    <option value="Grandson">Grandson</option>
                    <option value="Granddaughter">Granddaughter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="edit-income" className="font-semibold text-slate-700">Annual Income (₹)</Label>
                  <Input
                    id="edit-income"
                    type="number"
                    value={editForm.income}
                    onChange={(e) => setEditForm({ ...editForm, income: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="edit-caste" className="font-semibold text-slate-700">Category / Caste</Label>
                  <select
                    id="edit-caste"
                    className="w-full h-9 px-3 border border-slate-300 rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={editForm.caste}
                    onChange={(e) => setEditForm({ ...editForm, caste: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="edit-occupation" className="font-semibold text-slate-700">Occupation / Work Status *</Label>
                  <select
                    id="edit-occupation"
                    className="w-full h-9 px-3 border border-slate-300 rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={editForm.occupation}
                    onChange={(e) => {
                      const val = e.target.value
                      setEditForm({
                        ...editForm,
                        occupation: val,
                        isGovtOfficial: val === "Government Employee",
                        isAbroad: val === "NRI / Living Abroad",
                      })
                    }}
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
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isGovtOfficial}
                    onChange={(e) => setEditForm({ ...editForm, isGovtOfficial: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <span className="font-medium text-slate-800">Is Government Employee?</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isAbroad}
                    onChange={(e) => setEditForm({ ...editForm, isAbroad: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded border-slate-300"
                  />
                  <span className="font-medium text-slate-800">Is Living Abroad / NRI?</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={() => setEditingMember(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="orange" disabled={submittingEdit}>
                  {submittingEdit ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Pencil className="w-4 h-4 mr-1" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Remove Family Member</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                {deleteError}
              </div>
            )}

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900">{deletingMember.name}</strong> (Aadhaar: <span className="font-mono">{deletingMember.aadhaar}</span>) from Family ID <strong>{familyData?.familyId}</strong>?
            </p>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={() => setDeletingMember(null)}>
                Cancel
              </Button>
              <Button type="button" variant="orange" onClick={handleDeleteMemberConfirm} disabled={submittingDelete} className="bg-red-600 hover:bg-red-700 text-white">
                {submittingDelete ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Trash2 className="w-4 h-4 mr-1" />}
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
