"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Pencil, Zap, Pause, Play, Trash2, Loader2 } from "lucide-react"
import WorkflowStatusBadge from "./workflow-status-badge"
import WorkflowGraph from "./workflow-graph"
import { workflowsService, type ApiExecution } from "@/lib/workflows-service"
import { graphToNodes, type Workflow } from "@/lib/workflows-data"
import type { ApiWorkflow } from "@/lib/workflows-service"

interface Props {
  workspaceId: string
  workflowId: string
}

function apiToWorkflow(w: ApiWorkflow): Workflow {
  return {
    id: w.id,
    name: w.name,
    status: w.status,
    nodes: w.graph ? graphToNodes(w.graph) : [],
    executionStats: w.executionStats ?? { total: 0, completed: 0, failed: 0, running: 0 },
    publishedAt: w.publishedAt,
    createdAt: w.createdAt,
    updatedAt: w.updatedAt,
  }
}

const EX_STATUS_CLS: Record<ApiExecution["status"], string> = {
  running:   "bg-blue-500/10 border-blue-500/25 text-blue-400",
  completed: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
  failed:    "bg-red-500/10 border-red-500/25 text-red-400",
}

export default function WorkflowDetailView({ workspaceId, workflowId }: Props) {
  const router = useRouter()
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [executions, setExecutions] = useState<ApiExecution[]>([])
  const [exTotal, setExTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [exLoading, setExLoading] = useState(true)

  const loadWorkflow = useCallback(async () => {
    try {
      const res = await workflowsService.get(workspaceId, workflowId)
      setWorkflow(apiToWorkflow(res.workflow))
    } catch (err) {
      console.error("Failed to load workflow:", err)
    } finally {
      setIsLoading(false)
    }
  }, [workspaceId, workflowId])

  const loadExecutions = useCallback(async () => {
    setExLoading(true)
    try {
      const res = await workflowsService.getExecutions(workspaceId, workflowId, { pageSize: 50 })
      setExecutions(res.items)
      setExTotal(res.total)
    } catch (err) {
      console.error("Failed to load executions:", err)
    } finally {
      setExLoading(false)
    }
  }, [workspaceId, workflowId])

  useEffect(() => { loadWorkflow(); loadExecutions() }, [loadWorkflow, loadExecutions])

  const handlePublish = async () => {
    try { await workflowsService.publish(workspaceId, workflowId); loadWorkflow() }
    catch (err) { console.error(err) }
  }

  const handlePause = async () => {
    try { await workflowsService.pause(workspaceId, workflowId); loadWorkflow() }
    catch (err) { console.error(err) }
  }

  const handleResume = async () => {
    try { await workflowsService.resume(workspaceId, workflowId); loadWorkflow() }
    catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!workflow || !window.confirm(`Archive "${workflow.name}"?`)) return
    try { await workflowsService.delete(workspaceId, workflowId); router.push(`/flow-builder/${workspaceId}`) }
    catch (err) { console.error(err) }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" /></div>
  )

  if (!workflow) return (
    <div className="flex items-center justify-center py-24">
      <p className="text-sm text-[#7A8499] font-mono">Workflow not found.</p>
    </div>
  )

  const w = workflow

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1500px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <button onClick={() => router.push(`/flow-builder/${workspaceId}`)} className="flex items-center gap-1.5 text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-colors mb-3 cursor-pointer">
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
              <ActionBtn onClick={() => router.push(`/flow-builder/${workspaceId}/create?edit=${w.id}`)} color="text-[#9CA3AF]" border="border-[#6B7280]/25 hover:border-[#6B7280]/50"><Pencil className="w-3.5 h-3.5" /> Edit</ActionBtn>
              <ActionBtn onClick={handlePublish} color="text-emerald-400" border="border-emerald-500/25 hover:border-emerald-500/50"><Zap className="w-3.5 h-3.5" /> Publish</ActionBtn>
            </>
          )}
          {w.status === "published" && (
            <ActionBtn onClick={handlePause} color="text-amber-400" border="border-amber-500/25 hover:border-amber-500/50"><Pause className="w-3.5 h-3.5" /> Pause</ActionBtn>
          )}
          {w.status === "paused" && (
            <>
              <ActionBtn onClick={() => router.push(`/flow-builder/${workspaceId}/create?edit=${w.id}`)} color="text-[#9CA3AF]" border="border-[#6B7280]/25 hover:border-[#6B7280]/50"><Pencil className="w-3.5 h-3.5" /> Edit</ActionBtn>
              <ActionBtn onClick={handleResume} color="text-emerald-400" border="border-emerald-500/25 hover:border-emerald-500/50"><Play className="w-3.5 h-3.5" /> Resume</ActionBtn>
            </>
          )}
          {w.status !== "archived" && (
            <ActionBtn onClick={handleDelete} color="text-red-400" border="border-red-500/25 hover:border-red-500/50"><Trash2 className="w-3.5 h-3.5" /> Delete</ActionBtn>
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
        <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
          <h3 className="text-xs font-semibold text-white/80 tracking-tight mb-4">Execution Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total", value: w.executionStats.total, color: "text-white" },
              { label: "Completed", value: w.executionStats.completed, color: "text-emerald-400" },
              { label: "Failed", value: w.executionStats.failed, color: "text-red-400" },
              { label: "Running", value: w.executionStats.running, color: "text-blue-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-3 rounded-2xl bg-[#08090C] border border-[#161922] text-center">
                <p className="text-[9px] font-mono text-[#7A8499] uppercase">{label}</p>
                <p className={`text-lg font-bold font-mono mt-1 ${color}`}>{value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Executions table */}
      <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-white/80 tracking-tight">Executions</h3>
          {exTotal > 0 && <span className="text-[10px] font-mono text-[#7A8499]">{exTotal} total</span>}
        </div>

        {exLoading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 text-[#6B7280] animate-spin" /></div>
        ) : executions.length === 0 ? (
          <p className="text-xs text-[#7A8499] font-mono">No executions yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#1C202C]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1C202C]">
                  {["Execution ID", "Contact ID", "Status", "Current Node", "Started At", "Completed At"].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-white/80 tracking-tight whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C202C]/60">
                {executions.map((ex) => (
                  <tr key={ex.id} className="hover:bg-[#111319] transition-colors">
                    <td className="px-4 py-3 font-mono text-[10px] text-[#9CA3AF]">{ex.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 font-mono text-[10px] text-[#B0B8C8]">{ex.contactId.slice(0, 8)}…</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase ${EX_STATUS_CLS[ex.status]}`}>
                        {ex.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#B0B8C8] font-mono text-[10px]">{ex.currentNodeId}</td>
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
    </motion.div>
  )
}

function ActionBtn({ onClick, color, border, children }: { onClick: () => void; color: string; border: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3.5 py-2 bg-[#111319] hover:bg-[#1C1F2D] border ${border} rounded-xl text-xs font-semibold ${color} transition-all cursor-pointer`}>
      {children}
    </button>
  )
}
