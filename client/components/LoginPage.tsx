"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { API_URL } from "@/lib/api"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, KeyRound, ArrowRight, CheckCircle2, AlertCircle, PlusCircle, Building2, UserCheck } from "lucide-react"

export function LoginPage() {
  const router = useRouter()
  const [loginMethod, setLoginMethod] = useState<"mobile" | "familyId" | "official">("mobile")
  const [mobileNumber, setMobileNumber] = useState("")
  const [familyId, setFamilyId] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  
  // Government Official Credentials
  const [adminUsername, setAdminUsername] = useState("Familyadmin")
  const [adminPassword, setAdminPassword] = useState("123456789")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    if (loginMethod === "mobile" && (!mobileNumber || mobileNumber.length < 10)) {
      setErrorMsg("Please enter a valid 10-digit mobile number")
      return
    }
    if (loginMethod === "familyId" && !familyId) {
      setErrorMsg("Please enter a valid Family ID (e.g., GJ-2026-9842-10)")
      return
    }
    setOtpSent(true)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (otp.trim() !== "111111") {
      setErrorMsg("Invalid OTP. Please enter test 6-digit OTP: 111111")
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/families/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: loginMethod === "mobile" ? mobileNumber : undefined,
          familyId: loginMethod === "familyId" ? familyId : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.message || "Login failed")
        return
      }

      setIsVerified(true)
      if (typeof window !== "undefined") {
        localStorage.setItem("is_logged_in", "true")
        localStorage.setItem("user_role", "citizen")
        if (data.family?.familyId) {
          localStorage.setItem("current_family_id", data.family.familyId)
        }
        window.dispatchEvent(new Event("auth-change"))
      }

      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
    } catch (err: any) {
      setIsVerified(true)
      if (typeof window !== "undefined") {
        localStorage.setItem("is_logged_in", "true")
        localStorage.setItem("user_role", "citizen")
        window.dispatchEvent(new Event("auth-change"))
      }
      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setIsSubmitting(true)

    try {
      const res = await fetch(`${API_URL}/api/families/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: adminUsername.trim(),
          password: adminPassword.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.message || "Invalid Government Official credentials.")
        setIsSubmitting(false)
        return
      }

      setIsVerified(true)
      if (typeof window !== "undefined") {
        localStorage.setItem("is_logged_in", "true")
        localStorage.setItem("user_role", "govt_official")
        localStorage.setItem("user_name", data.officerName || "Gujarat Beneficiary Verification Officer")
        window.dispatchEvent(new Event("auth-change"))
      }

      setTimeout(() => {
        router.push("/admin")
      }, 500)
    } catch (err: any) {
      // Fallback if backend unreachable
      if (adminUsername.trim() === "Familyadmin" && adminPassword.trim() === "123456789") {
        setIsVerified(true)
        if (typeof window !== "undefined") {
          localStorage.setItem("is_logged_in", "true")
          localStorage.setItem("user_role", "govt_official")
          localStorage.setItem("user_name", "Gujarat Beneficiary Verification Officer")
          window.dispatchEvent(new Event("auth-change"))
        }
        setTimeout(() => {
          router.push("/admin")
        }, 500)
      } else {
        setErrorMsg("Invalid Government Official credentials.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          
          {/* Top Branding & Badge */}
          <div className="text-center space-y-2">
            <Badge variant="solidOrange" className="text-xs font-bold uppercase tracking-wider px-3 py-1">
              Gujarat State Portal
            </Badge>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Portal Sign In
            </h1>
            <p className="text-sm text-slate-600">
              Sign in as Head of Family or Government Official to manage beneficiary verification records.
            </p>
          </div>

          <Card className="bg-white border border-slate-200 shadow-xl overflow-hidden">
            
            {/* Header Tabs */}
            <div className="grid grid-cols-3 text-center border-b border-slate-200 bg-slate-100/70 p-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("mobile")
                  setOtpSent(false)
                  setIsVerified(false)
                  setErrorMsg("")
                }}
                className={`py-2 rounded-lg transition-all ${
                  loginMethod === "mobile"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Mobile + OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("familyId")
                  setOtpSent(false)
                  setIsVerified(false)
                  setErrorMsg("")
                }}
                className={`py-2 rounded-lg transition-all ${
                  loginMethod === "familyId"
                    ? "bg-white text-orange-600 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Family ID + OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("official")
                  setOtpSent(false)
                  setIsVerified(false)
                  setErrorMsg("")
                }}
                className={`py-2 rounded-lg transition-all ${
                  loginMethod === "official"
                    ? "bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Govt Official
              </button>
            </div>

            <CardContent className="p-6 space-y-6">
              
              {isVerified ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">Successfully Authenticated!</h3>
                    <p className="text-xs text-slate-600">
                      Redirecting to {loginMethod === "official" ? "Government Official Portal" : "Family Dashboard"}...
                    </p>
                  </div>
                </div>
              ) : loginMethod === "official" ? (
                /* Government Official Login Form */
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-700 shrink-0" />
                    <div>
                      <p className="font-bold">Gujarat Government Officer Portal</p>
                      <p className="text-[11px] text-blue-800">Review submitted scheme applications & verify family data.</p>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="admin-username">Officer Username *</Label>
                    <Input
                      id="admin-username"
                      type="text"
                      placeholder="Familyadmin"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      required
                      className="h-11 font-mono font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="admin-password">Officer Password *</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="•••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="h-11 font-mono"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} variant="default" className="w-full h-11 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs uppercase tracking-wider">
                    {isSubmitting ? "Authenticating Officer..." : "Sign In as Govt Official"} <ShieldCheck className="w-4 h-4 ml-1.5 text-orange-400" />
                  </Button>
                </form>
              ) : !otpSent ? (
                /* Step 1: Input Mobile or Family ID */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {loginMethod === "mobile" ? (
                    <div className="space-y-1.5">
                      <Label htmlFor="mobile">Mobile Number (Head of Family)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">+91</span>
                        <Input
                          id="mobile"
                          type="tel"
                          maxLength={10}
                          placeholder="9876543210"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                          className="pl-12 h-11"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">OTP will be sent to the registered mobile number.</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label htmlFor="familyIdInput">Gujarat Family ID Number</Label>
                      <Input
                        id="familyIdInput"
                        placeholder="e.g. GJ-2026-9842-10"
                        value={familyId}
                        onChange={(e) => setFamilyId(e.target.value)}
                        className="h-11"
                      />
                      <p className="text-[11px] text-slate-500">Enter your 12-character state Family ID.</p>
                    </div>
                  )}

                  <Button type="submit" variant="orange" className="w-full h-11 font-semibold text-sm">
                    Send Verification OTP <ShieldCheck className="w-4 h-4 ml-1.5" />
                  </Button>
                </form>
              ) : (
                /* Step 2: OTP Verification */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex justify-between items-center">
                    <div>
                      <p className="font-bold">OTP sent to {loginMethod === "mobile" ? `+91 ${mobileNumber}` : familyId}</p>
                      <p className="text-blue-700">Enter test 6-digit OTP: <strong>111111</strong></p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-orange-600 font-bold underline"
                    >
                      Change
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="otp">Enter 6-Digit Security OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      maxLength={6}
                      placeholder="111111"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="h-11 text-center font-mono text-lg tracking-widest"
                    />
                  </div>

                  <Button type="submit" variant="default" className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold">
                    Verify & Sign In <KeyRound className="w-4 h-4 ml-1.5" />
                  </Button>
                </form>
              )}

            </CardContent>

            {/* Footer option */}
            <CardFooter className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-600">Need a Family ID?</span>
              <Link href="/create-family" className="text-orange-600 font-bold hover:underline flex items-center gap-1">
                <PlusCircle className="w-3.5 h-3.5" /> Create Family ID →
              </Link>
            </CardFooter>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  )
}
