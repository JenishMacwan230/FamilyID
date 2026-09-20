"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, PhoneCall, ChevronRight, LogOut, LayoutDashboard, Building2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const loggedIn = localStorage.getItem("is_logged_in") === "true"
        const role = localStorage.getItem("user_role")
        setIsLoggedIn(loggedIn)
        setUserRole(role)
      }
    }
    checkAuth()
    window.addEventListener("storage", checkAuth)
    window.addEventListener("auth-change", checkAuth)
    return () => {
      window.removeEventListener("storage", checkAuth)
      window.removeEventListener("auth-change", checkAuth)
    }
  }, [])

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("is_logged_in")
      localStorage.removeItem("current_family_id")
      localStorage.removeItem("user_role")
      localStorage.removeItem("user_name")
      setIsLoggedIn(false)
      setUserRole(null)
      window.dispatchEvent(new Event("auth-change"))
      window.location.href = "/"
    }
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Eligible Schemes", href: "/schemes" },
    { name: "About Portal", href: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/95 backdrop-blur-md">
      {/* Top Government Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-orange-400">Government of Gujarat</span>
          <span className="hidden md:inline text-blue-200">|</span>
          <span className="hidden md:inline text-blue-100">Direct Benefit Transfer & Beneficiary Identification Portal</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <a href="tel:1800000000" className="flex items-center gap-1 hover:text-orange-300 transition-colors">
            <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Helpline:</span> 1800-XXX-XXXX
          </a>
          <span className="text-orange-400 font-bold px-2 py-0.5 rounded bg-orange-500/20 border border-orange-400/30">
            GUJARAT
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-orange-500 p-0.5 shadow-md transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-blue-900 tracking-tight">Family<span className="text-orange-500">ID</span></span>
              <Badge variant="orange" className="text-[10px] uppercase font-bold py-0">Gujarat</Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">Ek Parivar, Ek Pehchan</p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-xs"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* CTA Actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            userRole === "govt_official" ? (
              <>
                <Link href="/admin">
                  <Button variant="default" size="default" className="bg-blue-900 hover:bg-blue-950 text-white text-xs sm:text-sm font-semibold">
                    <Building2 className="w-4 h-4 mr-1.5 text-orange-400" /> Officer Console
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-xs text-slate-600 hover:text-red-600">
                  <LogOut className="w-4 h-4 mr-1" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button variant="orange" size="default" className="text-xs sm:text-sm font-semibold">
                    <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-xs text-slate-600 hover:text-red-600">
                  <LogOut className="w-4 h-4 mr-1" /> Sign Out
                </Button>
              </>
            )
          ) : (
            <Link href="/login">
              <Button variant="orange" size="default" className="text-xs sm:text-sm font-semibold">
                Sign In <ChevronRight className="w-4 h-4 ml-0.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
