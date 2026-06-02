"use client"

import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

interface Props { segments: Array<{ id: string; name: string; contactCount: number }>; total: number; workspaceId: string }

export default function SegmentsSection({ segments, total, workspaceId }: Props) {
  const router = useRouter()

  return (
    <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white/80 tracking-tight">Segments</h3>
            <p className="text-[11px] text-[#B0B8C8] mt-0.5">Top segments by contact weight.</p>
          </div>
          <div className="flex items-baseline gap-1 bg-[#12141A] px-3 py-1 rounded-xl border border-[#1E2230]">
            <span className="text-lg font-bold font-mono text-blue-400">{total}</span>
            <span className="text-[10px] text-[#B0B8C8] font-mono">Total</span>
          </div>
        </div>
        <div className="space-y-2 mt-2">
          {segments.length === 0 && <p className="text-xs text-[#7A8499] font-mono px-1">No segments yet.</p>}
          {segments.map((seg, idx) => (
            <div key={seg.id} className="p-3 bg-[#08090C] hover:bg-[#11131A] border border-[#161922] rounded-xl flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#B0B8C8]">0{idx + 1}</span>
                <h4 className="text-xs font-semibold text-white/95">{seg.name}</h4>
              </div>
              <span className="text-[11px] font-mono font-semibold bg-blue-500/10 border border-blue-500/25 text-blue-400 px-2 py-0.5 rounded-lg">
                {seg.contactCount.toLocaleString()} profiles
              </span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => router.push(`/segments/${workspaceId}`)} className="mt-5 w-full py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
        <Plus className="w-4 h-4 text-blue-400" /> Manage Segments
      </button>
    </div>
  )
}
