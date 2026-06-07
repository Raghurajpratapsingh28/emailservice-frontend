"use client"

import { useRouter } from "next/navigation"
import { Megaphone, Plus, ArrowUpRight } from "lucide-react"
import type { Campaign } from "@/lib/campaigns-data"

interface Props { campaigns: Campaign[]; total: number; workspaceId: string }

export default function CampaignsSection({ campaigns, total, workspaceId }: Props) {
  const router = useRouter()

  return (
    <div className="p-5 enterprise-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[#FF5A4F]/10 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-[#FF5A4F]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#FFFFFF] tracking-tight">Recent Campaigns</h3>
            </div>
          </div>
          <button onClick={() => router.push(`/campaigns/${workspaceId}`)} className="text-[12px] text-[#8A8D96] hover:text-[#FFFFFF] transition-colors flex items-center gap-1 cursor-pointer">
            View All <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {campaigns.length === 0 && <p className="text-[12px] text-[#8A8D96] px-1 font-medium">No campaigns found.</p>}
          {campaigns.map((c) => (
            <div key={c.id} className="w-full p-4 enterprise-panel enterprise-card-interactive flex items-center justify-between cursor-pointer" onClick={() => router.push(`/campaigns/${workspaceId}/details/${c.id}`)}>
              <div>
                <h4 className="text-[13px] font-bold text-[#FFFFFF]">{c.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[6px] ${
                    c.status === "sent" ? "bg-[#696CFF]/10 text-[#696CFF]" :
                    c.status === "draft" ? "bg-[#8A8D96]/10 text-[#8A8D96]" :
                    "bg-[#FFB020]/10 text-[#FFB020]"
                  }`}>
                    {c.status.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-medium text-[#8A8D96]">
                    {c.metrics?.sent ? `${c.metrics.sent.toLocaleString()} sent` : "—"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#8A8D96] font-medium uppercase tracking-wider mb-1">Open Rate</p>
                <p className="text-[14px] font-bold text-[#FFFFFF]">
                  {c.metrics?.openRate ? `${(c.metrics.openRate * 100).toFixed(1)}%` : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => router.push(`/campaigns/${workspaceId}/create`)} className="mt-6 w-full py-3 enterprise-btn text-[#FFFFFF] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer border border-[#202126] hover:border-[#FF5A4F] transition-all">
        <Plus className="w-4 h-4 text-[#FF5A4F]" /> New Campaign
      </button>
    </div>
  )
}
