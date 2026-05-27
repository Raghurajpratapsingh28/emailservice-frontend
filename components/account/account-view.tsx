"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ProfileTab from "./profile-tab"
import SecurityTab from "./security-tab"
import { User, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type Tab = "profile" | "security"

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile",  label: "Profile",  icon: User },
  { id: "security", label: "Security", icon: Shield },
]

export default function AccountView() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>("profile")

  if (!user) return null

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1200px] mx-auto select-none">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6B7280] to-[#6B7280] flex items-center justify-center text-base font-bold text-white shadow-lg shadow-[#6B7280]/20">
          {user.firstName[0]}{user.lastName[0]}
        </div>
        <div>
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Personal Account</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white/95 mt-0.5">{user.firstName} {user.lastName}</h1>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <nav className="w-44 shrink-0 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                tab === id
                  ? "bg-[#6B7280]/10 border border-[#6B7280]/25 text-[#9CA3AF]"
                  : "text-[#B0B8C8] hover:bg-[#12141A] hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === "profile"  && <ProfileTab />}
          {tab === "security" && <SecurityTab />}
        </div>
      </div>
    </motion.div>
  )
}
