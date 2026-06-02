"use client"

import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import type { Campaign } from "@/lib/campaigns-data"

const STATUS_CLS: Record<string, string> = {
  sent: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
  sending: "bg-blue-500/10 border-blue-500/25 text-blue-400",
  scheduled: "bg-zinc-500/10 border-zinc-500/25 text-zinc-400",
  draft: "bg-zinc-500/10 border-zinc-500/25 text-zinc-400",
  paused: "bg-amber-500/10 border-amber-500/25 text-amber-400",
  failed: "bg-red-500/10 border-red-500/25 text-red-400",
}

interface Props { campaigns: Campaign[]; total: number; workspaceId: string }

export default function CampaignsSection({ campaigns, total, workspaceId }: Props) {
  const router = useRouter()
  const counts = campaigns.reduce((acc, c) => { acc[c.status] = (acc[c.status] ?? 0) + 1; return acc }, {} as Record<string, number>)

  return (
    <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white/80 tracking-tight">Campaigns Status</h3>
            <p className="text-[11px] text-[#B0B8C8] mt-0.5">Detailed breakdown of broadcast outputs.</p>
          </div>
          <div className="flex items-baseline gap-1 bg-[#12141A] px-3 py-1 rounded-xl border border-[#1E2230]">
            <span className="text-lg font-bold font-mono text-white">{total}</span>
            <span className="text-[10px] text-[#B0B8C8] font-mono">Total</span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center bg-[#08090C] rounded-2xl border border-[#161922] p-3 mb-4">
          {["draft", "scheduled", "sending", "sent", "paused"].map(s => (
            <div key={s} className="border-r border-[#1E2230] last:border-0">
              <p className="text-[9px] text-[#7A8499] font-mono uppercase">{s}</p>
              <p className="text-sm font-bold font-mono text-white/90 mt-1">{counts[s] ?? 0}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-[10px] text-[#7A8499] font-mono uppercase pl-1">Recent Campaigns</p>
          {campaigns.length === 0 && <p className="text-xs text-[#7A8499] font-mono px-1">No campaigns yet.</p>}
          {campaigns.map((c) => (
            <button key={c.id} onClick={() => router.push(`/campaigns/${workspaceId}/details/${c.id}`)} className="w-full p-3 bg-[#08090C] hover:bg-[#11131A] border border-[#161922] rounded-xl flex items-center justify-between transition-colors cursor-pointer text-left">
              <div>
                <h4 className="text-xs font-semibold text-white/95">{c.name}</h4>
                <p className="text-[9px] text-[#7A8499] font-mono mt-1">Recipients: <span className="text-white/70">{c.recipientCount.toLocaleString()}</span></p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[9px] font-mono px-2 py-0.5 border rounded-full capitalize ${STATUS_CLS[c.status] ?? STATUS_CLS.draft}`}>{c.status}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => router.push(`/campaigns/${workspaceId}/create`)} className="mt-5 w-full py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
        <Plus className="w-4 h-4 text-[#FE8A5C]" /> Create New Campaign
      </button>
    </div>
  )
}
