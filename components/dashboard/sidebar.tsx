"use client"

import { useState } from "react"
import {
  LayoutDashboard, Users, Megaphone, GitBranch,
  Link as LinkIcon, ShieldAlert, Layers,
  Globe, Send, CreditCard, Settings, UserCircle,
  ChevronLeft, ChevronRight, Zap, Search, LogOut
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const NAV_GROUPS = [
  {
    label: "Core",
    items: [
      { name: "Dashboard",    href: "/home",          icon: LayoutDashboard },
      { name: "Contacts",     href: "/contact",       icon: Users },
      { name: "Segments",     href: "/segments",      icon: Layers },
    ],
  },
  {
    label: "Outreach",
    items: [
      { name: "Campaigns",     href: "/campaigns",    icon: Megaphone },
      { name: "Transactional", href: "/transactional",icon: Send },
      { name: "Flow Builder",  href: "/flow-builder", icon: GitBranch },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { name: "Domains",      href: "/domains",      icon: Globe },
      { name: "Integrations", href: "/integrations", icon: LinkIcon, api: true },
      { name: "Churn Risk",   href: "/churn-risk",   icon: ShieldAlert, beta: true },
    ],
  },
  {
    label: "Workspace",
    items: [
      { name: "Billing",  href: "/billing",  icon: CreditCard },
      { name: "Settings", href: "/settings", icon: Settings },
      { name: "Account",  href: "/account",  icon: UserCircle },
    ],
  },
] as const

type NavItem = { name: string; href: string; icon: React.ElementType; api?: boolean; beta?: boolean }

export default function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return true
    const stored = localStorage.getItem("sidebar-collapsed")
    return stored === null ? true : stored === "true"
  })

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem("sidebar-collapsed", String(next))
  }

  return (
    <aside
      className={`relative flex flex-col h-screen bg-[#07080B] border-r border-white/[0.05] text-white shrink-0 font-sans select-none transition-all duration-300 ease-in-out ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* ── Brand ───────────────────────────────────── */}
      <div className={`flex items-center shrink-0 h-16 border-b border-white/[0.05] z-10 px-4 gap-3 ${collapsed ? "justify-center" : ""}`}>
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#1A1C22] border border-white/[0.08] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-[#07080B]" />
        </div>
        {!collapsed && (
          <div className="flex-1 overflow-hidden">
            <p className="text-[13px] font-bold tracking-tight text-white leading-none">EngageIQ</p>
            <p className="text-[10px] text-[#3D4255] font-mono mt-0.5 leading-none">Marketing Platform</p>
          </div>
        )}
      </div>

      {/* ── Search (expanded only) ────────────────────── */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] rounded-xl cursor-pointer transition-all group">
            <Search className="w-3.5 h-3.5 text-[#3D4255] group-hover:text-[#6B7280]" />
            <span className="text-[11px] text-[#3D4255] flex-1">Quick search...</span>
            <kbd className="text-[9px] font-mono bg-white/[0.05] border border-white/[0.07] text-[#3D4255] px-1.5 py-0.5 rounded">⌘K</kbd>
          </div>
        </div>
      )}

      {/* ── Nav groups ───────────────────────────────── */}
      <nav
        className={`flex-1 overflow-y-auto py-2 z-10 ${collapsed ? "px-2" : "px-3"}`}
        style={{ scrollbarWidth: "none" }}
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-1">
            {!collapsed && (
              <p className="text-[9px] font-mono font-semibold text-[#252830] uppercase tracking-[0.14em] px-3 pt-3 pb-1.5">
                {group.label}
              </p>
            )}
            {collapsed && <div className="h-3" />}
            {group.items.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} collapsed={collapsed} />
            ))}
          </div>
        ))}
      </nav>

      {/* ── Collapse toggle ───────────────────────────── */}
      <div className={`shrink-0 border-t border-white/[0.05] z-10 p-3 space-y-2`}>
        <button
          onClick={logout}
          className={`flex items-center gap-2.5 rounded-xl border transition-all duration-200 cursor-pointer group
            bg-white/[0.02] border-white/[0.05]
            hover:bg-red-500/10 hover:border-red-500/25
            ${collapsed ? "w-10 h-10 justify-center" : "w-full px-3 py-2.5"}`}
        >
          <LogOut className="w-4 h-4 text-[#3D4255] group-hover:text-red-400 transition-colors shrink-0" />
          {!collapsed && <span className="text-[11px] font-medium text-[#3D4255] group-hover:text-red-400 transition-colors">Logout</span>}
        </button>
        
        <button
          onClick={toggle}
          title={collapsed ? "Expand" : "Collapse"}
          className={`flex items-center gap-2.5 rounded-xl border transition-all duration-200 cursor-pointer group
            bg-white/[0.02] border-white/[0.05]
            hover:bg-white/[0.07] hover:border-white/[0.12]
            ${collapsed ? "w-10 h-10 justify-center" : "w-full px-3 py-2.5"}`}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4 text-[#3D4255] group-hover:text-[#9CA3AF] transition-colors" />
            : <>
                <ChevronLeft className="w-4 h-4 text-[#3D4255] group-hover:text-[#9CA3AF] transition-colors shrink-0" />
                <span className="text-[11px] font-medium text-[#3D4255] group-hover:text-[#9CA3AF] transition-colors">Collapse</span>
              </>
          }
        </button>
      </div>
    </aside>
  )
}

function NavLink({ item, pathname, collapsed }: { item: NavItem; pathname: string; collapsed: boolean }) {
  const isActive = pathname === item.href
  const Icon = item.icon
  const [tipY, setTipY] = useState<number | null>(null)

  return (
    <Link href={item.href}>
      <div
        className={`relative flex items-center rounded-xl cursor-pointer transition-all duration-150 group ${
          collapsed ? "justify-center p-[11px]" : "gap-3 px-3 py-2.5"
        } ${
          isActive
            ? "bg-white/[0.07] text-white"
            : "text-[#4B5563] hover:text-[#D1D5DB] hover:bg-white/[0.04]"
        }`}
        onMouseEnter={(e) => collapsed && setTipY(e.currentTarget.getBoundingClientRect().top)}
        onMouseLeave={() => setTipY(null)}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#9CA3AF] rounded-r-full" />
        )}

        <Icon className={`w-[17px] h-[17px] shrink-0 transition-colors ${
          isActive ? "text-white" : "text-[#374151] group-hover:text-[#9CA3AF]"
        }`} />

        {!collapsed && (
          <>
            <span className={`text-[12px] font-medium flex-1 leading-none ${isActive ? "text-white" : ""}`}>
              {item.name}
            </span>
            {item.beta && (
              <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#6B7280] uppercase tracking-wide">
                Beta
              </span>
            )}
            {item.api && (
              <span className="text-[11px] text-[#2D3140] group-hover:text-[#4B5563] transition-colors">↗</span>
            )}
          </>
        )}

        {/* Fixed tooltip — escapes overflow-hidden */}
        {collapsed && tipY !== null && (
          <div
            className="pointer-events-none fixed left-[76px] z-[9999] px-3 py-2 bg-[#1C1E26] border border-white/[0.1] rounded-xl text-[12px] font-medium text-white whitespace-nowrap shadow-2xl flex items-center gap-2 animate-in fade-in duration-100"
            style={{ top: tipY + 4 }}
          >
            {item.name}
            {item.beta && <span className="text-[9px] text-[#6B7280] font-mono uppercase">Beta</span>}
          </div>
        )}
      </div>
    </Link>
  )
}
