"use client"

import { useRouter } from "next/navigation"
import { Layers, Plus, ArrowUpRight } from "lucide-react"

interface Segment { id: string; name: string; contactCount: number }
interface Props { segments: Segment[]; total: number; workspaceId: string }

export default function SegmentsSection({ segments, total, workspaceId }: Props) {
  const router = useRouter()

  return (
    <div className="p-5 enterprise-card flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[#FFB020]/10 flex items-center justify-center">
              <Layers className="w-4 h-4 text-[#FFB020]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#FFFFFF] tracking-tight">Active Segments</h3>
          </div>
          <button onClick={() => router.push(`/segments/${workspaceId}`)} className="text-[12px] text-[#8A8D96] hover:text-[#FFFFFF] transition-colors flex items-center gap-1 cursor-pointer">
            View All <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {segments.length === 0 && <p className="text-[12px] text-[#8A8D96] px-1 font-medium">No segments created.</p>}
          {segments.map((s) => (
            <div key={s.id} className="w-full p-4 enterprise-panel enterprise-card-interactive flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-[8px] bg-[#0D0E12] shrink-0">
                  <Layers className="w-4 h-4 text-[#FFB020]" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#FFFFFF]">{s.name}</h4>
                  <p className="text-[11px] text-[#8A8D96] font-medium mt-0.5">Filter Definition</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#8A8D96] font-medium uppercase tracking-wider">Size</p>
                <p className="text-[14px] font-bold text-[#FFFFFF] mt-0.5">{s.contactCount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => router.push(`/segments/${workspaceId}`)} className="mt-6 w-full py-3 enterprise-btn text-[#FFFFFF] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer border border-[#202126] hover:border-[#FFB020] transition-all">
        <Plus className="w-4 h-4 text-[#FFB020]" /> Build Segment
      </button>
    </div>
  )
}
