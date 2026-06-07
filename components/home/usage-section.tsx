"use client"

import { Mail, Zap, Database } from "lucide-react"
import type { Usage } from "@/lib/billing-service"

export default function UsageSection({ usage }: { usage: Usage | null }) {
  const metrics = [
    { label: "Emails Sent", count: usage?.emailsSent ?? 0, limit: usage?.emailLimit ?? 10000, icon: Mail, color: "#696CFF" },
    { label: "Contacts", count: usage?.contactsCount ?? 0, limit: usage?.contactsLimit ?? 5000, icon: Database, color: "#00E5FF" },
    { label: "Workflows", count: usage?.workflowsCount ?? 0, limit: usage?.workflowsLimit ?? 20, icon: Zap, color: "#FF5A4F" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((m) => {
        const pct = Math.min(100, Math.round((m.count / m.limit) * 100))
        return (
          <div key={m.label} className="p-5 enterprise-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#0D0E12] flex items-center justify-center">
                  <m.icon className="w-5 h-5" style={{ color: m.color }} />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#FFFFFF]">{m.label}</h3>
                  <p className="text-[11px] text-[#8A8D96] font-medium mt-0.5">Monthly Quota</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[16px] font-bold text-[#FFFFFF]">{m.count.toLocaleString()}</span>
                <span className="text-[12px] font-medium text-[#8A8D96] ml-1">/ {m.limit.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium" style={{ color: m.color }}>{pct}% Used</span>
                {pct >= 90 && <span className="text-[10px] font-bold text-[#FF5A4F] px-2 py-0.5 bg-[#FF5A4F]/10 rounded-[6px]">Warning</span>}
              </div>
              <div className="w-full h-1.5 bg-[#0D0E12] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%`, backgroundColor: m.color }} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
