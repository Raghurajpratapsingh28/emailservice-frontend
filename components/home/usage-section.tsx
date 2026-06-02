"use client"

import { Users, Mail, Zap } from "lucide-react"
import type { Usage } from "@/lib/billing-service"

export default function UsageSection({ usage }: { usage: Usage | null }) {
  const metrics = [
    { name: "Contacts", icon: Users, used: usage?.contacts.used ?? 0, limit: usage?.contacts.limit ?? 50000, color: "from-zinc-500 to-zinc-400" },
    { name: "Emails Sent", icon: Mail, used: usage?.emails.used ?? 0, limit: usage?.emails.limit ?? 200000, color: "from-orange-500 to-red-500" },
    { name: "Events Tracked", icon: Zap, used: usage?.events.used ?? 0, limit: usage?.events.limit ?? 500000, color: "from-blue-500 to-teal-500" },
  ]

  const period = usage
    ? `${new Date(usage.periodStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(usage.periodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : "Current billing period"

  return (
    <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white/80 tracking-tight">Usage Overview</h3>
          <p className="text-[11px] text-[#B0B8C8] mt-0.5">Track resource thresholds for this billing period.</p>
        </div>
        <div className="text-[10px] text-[#B0B8C8] bg-[#090A0E] px-3 py-1.5 rounded-xl border border-[#1C202C] mt-2 sm:mt-0">
          Billing Period: <span className="text-white/90 font-mono font-semibold">{period}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m) => {
          const pct = Math.min((m.used / m.limit) * 100, 100)
          return (
            <div key={m.name} className="p-5 rounded-2xl bg-[#08090C] border border-[#161922]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#12141A] border border-[#1E2230]"><m.icon className="w-4 h-4 text-[#A7ABB3]" /></div>
                  <span className="text-xs font-semibold text-white/95">{m.name}</span>
                </div>
                <span className="text-[10px] text-[#7A8499] font-mono">{pct.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-[#12141C] rounded-full overflow-hidden mb-3">
                <div className={`h-full bg-gradient-to-r ${m.color} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] text-[#7A8499] font-mono uppercase">Consumption</span>
                <span className="text-sm font-bold font-mono text-white/90">{m.used.toLocaleString()} <span className="text-[10px] font-medium text-[#B0B8C8]">/ {m.limit.toLocaleString()}</span></span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
