"use client"

import { useRouter } from "next/navigation"
import { Plus, AlertCircle } from "lucide-react"

interface Stats { total: number; published: number; executions: { total: number; completed: number; failed: number; running: number } }
interface Props { stats: Stats | null; workspaceId: string }

export default function WorkflowsSection({ stats, workspaceId }: Props) {
  const router = useRouter()
  const ex = stats?.executions ?? { total: 0, completed: 0, failed: 0, running: 0 }

  return (
    <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white/80 tracking-tight">Workflow Automations</h3>
            <p className="text-[11px] text-[#B0B8C8] mt-0.5">Execution stats & triggers.</p>
          </div>
          <div className="flex items-baseline gap-1 bg-[#12141A] px-3 py-1 rounded-xl border border-[#1E2230]">
            <span className="text-lg font-bold font-mono text-[#6B7280]">{stats?.published ?? 0}</span>
            <span className="text-[10px] text-[#B0B8C8] font-mono">Active</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center bg-[#08090C] rounded-2xl border border-[#161922] p-3 mb-4">
          {[
            { label: "Total", val: ex.total, color: "text-white/90" },
            { label: "Completed", val: ex.completed, color: "text-emerald-400" },
            { label: "Failed", val: ex.failed, color: "text-red-400" },
            { label: "Running", val: ex.running, color: "text-blue-400" },
          ].map(s => (
            <div key={s.label} className="border-r border-[#1E2230] last:border-0">
              <p className="text-[9px] text-[#7A8499] font-mono uppercase">{s.label}</p>
              <p className={`text-xs font-bold font-mono mt-1 ${s.color}`}>{s.val.toLocaleString()}</p>
            </div>
          ))}
        </div>
        {ex.failed > 0 && (
          <div className="p-3.5 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white/95">Needs Attention</p>
              <p className="text-[10px] text-red-400/90 font-mono mt-0.5">{ex.failed} failed execution{ex.failed !== 1 ? "s" : ""} across workflows</p>
            </div>
          </div>
        )}
      </div>
      <button onClick={() => router.push(`/flow-builder/${workspaceId}/create`)} className="mt-5 w-full py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
        <Plus className="w-4 h-4 text-[#6B7280]" /> Create New Workflow
      </button>
    </div>
  )
}
