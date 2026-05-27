"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { initialSegments, Segment, mockContactPreviews } from "@/lib/segments-data"
import { Plus, Filter } from "lucide-react"
import SegmentsTable from "./segments-table"
import SegmentFormModal from "./segment-form-modal"
import SegmentDetailView from "./segment-detail-view"

export default function SegmentsView() {
  const [segments, setSegments] = useState<Segment[]>(initialSegments)
  const [view, setView] = useState<"list" | "detail">("list")
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null)
  const [filterType, setFilterType] = useState<"all" | "static" | "dynamic">("all")

  const filtered = segments.filter((s) => filterType === "all" || s.type === filterType)

  const handleView = (s: Segment) => {
    setSelectedSegment(s)
    setView("detail")
  }

  const handleEdit = (s: Segment) => {
    setEditingSegment(s)
    setIsModalOpen(true)
  }

  const handleRefresh = (s: Segment) => {
    setSegments((prev) =>
      prev.map((seg) =>
        seg.id === s.id ? { ...seg, status: "computing" as const } : seg
      )
    )
    // Simulate async completion
    setTimeout(() => {
      setSegments((prev) =>
        prev.map((seg) =>
          seg.id === s.id
            ? { ...seg, status: "ready" as const, lastComputed: new Date().toISOString() }
            : seg
        )
      )
    }, 2500)
  }

  const handleDelete = (s: Segment) => {
    if (!window.confirm(`Delete segment "${s.name}"? This action cannot be undone.`)) return
    setSegments((prev) => prev.filter((seg) => seg.id !== s.id))
    if (view === "detail") setView("list")
  }

  const handleSave = (data: Partial<Segment>) => {
    if (editingSegment) {
      setSegments((prev) =>
        prev.map((s) =>
          s.id === editingSegment.id
            ? { ...s, ...data, updatedAt: new Date().toISOString() }
            : s
        )
      )
      if (selectedSegment?.id === editingSegment.id) {
        setSelectedSegment((prev) => prev ? { ...prev, ...data } : prev)
      }
    } else {
      const newSeg: Segment = {
        id: `seg-${Date.now()}`,
        name: data.name ?? "Untitled",
        type: data.type ?? "dynamic",
        status: data.type === "dynamic" ? "pending" : "ready",
        contactCount: 0,
        filterTree: data.filterTree,
        lastComputed: null,
        createdAt: new Date().toISOString(),
        createdBy: "admin@engageiq.com",
        updatedAt: new Date().toISOString(),
      }
      setSegments((prev) => [newSeg, ...prev])
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
          contacts={selectedSegment.status === "ready" ? mockContactPreviews : []}
          onBack={() => setView("list")}
          onEdit={handleEdit}
          onRefresh={handleRefresh}
          onDelete={handleDelete}
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
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Audience Builder</span>
          <div className="flex items-center gap-3 mt-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white/95 leading-none">Segments</h1>
            <div className="flex items-baseline gap-1 bg-[#111319] border border-[#1E2230] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-[#6B7280]">
              <span>{segments.length}</span>
              <span className="text-[9px] text-[#7A8499] font-normal uppercase">Total</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Type filter */}
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

      {/* Table */}
      <SegmentsTable
        segments={filtered}
        onView={handleView}
        onEdit={handleEdit}
        onRefresh={handleRefresh}
        onDelete={handleDelete}
      />

      {/* Pagination hint */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-[10px] font-mono text-[#7A8499] px-1">
          <span>Showing {filtered.length} of {segments.length} segments</span>
          <span>Page 1 of 1</span>
        </div>
      )}

      {/* Modal */}
      <SegmentFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingSegment(null) }}
        segment={editingSegment}
        onSave={handleSave}
      />
    </motion.div>
  )
}
