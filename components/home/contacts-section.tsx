"use client"

import { useRouter } from "next/navigation"
import { Users, Plus, Upload, ArrowUpRight } from "lucide-react"

interface Props { total: number; workspaceId: string }

export default function ContactsSection({ total, workspaceId }: Props) {
  const router = useRouter()

  return (
    <div className="p-5 enterprise-card flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[#696CFF]/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#696CFF]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#FFFFFF] tracking-tight">Audience Growth</h3>
          </div>
          <button onClick={() => router.push(`/contact/${workspaceId}`)} className="text-[12px] text-[#8A8D96] hover:text-[#FFFFFF] transition-colors flex items-center gap-1 cursor-pointer">
            View All <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-end gap-3 mb-6">
          <h2 className="text-4xl font-bold text-[#FFFFFF] tracking-tight">{total.toLocaleString()}</h2>
          <span className="text-[12px] font-bold text-[#696CFF] mb-1.5 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +12.5%
          </span>
        </div>

        <div className="h-32 w-full flex items-end justify-between gap-1 mt-4">
          {/* Simulated chart bars matching the dark aesthetic */}
          {[40, 65, 45, 80, 55, 90, 75, 100, 85, 110, 95, 120].map((h, i) => (
            <div key={i} className="w-full bg-[#202126] rounded-t-[4px] relative group transition-all hover:bg-[#696CFF]" style={{ height: `${(h / 120) * 100}%` }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#25262B] text-[#FFFFFF] text-[10px] px-2 py-1 rounded-[4px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                {h * 10}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button onClick={() => router.push(`/contact/${workspaceId}`)} className="py-3 enterprise-btn text-[#FFFFFF] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer border border-[#202126] hover:border-[#696CFF] transition-all">
          <Plus className="w-4 h-4 text-[#696CFF]" /> Add Contact
        </button>
        <button onClick={() => router.push(`/contact/${workspaceId}`)} className="py-3 enterprise-btn text-[#FFFFFF] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer border border-[#202126] hover:border-[#8A8D96] transition-all">
          <Upload className="w-4 h-4 text-[#8A8D96]" /> Import CSV
        </button>
      </div>
    </div>
  )
}
