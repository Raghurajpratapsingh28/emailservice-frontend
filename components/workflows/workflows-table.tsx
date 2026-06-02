"use client"

import { Workflow, triggerLabel } from "@/lib/workflows-data"
import WorkflowStatusBadge from "./workflow-status-badge"
import { Eye, Pencil, Zap, Pause, Play, Trash2, GitBranch } from "lucide-react"

interface Props {
  workflows: Workflow[]
  onView: (w: Workflow) => void
  onEdit: (w: Workflow) => void
  onPublish: (w: Workflow) => void
  onPause: (w: Workflow) => void
  onResume: (w: Workflow) => void
  onDelete: (w: Workflow) => void
}

export default function WorkflowsTable({ workflows, onView, onEdit, onPublish, onPause, onResume, onDelete }: Props) {
  if (workflows.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#6B7280]/10 border border-[#6B7280]/25 flex items-center justify-center text-[#9CA3AF] mb-4">
          <GitBranch className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No Workflows Yet</h3>
        <p className="text-xs text-[#B0B8C8] mt-1.5 max-w-[280px] leading-relaxed">
          Create your first workflow to automate contact journeys with triggers, emails, and delays.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1C202C]">
              {["Name", "Status", "Trigger", "Executions", "Published At", "Created", "Actions"].map((col) => (
                <th key={col} className="px-4 py-3.5 text-left text-xs font-semibold text-white/80 tracking-tight whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C202C]/60">
            {workflows.map((w) => (
              <tr key={w.id} className="hover:bg-[#111319] transition-colors duration-200 group">
                <td className="px-4 py-3.5">
                  <button onClick={() => onView(w)} className={`font-semibold hover:text-[#9CA3AF] transition-colors text-left ${w.status === "archived" ? "line-through text-zinc-600" : "text-white/90"}`}>
                    {w.name}
                  </button>
                  <p className="text-[9px] text-[#7A8499] font-mono mt-0.5">{w.nodes.length} nodes</p>
                </td>
                <td className="px-4 py-3.5"><WorkflowStatusBadge status={w.status} /></td>
                <td className="px-4 py-3.5 text-[#B0B8C8] max-w-[160px] truncate">{triggerLabel(w.nodes)}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-white/80">{w.executionStats.total.toLocaleString()}</span>
                    <span className="text-emerald-400">{w.executionStats.completed.toLocaleString()}</span>
                    <span className="text-red-400">{w.executionStats.failed}</span>
                    <span className="text-blue-400">{w.executionStats.running}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-[#B0B8C8] font-mono whitespace-nowrap">
                  {w.publishedAt ? new Date(w.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                </td>
                <td className="px-4 py-3.5 text-[#B0B8C8] font-mono whitespace-nowrap">
                  {new Date(w.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Btn onClick={() => onView(w)} title="View" color="text-[#6B7280]"><Eye className="w-3.5 h-3.5" /></Btn>
                    {w.status === "draft" && <Btn onClick={() => onEdit(w)} title="Edit" color="text-[#B0B8C8]"><Pencil className="w-3.5 h-3.5" /></Btn>}
                    {w.status === "draft" && <Btn onClick={() => onPublish(w)} title="Publish" color="text-emerald-400"><Zap className="w-3.5 h-3.5" /></Btn>}
                    {w.status === "published" && <Btn onClick={() => onPause(w)} title="Pause" color="text-amber-400"><Pause className="w-3.5 h-3.5" /></Btn>}
                    {w.status === "paused" && <Btn onClick={() => onResume(w)} title="Resume" color="text-emerald-400"><Play className="w-3.5 h-3.5" /></Btn>}
                    {w.status !== "archived" && <Btn onClick={() => onDelete(w)} title="Delete" color="text-red-400"><Trash2 className="w-3.5 h-3.5" /></Btn>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Btn({ onClick, title, color, children }: { onClick: () => void; title: string; color: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title} className={`p-1.5 rounded-lg bg-[#12141A] border border-[#1E2230] hover:border-[#383E58] ${color} hover:bg-[#1C1F2D] transition-all cursor-pointer`}>
      {children}
    </button>
  )
}
