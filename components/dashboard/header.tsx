"use client"

import { Search, Bell, Settings, Plus, Lock, ChevronDown } from "lucide-react"

export default function Header() {
  return (
    <header className="h-16 border-b border-[#161920] bg-[#090A0E] flex items-center justify-between px-6 select-none font-sans text-white shrink-0">
      {/* Left side profile card */}
      <div className="flex items-center gap-3 bg-[#111319]/80 border border-[#1E222E] rounded-full pl-1.5 pr-4 py-1.5 cursor-pointer hover:border-[#2A2E3D] hover:bg-[#111319] transition-all duration-300">
        <div className="w-7 h-7 rounded-full bg-[#2E313D] overflow-hidden relative">
          <img
            src="/placeholder-user.jpg"
            alt="Ryan Crawford"
            className="w-full h-full object-cover"
            onError={(e) => {
              // fallback if image not found
              e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
            }}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold">Ryan Crawford</span>
            <span className="bg-[#6B7280]/15 border border-[#6B7280]/20 text-[#9CA3AF] text-[8px] font-mono font-bold px-1 py-0.2 rounded">
              PRO
            </span>
          </div>
          <span className="text-[9px] text-[#7A8499] font-mono leading-none">@ryan997</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#7A8499] ml-1" />
      </div>

      {/* Center action button */}
      <div className="flex-1 flex justify-start pl-6">
        <button className="flex items-center gap-2 bg-[#6B7280]/15 hover:bg-[#6B7280]/25 border border-[#6B7280]/35 px-4 py-2 rounded-xl text-xs font-semibold text-[#D1D5DB] hover:text-white cursor-pointer transition-all duration-300">
          <span>Import Contacts</span>
          <Lock className="w-3 h-3 text-[#D1D5DB]" />
        </button>
      </div>

      {/* Right side navigation utilities */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <div className="relative p-2 bg-[#111319] border border-[#1E222D] rounded-xl hover:bg-[#1B1E29] hover:border-[#2C3145] text-[#B0B8C8] hover:text-white cursor-pointer transition-all duration-300">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-3 h-3 bg-[#FE5C5C] rounded-full text-[8px] font-mono font-bold text-white flex items-center justify-center border-2 border-[#090A0E]">
            2
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center bg-[#111319] border border-[#1E222D] hover:border-[#2C3145] rounded-xl transition-all duration-300 px-3 py-1.5 w-60">
          <Search className="w-3.5 h-3.5 text-[#B0B8C8] mr-2" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="bg-transparent text-xs text-white placeholder-[#7A8499] focus:outline-none w-full"
          />
          <span className="text-[9px] font-mono bg-[#1E222F] px-1.5 py-0.5 rounded border border-[#2D3246] text-[#B0B8C8] leading-none">
            ⌘K
          </span>
        </div>

        {/* Settings Action */}
        <button className="flex items-center gap-1.5 bg-[#111319] border border-[#1E222D] hover:bg-[#1B1E29] hover:border-[#2C3145] text-xs text-[#B0B8C8] hover:text-white px-3.5 py-2 rounded-xl cursor-pointer transition-all duration-300">
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>
    </header>
  )
}
