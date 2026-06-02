"use client"

import { useRouter } from "next/navigation"
import { Megaphone, UserPlus, FileText, GitBranch } from "lucide-react"

export default function QuickActions({ workspaceId }: { workspaceId: string }) {
  const router = useRouter()
  const actions = [
    { label: "Create Campaign", desc: "Broadcast push", icon: Megaphone, color: "hover:border-[#FE8A5C] hover:bg-[#FE8A5C]/5", href: `/campaigns/${workspaceId}/create` },
    { label: "Add Contact", desc: "Profile ingest", icon: UserPlus, color: "hover:border-[#3CD3AD] hover:bg-[#3CD3AD]/5", href: `/contact/${workspaceId}` },
    { label: "Create Segment", desc: "Group filters", icon: FileText, color: "hover:border-blue-400 hover:bg-blue-400/5", href: `/segments/${workspaceId}` },
    { label: "Create Workflow", desc: "Visual automation", icon: GitBranch, color: "hover:border-[#6B7280] hover:bg-[#6B7280]/5", href: `/flow-builder/${workspaceId}/create` },
  ]

  return (
    <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-semibold text-white/80 tracking-tight">Quick Actions</h3>
        <p className="text-[11px] text-[#B0B8C8] mt-1">Accelerated workflows to launch outreach sequences instantly.</p>
      </div>
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((a) => (
          <button key={a.label} onClick={() => router.push(a.href)} className={`p-4 rounded-2xl bg-[#08090C] border border-[#1E2230] text-left transition-all duration-300 group cursor-pointer ${a.color}`}>
            <a.icon className="w-5 h-5 text-[#B0B8C8] group-hover:text-white mb-3 transition-colors" />
            <p className="text-xs font-semibold text-white leading-none">{a.label}</p>
            <p className="text-[9px] text-[#7A8499] font-mono mt-1.5 leading-none">{a.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
