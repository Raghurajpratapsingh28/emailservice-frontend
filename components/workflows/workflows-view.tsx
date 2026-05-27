"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { initialWorkflows, Workflow, WorkflowNode } from "@/lib/workflows-data"
import { Plus } from "lucide-react"
import WorkflowsTable from "./workflows-table"
import WorkflowFormModal from "./workflow-form-modal"
import PublishDialog from "./publish-dialog"
import WorkflowDetailView from "./workflow-detail-view"

export default function WorkflowsView() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows)
  const [view, setView] = useState<"list" | "detail">("list")
  const [selected, setSelected] = useState<Workflow | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Workflow | null>(null)
  const [publishTarget, setPublishTarget] = useState<Workflow | null>(null)

  const update = (id: string, patch: Partial<Workflow>) =>
    setWorkflows((prev) => prev.map((w) => w.id === id ? { ...w, ...patch, updatedAt: new Date().toISOString() } : w))

  const handleView = (w: Workflow) => { setSelected(w); setView("detail") }
  const handleEdit = (w: Workflow) => { setEditing(w); setFormOpen(true) }
  const handlePause = (w: Workflow) => update(w.id, { status: "paused" })
  const handleResume = (w: Workflow) => update(w.id, { status: "published" })
  const handleDelete = (w: Workflow) => {
    if (!window.confirm(`Archive "${w.name}"?`)) return
    update(w.id, { status: "archived" })
    if (view === "detail") setView("list")
  }
  const handlePublishConfirm = (w: Workflow) =>
    update(w.id, { status: "published", publishedAt: new Date().toISOString() })

  const handleSave = (data: { name: string; nodes: WorkflowNode[] }) => {
    if (editing) {
      update(editing.id, { name: data.name, nodes: data.nodes })
      if (selected?.id === editing.id) setSelected((p) => p ? { ...p, ...data } : p)
    } else {
      const newW: Workflow = {
        id: `wf-${Date.now()}`,
        name: data.name,
        status: "draft",
        nodes: data.nodes,
        executions: { total: 0, completed: 0, failed: 0, running: 0 },
        publishedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setWorkflows((prev) => [newW, ...prev])
    }
    setEditing(null)
  }

  const COUNTS = {
    total: workflows.length,
    published: workflows.filter((w) => w.status === "published").length,
    draft: workflows.filter((w) => w.status === "draft").length,
    paused: workflows.filter((w) => w.status === "paused").length,
  }

  const Modals = () => (
    <>
      <WorkflowFormModal isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null) }} workflow={editing} onSave={handleSave} />
      <PublishDialog workflow={publishTarget} onClose={() => setPublishTarget(null)} onConfirm={handlePublishConfirm} />
    </>
  )

  if (view === "detail" && selected) {
    const live = workflows.find((w) => w.id === selected.id) ?? selected
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-[1500px] mx-auto select-none">
        <WorkflowDetailView
          workflow={live}
          onBack={() => setView("list")}
          onEdit={handleEdit}
          onPublish={(w) => setPublishTarget(w)}
          onPause={handlePause}
          onResume={handleResume}
          onDelete={handleDelete}
        />
        <Modals />
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1500px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Visual Journeys</span>
          <div className="flex items-center gap-3 mt-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white/95 leading-none">Workflows</h1>
            <div className="flex items-baseline gap-1 bg-[#111319] border border-[#1E2230] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-[#6B7280]">
              <span>{workflows.length}</span>
              <span className="text-[9px] text-[#7A8499] font-normal uppercase">Total</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true) }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: COUNTS.total, color: "text-white" },
          { label: "Published", value: COUNTS.published, color: "text-emerald-400" },
          { label: "Draft", value: COUNTS.draft, color: "text-zinc-400" },
          { label: "Paused", value: COUNTS.paused, color: "text-orange-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-2xl bg-[#0F1016]/95 border border-[#1C202C] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#7A8499] uppercase tracking-wider">{label}</span>
            <span className={`text-xl font-bold font-mono ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <WorkflowsTable
        workflows={workflows.filter((w) => w.status !== "archived")}
        onView={handleView}
        onEdit={handleEdit}
        onPublish={(w) => setPublishTarget(w)}
        onPause={handlePause}
        onResume={handleResume}
        onDelete={handleDelete}
      />

      {/* Archived */}
      {workflows.some((w) => w.status === "archived") && (
        <details className="group">
          <summary className="text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] cursor-pointer transition-colors">
            {workflows.filter((w) => w.status === "archived").length} archived workflow(s)
          </summary>
          <div className="mt-3">
            <WorkflowsTable
              workflows={workflows.filter((w) => w.status === "archived")}
              onView={handleView}
              onEdit={handleEdit}
              onPublish={(w) => setPublishTarget(w)}
              onPause={handlePause}
              onResume={handleResume}
              onDelete={handleDelete}
            />
          </div>
        </details>
      )}

      <Modals />
    </motion.div>
  )
}
