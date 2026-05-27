"use client"

import { Workflow, WorkflowExecution, mockExecutions } from "@/lib/workflows-data"
import WorkflowStatusBadge from "./workflow-status-badge"
import WorkflowGraph from "./workflow-graph"
import { ArrowLeft, Pencil, Zap, Pause, Play, Trash2 } from "lucide-react"

const EX_STATUS_CLS: Record<WorkflowExecution["status"], string> = {
  running:   "bg-blue-500/10 border-blue-500/25 text-blue-400",
  completed: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
  failed:    "bg-red-500/10 border-red-500/25 text-red-400",
}

interface Props {
  workflow: Workflow
  onBack: () => void
  onEdit: (w: Workflow) => void
  onPublish: (w: Workflow) => void
  onPause: (w: Workflow) => void
  onResume: (w: Workflow) => void
  onDelete: (w: Workflow) => void
}

export default function WorkflowDetailView({ workflow: w, onBack, onEdit, onPublish, onPause, onResume, onDelete }: Props) {
  const executions = mockExecutions[w.id] ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-1.5 text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-colors mb-3 cursor-pointer">
            <ArrowLeft className="w-3 h-3" /> Back to Workflows
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-extrabold tracking-tight text-white/95">{w.name}</h1>
            <WorkflowStatusBadge status={w.status} />
          </div>
          <p className="text-[10px] font-mono text-[#7A8499] mt-1.5">{w.nodes.length} nodes · Created {new Date(w.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {w.status === "draft" && (
            <>
              <ActionBtn onClick={() => onEdit(w)} color="text-[#9CA3AF]" border="border-[#6B7280]/25 hover:border-[#6B7280]/50"><Pencil className="w-3.5 h-3.5" /> Edit</ActionBtn>
              <ActionBtn onClick={() => onPublish(w)} color="text-emerald-400" border="border-emerald-500/25 hover:border-emerald-500/50"><Zap className="w-3.5 h-3.5" /> Publish</ActionBtn>
            </>
          )}
          {w.status === "published" && (
            <ActionBtn onClick={() => onPause(w)} color="text-amber-400" border="border-amber-500/25 hover:border-amber-500/50"><Pause className="w-3.5 h-3.5" /> Pause</ActionBtn>
          )}
          {w.status === "paused" && (
            <ActionBtn onClick={() => onResume(w)} color="text-emerald-400" border="border-emerald-500/25 hover:border-emerald-500/50"><Play className="w-3.5 h-3.5" /> Resume</ActionBtn>
          )}
          {w.status !== "archived" && (
            <ActionBtn onClick={() => onDelete(w)} color="text-red-400" border="border-red-500/25 hover:border-red-500/50"><Trash2 className="w-3.5 h-3.5" /> Delete</ActionBtn>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Graph (read-only) */}
        <div className="xl:col-span-2 p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
          <h3 className="text-xs font-semibold text-white/80 tracking-tight mb-4">Flow Graph</h3>
          <WorkflowGraph nodes={w.nodes} onChange={() => {}} readOnly />
        </div>

        {/* Execution stats */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
            <h3 className="text-xs font-semibold text-white/80 tracking-tight mb-4">Execution Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total", value: w.executions.total, color: "text-white" },
                { label: "Completed", value: w.executions.completed, color: "text-emerald-400" },
                { label: "Failed", value: w.executions.failed, color: "text-red-400" },
                { label: "Running", value: w.executions.running, color: "text-blue-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-3 rounded-2xl bg-[#08090C] border border-[#161922] text-center">
                  <p className="text-[9px] font-mono text-[#7A8499] uppercase">{label}</p>
                  <p className={`text-lg font-bold font-mono mt-1 ${color}`}>{value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Executions table */}
      <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
        <h3 className="text-xs font-semibold text-white/80 tracking-tight mb-4">
          Recent Executions
        </h3>
        {executions.length === 0 ? (
          <p className="text-xs text-[#7A8499] font-mono">No executions yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#1C202C]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1C202C]">
                  {["Contact", "Status", "Current Node", "Started At", "Completed At"].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-white/80 tracking-tight whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C202C]/60">
                {executions.map((ex) => (
                  <tr key={ex.id} className="hover:bg-[#111319] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white/90">{ex.contactName}</p>
                      <p className="text-[10px] text-[#B0B8C8] font-mono">{ex.contactEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase ${EX_STATUS_CLS[ex.status]}`}>
                        {ex.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#B0B8C8] font-mono">{ex.currentNode}</td>
                    <td className="px-4 py-3 text-[#B0B8C8] font-mono whitespace-nowrap">
                      {new Date(ex.startedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-[#B0B8C8] font-mono whitespace-nowrap">
                      {ex.completedAt ? new Date(ex.completedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function ActionBtn({ onClick, color, border, children }: { onClick: () => void; color: string; border: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3.5 py-2 bg-[#111319] hover:bg-[#1C1F2D] border ${border} rounded-xl text-xs font-semibold ${color} transition-all cursor-pointer`}>
      {children}
    </button>
  )
}
