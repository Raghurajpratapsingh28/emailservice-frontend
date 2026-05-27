"use client"

import { Search, Calendar, ChevronDown, Check, X } from "lucide-react"

interface ContactFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  lifecycleStage: string
  setLifecycleStage: (stage: string) => void
  selectedTags: string[]
  toggleTag: (tag: string) => void
  showSuppressed: boolean
  setShowSuppressed: (val: boolean) => void
  showUnsubscribed: boolean
  setShowUnsubscribed: (val: boolean) => void
  dateFrom: string
  setDateFrom: (val: string) => void
  dateTo: string
  setDateTo: (val: string) => void
  availableTags: string[]
}

export default function ContactFilters({
  searchQuery,
  setSearchQuery,
  lifecycleStage,
  setLifecycleStage,
  selectedTags,
  toggleTag,
  showSuppressed,
  setShowSuppressed,
  showUnsubscribed,
  setShowUnsubscribed,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  availableTags
}: ContactFiltersProps) {
  return (
    <div className="p-5 rounded-2xl bg-[#0F1016]/90 border border-[#1C202C] select-none font-sans text-white space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* 1. Search Query Fuzzy Field (Col span 4) */}
        <div className="md:col-span-4 relative flex items-center bg-[#08090C] border border-[#1E222D] hover:border-[#2C3145] focus-within:border-[#6B7280]/50 rounded-xl transition-all duration-300 px-3 py-2 w-full">
          <Search className="w-4 h-4 text-[#B0B8C8] mr-2" />
          <input
            type="text"
            placeholder="Search email, first name, last name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-[#7A8499] focus:outline-none w-full font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-[#7A8499] hover:text-white transition-colors cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 2. Lifecycle Stage Selector (Col span 3) */}
        <div className="md:col-span-3 relative flex items-center bg-[#08090C] border border-[#1E222D] rounded-xl hover:border-[#2C3145] px-3 py-2 w-full">
          <span className="text-[10px] text-[#7A8499] font-mono mr-2 uppercase">Stage:</span>
          <select
            value={lifecycleStage}
            onChange={(e) => setLifecycleStage(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-[#7A8499] focus:outline-none w-full font-semibold cursor-pointer appearance-none pr-6"
          >
            <option value="all" className="bg-[#0F1016]">All Stages</option>
            <option value="lead" className="bg-[#0F1016]">Lead</option>
            <option value="prospect" className="bg-[#0F1016]">Prospect</option>
            <option value="customer" className="bg-[#0F1016]">Customer</option>
            <option value="churned" className="bg-[#0F1016]">Churned</option>
            <option value="unqualified" className="bg-[#0F1016]">Unqualified</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#7A8499] absolute right-3 pointer-events-none" />
        </div>

        {/* 3. Created Date Range Picker (Col span 5) */}
        <div className="md:col-span-5 flex items-center bg-[#08090C] border border-[#1E222D] rounded-xl hover:border-[#2C3145] px-3 py-1.5 gap-2 w-full">
          <Calendar className="w-4 h-4 text-[#B0B8C8] shrink-0" />
          <div className="flex items-center gap-1.5 w-full">
            <span className="text-[10px] text-[#7A8499] font-mono uppercase">From:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none w-full font-mono cursor-pointer"
            />
            <span className="text-[10px] text-[#7A8499] font-mono uppercase">To:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none w-full font-mono cursor-pointer"
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setDateFrom("")
                  setDateTo("")
                }}
                className="text-[#7A8499] hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Filter Row: Tags and Suppression Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-[#1C202C]/60">
        {/* Multi-select Tags Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Tags Filter:</span>
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-semibold border transition-all duration-300 cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? "bg-[#6B7280]/20 border-[#6B7280]/55 text-[#9CA3AF]"
                    : "bg-[#08090C] border-[#1E2230] text-[#B0B8C8] hover:border-[#2C3145] hover:text-white"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-[#9CA3AF]" />}
                <span>{tag}</span>
              </button>
            )
          })}
          {selectedTags.length > 0 && (
            <button
              onClick={() => selectedTags.forEach((t) => toggleTag(t))}
              className="text-[9px] font-mono text-[#FE5C5C] hover:underline cursor-pointer ml-1"
            >
              Clear Tags
            </button>
          )}
        </div>

        {/* Suppression & Subscription Toggles */}
        <div className="flex items-center gap-4">
          {/* Suppressed Toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showSuppressed}
              onChange={(e) => setShowSuppressed(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#1E2230] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#B0B8C8] peer-checked:after:bg-white after:border-none after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FE5C5C] relative border border-transparent peer-focus:outline-none" />
            <span className="text-xs font-semibold text-[#B0B8C8] peer-checked:text-[#FE5C5C] transition-colors leading-none">
              Suppressed Only
            </span>
          </label>

          {/* Unsubscribed Toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showUnsubscribed}
              onChange={(e) => setShowUnsubscribed(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#1E2230] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#B0B8C8] peer-checked:after:bg-white after:border-none after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FE8A5C] relative border border-transparent peer-focus:outline-none" />
            <span className="text-xs font-semibold text-[#B0B8C8] peer-checked:text-[#FE8A5C] transition-colors leading-none">
              Unsubscribed Only
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
