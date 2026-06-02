"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Segment } from "@/lib/segments-data"
import { segmentsService } from "@/lib/segments-service"
import { useAuth } from "@/lib/auth-context"
import { Plus, Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import SegmentsTable from "./segments-table"
import SegmentFormModal from "./segment-form-modal"
import SegmentDetailView from "./segment-detail-view"

interface Props {
  workspaceId?: string
}

export default function SegmentsView({ workspaceId: propWorkspaceId }: Props) {
  const { user } = useAuth()
  const router = useRouter()
  const [workspaceId, setWorkspaceId] = useState<string>("")
  const [segments, setSegments] = useState<Segment[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [view, setView] = useState<"list" | "detail">("list")
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null)
  const [previewContacts, setPreviewContacts] = useState<Array<{ id: string; email: string; firstName: string; lastName: string; lifecycleStage: string }>>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null)
  const [filterType, setFilterType] = useState<"all" | "static" | "dynamic">("all")

  const filtered = segments.filter((s) => filterType === "all" || s.type === filterType)

  const loadSegments = useCallback(async (wsId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await segmentsService.listSegments(wsId, { pageSize: 100 })
      setSegments(res.items)
      setTotal(res.total)
    } catch (err: any) {
      setError(err.message || "Failed to load segments")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (propWorkspaceId) {
      setWorkspaceId(propWorkspaceId)
      loadSegments(propWorkspaceId)
    } else if (user?.workspaces?.[0]) {
      const wsId = user.workspaces[0].id
      setWorkspaceId(wsId)
      loadSegments(wsId)
    }
  }, [user, propWorkspaceId, loadSegments])

  const handleView = async (s: Segment) => {
    setSelectedSegment(s)
    setView("detail")
    setPreviewContacts([])
    if (s.status === "ready") {
      try {
        const res = await segmentsService.previewSegment(workspaceId, s.id)
        setPreviewContacts(res.contacts)
      } catch {
        // preview is best-effort
      }
    }
  }

  const handleEdit = (s: Segment) => {
    setEditingSegment(s)
    setIsModalOpen(true)
  }

  const handleRefresh = async (s: Segment) => {
    setSegments((prev) =>
      prev.map((seg) => seg.id === s.id ? { ...seg, status: "computing" as const } : seg)
    )
    if (selectedSegment?.id === s.id) {
      setSelectedSegment((prev) => prev ? { ...prev, status: "computing" as const } : prev)
    }
    try {
      await segmentsService.refreshSegment(workspaceId, s.id)
    } catch {
      setSegments((prev) =>
        prev.map((seg) => seg.id === s.id ? { ...seg, status: s.status } : seg)
      )
    }
  }

  const handleDelete = async (s: Segment) => {
    if (!window.confirm(`Delete segment "${s.name}"? This action cannot be undone.`)) return
    try {
      await segmentsService.deleteSegment(workspaceId, s.id)
      setSegments((prev) => prev.filter((seg) => seg.id !== s.id))
      setTotal((t) => t - 1)
      if (view === "detail") setView("list")
    } catch (err: any) {
      alert(err.message || "Failed to delete segment")
    }
  }

  const handleSave = async (data: Partial<Segment>) => {
    try {
      if (editingSegment) {
        const updated = await segmentsService.updateSegment(workspaceId, editingSegment.id, {
          name: data.name,
          filterTree: data.filterTree,
        })
        setSegments((prev) => prev.map((s) => s.id === editingSegment.id ? updated : s))
        if (selectedSegment?.id === editingSegment.id) setSelectedSegment(updated)
      } else {
        const created = await segmentsService.createSegment(workspaceId, {
          name: data.name ?? "Untitled",
          type: data.type ?? "dynamic",
          filterTree: data.filterTree,
        })
        setSegments((prev) => [created, ...prev])
        setTotal((t) => t + 1)
      }
    } catch (err: any) {
      alert(err.message || "Failed to save segment")
    }
    setEditingSegment(null)
  }

  if (view === "detail" && selectedSegment) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-[1500px] mx-auto select-none"
      >
        <SegmentDetailView
          segment={selectedSegment}
          contacts={previewContacts}
          workspaceId={workspaceId}
          onBack={() => setView("list")}
          onEdit={handleEdit}
          onRefresh={handleRefresh}
          onDelete={handleDelete}
          onContactsChanged={(updatedContacts, delta) => {
            setPreviewContacts(updatedContacts)
            setSelectedSegment((prev) => prev ? { ...prev, contactCount: prev.contactCount + delta } : prev)
            setSegments((prev) => prev.map((s) => s.id === selectedSegment.id ? { ...s, contactCount: s.contactCount + delta } : s))
          }}
        />
        <SegmentFormModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingSegment(null) }}
          segment={editingSegment}
          onSave={handleSave}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 max-w-[1500px] mx-auto select-none"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {propWorkspaceId && (
            <button
              onClick={() => router.push("/segments")}
              className="flex items-center gap-1.5 text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-colors mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" /> All Workspaces
            </button>
          )}
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Audience Builder</span>
          <div className="flex items-center gap-3 mt-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white/95 leading-none">Segments</h1>
            <div className="flex items-baseline gap-1 bg-[#111319] border border-[#1E2230] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-[#6B7280]">
              <span>{total}</span>
              <span className="text-[9px] text-[#7A8499] font-normal uppercase">Total</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#12141A] p-1 rounded-xl border border-[#1E222D]">
            {(["all", "dynamic", "static"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 text-[10px] font-mono font-semibold rounded-lg transition-all duration-200 capitalize cursor-pointer ${
                  filterType === t
                    ? "bg-[#252833] text-white shadow-md shadow-black/20"
                    : "text-[#767E8C] hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setEditingSegment(null); setIsModalOpen(true) }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Segment</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: segments.length, color: "text-white" },
          { label: "Ready", value: segments.filter((s) => s.status === "ready").length, color: "text-emerald-400" },
          { label: "Computing", value: segments.filter((s) => s.status === "computing" || s.status === "pending").length, color: "text-blue-400" },
          { label: "Failed", value: segments.filter((s) => s.status === "failed").length, color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-2xl bg-[#0F1016]/95 border border-[#1C202C] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#7A8499] uppercase tracking-wider">{label}</span>
            <span className={`text-xl font-bold font-mono ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Loading / Error / Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" />
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-[#0F1016]/95 border border-red-500/30 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => loadSegments(workspaceId)}
            className="mt-3 text-xs text-[#6B7280] underline hover:text-white cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <SegmentsTable
          segments={filtered}
          onView={handleView}
          onEdit={handleEdit}
          onRefresh={handleRefresh}
          onDelete={handleDelete}
        />
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <div className="flex items-center justify-between text-[10px] font-mono text-[#7A8499] px-1">
          <span>Showing {filtered.length} of {segments.length} segments</span>
          <span>Page 1 of 1</span>
        </div>
      )}

      <SegmentFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingSegment(null) }}
        segment={editingSegment}
        onSave={handleSave}
      />
    </motion.div>
  )
}
