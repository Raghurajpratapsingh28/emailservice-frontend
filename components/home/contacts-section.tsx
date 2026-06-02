"use client"

import { useRouter } from "next/navigation"
import { Plus, TrendingUp } from "lucide-react"

interface Props { total: number; workspaceId: string }

export default function ContactsSection({ total, workspaceId }: Props) {
  const router = useRouter()

  return (
    <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white/80 tracking-tight">Contacts</h3>
            <p className="text-[11px] text-[#B0B8C8] mt-0.5">Total subscribers in this workspace.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#3CD3AD] font-mono font-semibold bg-[#3CD3AD]/10 border border-[#3CD3AD]/25 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live count
            </span>
            <div className="flex items-baseline gap-1 bg-[#12141A] px-3 py-1 rounded-xl border border-[#1E2230]">
              <span className="text-lg font-bold font-mono text-white">{total.toLocaleString()}</span>
              <span className="text-[10px] text-[#B0B8C8] font-mono">Contacts</span>
            </div>
          </div>
        </div>
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl font-extrabold font-mono text-white/90">{total.toLocaleString()}</p>
            <p className="text-xs text-[#7A8499] font-mono mt-2">total contacts in workspace</p>
          </div>
        </div>
      </div>
      <button onClick={() => router.push(`/contact/${workspaceId}`)} className="mt-5 w-full py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
        <Plus className="w-4 h-4 text-[#3CD3AD]" /> Manage Contacts
      </button>
    </div>
  )
}
