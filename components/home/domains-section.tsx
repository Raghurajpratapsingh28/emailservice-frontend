"use client"

import { useRouter } from "next/navigation"
import { Globe, Plus, CheckCircle2 } from "lucide-react"

interface Props { verified: number; pending: number; workspaceId: string }

export default function DomainsSection({ verified, pending, workspaceId }: Props) {
  const router = useRouter()

  return (
    <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
      <div className="flex items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white/80 tracking-tight">Sending Domains</h3>
          <p className="text-[11px] text-[#B0B8C8] mt-0.5">Verification status of mailing domains.</p>
        </div>
        <div className="flex items-baseline gap-1 bg-[#12141A] px-3 py-1 rounded-xl border border-[#1E2230]">
          <span className="text-lg font-bold font-mono text-[#3CD3AD]">{verified}</span>
          <span className="text-[10px] text-[#B0B8C8] font-mono">Verified</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 p-3 bg-[#08090C] border border-[#161922] rounded-xl flex-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <p className="text-[9px] font-mono text-[#7A8499] uppercase">Verified</p>
            <p className="text-sm font-bold font-mono text-emerald-400">{verified}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-[#08090C] border border-[#161922] rounded-xl flex-1">
          <Globe className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <p className="text-[9px] font-mono text-[#7A8499] uppercase">Pending</p>
            <p className="text-sm font-bold font-mono text-amber-400">{pending}</p>
          </div>
        </div>
      </div>
      <button onClick={() => router.push(`/domains/${workspaceId}`)} className="mt-4 w-full py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
        <Plus className="w-4 h-4 text-[#3CD3AD]" /> Manage Domains
      </button>
    </div>
  )
}
