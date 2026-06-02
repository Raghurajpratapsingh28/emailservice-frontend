"use client"

import { Campaign } from "@/lib/campaigns-data"
import { X, AlertCircle, Send, Users, Mail } from "lucide-react"

interface Props {
  campaign: Campaign | null
  onClose: () => void
  onConfirm: (campaign: Campaign) => void
}

export default function SendNowDialog({ campaign, onClose, onConfirm }: Props) {
  if (!campaign) return null

  const warnings: string[] = []
  if (!campaign.segmentId) warnings.push("No segment selected — campaign will have 0 recipients.")
  if (!campaign.htmlBody?.trim()) warnings.push("Campaign HTML body is empty.")
  if (!campaign.subject?.trim()) warnings.push("Subject line is empty.")
  if (!campaign.fromEmail?.trim()) warnings.push("Sender email is not set.")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C]">
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Send Campaign</span>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white">Send "{campaign.name}" now?</h2>
            <p className="text-xs text-[#B0B8C8] mt-1 leading-relaxed">
              This will immediately queue the campaign for delivery. This action cannot be undone.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#08090C] border border-[#1E2230] space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[#7A8499] font-mono"><Users className="w-3 h-3" /> Recipients</span>
              <span className="text-white/80 font-mono font-semibold">
                {campaign.recipientCount > 0 ? campaign.recipientCount.toLocaleString() : "—"}
                {campaign.segmentName && <span className="text-[#6B7280] font-normal"> · {campaign.segmentName}</span>}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[#7A8499] font-mono"><Mail className="w-3 h-3" /> From</span>
              <span className="text-white/80 font-mono">{campaign.fromEmail || "—"}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-[#7A8499] font-mono shrink-0">Subject</span>
              <span className="text-white/80 truncate max-w-[180px] text-right">{campaign.subject || "—"}</span>
            </div>
          </div>

          {warnings.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
              {warnings.map((w) => (
                <div key={w} className="flex items-start gap-2 text-xs text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1C202C]">
          <button onClick={onClose} className="px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(campaign); onClose() }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#FE8A5C] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-orange-500/15 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Send Now
          </button>
        </div>
      </div>
    </div>
  )
}
