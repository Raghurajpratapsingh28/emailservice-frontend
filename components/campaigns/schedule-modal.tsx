"use client"

import { useState } from "react"
import { Campaign } from "@/lib/campaigns-data"
import { X, Calendar } from "lucide-react"

interface Props {
  campaign: Campaign | null
  onClose: () => void
  onConfirm: (campaign: Campaign, scheduledAt: string) => void
}

export default function ScheduleModal({ campaign, onClose, onConfirm }: Props) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  const [dateTime, setDateTime] = useState(tomorrow)
  const [error, setError] = useState("")

  if (!campaign) return null

  const segment = { name: campaign.segmentName, count: campaign.recipientCount }

  const handleConfirm = () => {
    const selected = new Date(dateTime)
    if (selected <= new Date()) {
      setError("Schedule time must be in the future.")
      return
    }
    if (selected > new Date(Date.now() + 365 * 86400000)) {
      setError("Schedule time must be within 1 year.")
      return
    }
    onConfirm(campaign, selected.toISOString())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C]">
          <div>
            <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Schedule Campaign</span>
            <h2 className="text-sm font-bold text-white mt-0.5 truncate max-w-[280px]">{campaign.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Recipient info */}
          <div className="p-3.5 rounded-2xl bg-[#08090C] border border-[#1E2230] text-xs text-[#B0B8C8]">
            Will send to{" "}
            <span className="font-mono font-semibold text-white/80">~{segment.count.toLocaleString()} contacts</span>
            {" "}in segment{" "}
            <span className="text-[#9CA3AF] font-semibold">{segment.name}</span>
          </div>

          {/* Date/time picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80 tracking-tight flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Schedule Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => { setDateTime(e.target.value); setError("") }}
              className="w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white font-mono focus:outline-none transition-colors cursor-pointer"
            />
            <p className="text-[10px] text-[#7A8499] font-mono">Timezone: UTC+5:30 (IST)</p>
            {error && <p className="text-[10px] text-red-400 font-mono">{error}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1C202C]">
          <button onClick={onClose} className="px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">
            Cancel
          </button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/15 transition-all cursor-pointer">
            Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  )
}
