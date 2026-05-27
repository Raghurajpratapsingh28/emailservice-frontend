"use client"

import { Segment, ContactPreview, formatRelative } from "@/lib/segments-data"
import { SegmentStatusBadge, SegmentTypeBadge } from "./segment-status-badge"
import FilterBuilder from "./filter-builder"
import { ArrowLeft, RefreshCw, Pencil, Trash2, Users } from "lucide-react"

interface Props {
  segment: Segment
  contacts: ContactPreview[]
  onBack: () => void
  onEdit: (s: Segment) => void
  onRefresh: (s: Segment) => void
  onDelete: (s: Segment) => void
}

export default function SegmentDetailView({ segment, contacts, onBack, onEdit, onRefresh, onDelete }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-colors mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Segments
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-extrabold tracking-tight text-white/95">{segment.name}</h1>
            <SegmentTypeBadge type={segment.type} />
            <SegmentStatusBadge status={segment.status} />
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-[#B0B8C8]">
            {segment.status === "ready" && (
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#6B7280]" />
                <span className="font-mono font-semibold text-white/80">{segment.contactCount.toLocaleString()}</span>
                <span>contacts</span>
              </span>
            )}
            <span className="font-mono">Last computed: {formatRelative(segment.lastComputed)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onRefresh(segment)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#111319] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" /> Refresh
          </button>
          <button
            onClick={() => onEdit(segment)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#111319] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5 text-[#9CA3AF]" /> Edit
          </button>
          <button
            onClick={() => onDelete(segment)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 hover:border-red-500/50 rounded-xl text-xs font-semibold text-red-400 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Filter Rules + Contact Preview */}
        <div className="xl:col-span-2 space-y-6">
          {/* Filter Rules */}
          {segment.type === "dynamic" && segment.filterTree && (
            <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
              <h3 className="text-xs font-semibold text-white/80 tracking-tight mb-4">
                Filter Rules
              </h3>
              <FilterBuilder tree={segment.filterTree} onChange={() => {}} readOnly />
            </div>
          )}

          {segment.type === "static" && (
            <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
              <h3 className="text-xs font-semibold text-white/80 tracking-tight mb-3">
                Membership
              </h3>
              <p className="text-xs text-[#B0B8C8]">
                This is a static segment. Contacts are managed manually.
              </p>
            </div>
          )}

          {/* Contact Preview */}
          <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-white/80 tracking-tight">
                Contact Preview
              </h3>
              <span className="text-[10px] font-mono text-[#7A8499]">Showing up to 100</span>
            </div>

            {contacts.length === 0 ? (
              <p className="text-xs text-[#7A8499] font-mono">No contacts to preview.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#1C202C]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#1C202C]">
                      {["Email", "Name", "Lifecycle Stage"].map((col) => (
                        <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-white/80 tracking-tight">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C202C]/60">
                    {contacts.map((c) => (
                      <tr key={c.id} className="hover:bg-[#111319] transition-colors">
                        <td className="px-4 py-3 font-mono text-[#9CA3AF]">{c.email}</td>
                        <td className="px-4 py-3 text-white/80">{c.firstName} {c.lastName}</td>
                        <td className="px-4 py-3">
                          <span className="text-[9px] font-mono font-semibold px-2 py-0.5 bg-[#6B7280]/10 border border-[#6B7280]/25 text-[#9CA3AF] rounded-full uppercase">
                            {c.lifecycleStage}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Metadata */}
        <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] h-fit">
          <h3 className="text-xs font-semibold text-white/80 tracking-tight mb-4">
            Metadata
          </h3>
          <div className="space-y-4">
            {[
              { label: "Segment ID", value: segment.id },
              { label: "Created By", value: segment.createdBy },
              { label: "Created At", value: new Date(segment.createdAt).toLocaleString() },
              { label: "Updated At", value: new Date(segment.updatedAt).toLocaleString() },
              { label: "Type", value: segment.type },
              { label: "Status", value: segment.status },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[9px] font-mono text-[#7A8499] uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-xs text-white/80 font-mono break-all">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
