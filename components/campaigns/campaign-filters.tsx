"use client"

import { CampaignStatus } from "@/lib/campaigns-data"
import { Search, ChevronDown } from "lucide-react"

interface Props {
  search: string
  setSearch: (v: string) => void
  status: string
  setStatus: (v: string) => void
  dateFrom: string
  setDateFrom: (v: string) => void
  dateTo: string
  setDateTo: (v: string) => void
}

const STATUSES: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "sending", label: "Sending" },
  { value: "sent", label: "Sent" },
  { value: "paused", label: "Paused" },
  { value: "failed", label: "Failed" },
]

export default function CampaignFilters({ search, setSearch, status, setStatus, dateFrom, setDateFrom, dateTo, setDateTo }: Props) {
  return (
    <div className="p-4 rounded-2xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8499]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search campaigns..."
          className="w-full pl-9 pr-3 py-2 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white placeholder-[#7A8499] focus:outline-none transition-colors"
        />
      </div>

      {/* Status */}
      <div className="relative">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white/80 font-mono cursor-pointer focus:outline-none transition-colors"
        >
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#7A8499] pointer-events-none" />
      </div>

      {/* Date range */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white/80 font-mono focus:outline-none transition-colors cursor-pointer"
        />
        <span className="text-[10px] text-[#7A8499] font-mono">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white/80 font-mono focus:outline-none transition-colors cursor-pointer"
        />
      </div>

      {(search || status !== "all" || dateFrom || dateTo) && (
        <button
          onClick={() => { setSearch(""); setStatus("all"); setDateFrom(""); setDateTo("") }}
          className="text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-colors cursor-pointer"
        >
          Clear
        </button>
      )}
    </div>
  )
}
