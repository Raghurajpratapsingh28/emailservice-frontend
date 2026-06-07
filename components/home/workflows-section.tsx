"use client"

import { useRouter } from "next/navigation"
import { GitBranch, Plus, ArrowUpRight, CheckCircle2, XCircle, PlayCircle } from "lucide-react"

interface Props {
  stats: { total: number; published: number; executions: { total: number; completed: number; failed: number; running: number } } | null
  workspaceId: string
}

export default function WorkflowsSection({ stats, workspaceId }: Props) {
  const router = useRouter()
  const ex = stats?.executions

  return (
    <div className="p-5 enterprise-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[8px] bg-[#00E5FF]/10 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <h3 className="text-[16px] font-bold text-[#FFFFFF] tracking-tight">Active Workflows</h3>
        </div>
        <button onClick={() => router.push(`/flow-builder/${workspaceId}`)} className="text-[12px] text-[#8A8D96] hover:text-[#FFFFFF] transition-colors flex items-center gap-1 cursor-pointer">
          View All <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 enterprise-panel text-center">
          <CheckCircle2 className="w-5 h-5 text-[#696CFF] mx-auto mb-2" />
          <p className="text-[18px] font-bold text-[#FFFFFF]">{ex?.completed ?? 0}</p>
          <p className="text-[10px] text-[#8A8D96] font-medium uppercase mt-1">Completed</p>
        </div>
        <div className="p-4 enterprise-panel text-center">
          <XCircle className="w-5 h-5 text-[#FF5A4F] mx-auto mb-2" />
          <p className="text-[18px] font-bold text-[#FFFFFF]">{ex?.failed ?? 0}</p>
          <p className="text-[10px] text-[#8A8D96] font-medium uppercase mt-1">Failed</p>
        </div>
        <div className="p-4 enterprise-panel text-center">
          <PlayCircle className="w-5 h-5 text-[#FFB020] mx-auto mb-2" />
          <p className="text-[18px] font-bold text-[#FFFFFF]">{ex?.running ?? 0}</p>
          <p className="text-[10px] text-[#8A8D96] font-medium uppercase mt-1">Running</p>
        </div>
      </div>

      <button onClick={() => router.push(`/flow-builder/${workspaceId}/create`)} className="w-full py-3 enterprise-btn text-[#FFFFFF] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer border border-[#202126] hover:border-[#00E5FF] transition-all">
        <Plus className="w-4 h-4 text-[#00E5FF]" /> New Workflow
      </button>
    </div>
  )
}
