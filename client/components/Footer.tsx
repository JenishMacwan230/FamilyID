"use client"

import React from "react"
import Link from "next/link"
import { Users, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">Family<span className="text-orange-400">ID</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gujarat State Direct Benefit Transfer & Beneficiary Identification System. Ensuring transparent, duplicate-free welfare distribution.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#" className="hover:text-orange-400 transition-colors">Create Family ID</Link></li>
              <li><Link href="#" className="hover:text-orange-400 transition-colors">Verify Mobile OTP</Link></li>
              <li><Link href="#" className="hover:text-orange-400 transition-colors">Check Eligible Schemes</Link></li>
              <li><Link href="#" className="hover:text-orange-400 transition-colors">Split Family Unit</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Government Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="https://gujaratindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors">Gujarat Portal</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Digital Gujarat Services</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">DBT Gujarat</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Help & Support</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-orange-400" /> 1800-XXX-XXXX (Toll Free)</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-orange-400" /> support@familyid.gujarat.gov.in</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-400" /> Gandhinagar, Gujarat 382010</p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Government of Gujarat. All Rights Reserved.</p>
          <p className="text-slate-400 font-medium">Family ID Gujarat - Beneficiary Portal</p>
        </div>
      </div>
    </footer>
  )
}
