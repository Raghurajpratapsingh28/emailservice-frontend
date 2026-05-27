"use client"

import { Segment, formatRelative } from "@/lib/segments-data"
import { SegmentStatusBadge, SegmentTypeBadge } from "./segment-status-badge"
import { Eye, Pencil, RefreshCw, Trash2, Users } from "lucide-react"

interface Props {
  segments: Segment[]
  onView: (s: Segment) => void
  onEdit: (s: Segment) => void
  onRefresh: (s: Segment) => void
  onDelete: (s: Segment) => void
}

export default function SegmentsTable({ segments, onView, onEdit, onRefresh, onDelete }: Props) {
  if (segments.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#6B7280]/10 border border-[#6B7280]/25 flex items-center justify-center text-[#6B7280] mb-4">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No Segments Found</h3>
        <p className="text-xs text-[#B0B8C8] mt-1.5 max-w-[280px] leading-relaxed">
          Create your first segment to start grouping contacts by rules or manual selection.
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
              {["Name", "Type", "Contacts", "Status", "Last Computed", "Created", "Actions"].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3.5 text-left text-xs font-semibold text-white/80 tracking-tight whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C202C]/60">
            {segments.map((seg) => (
              <tr
                key={seg.id}
                className="hover:bg-[#111319] transition-colors duration-200 group"
              >
                {/* Name */}
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => onView(seg)}
                    className="font-semibold text-white/90 hover:text-[#9CA3AF] transition-colors text-left"
                  >
                    {seg.name}
                  </button>
                </td>

                {/* Type */}
                <td className="px-4 py-3.5">
                  <SegmentTypeBadge type={seg.type} />
                </td>

                {/* Contact Count */}
                <td className="px-4 py-3.5">
                  <span className="font-mono font-semibold text-white/80">
                    {seg.status === "ready" ? seg.contactCount.toLocaleString() : "—"}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <SegmentStatusBadge status={seg.status} />
                </td>

                {/* Last Computed */}
                <td className="px-4 py-3.5 text-[#B0B8C8] font-mono">
                  {formatRelative(seg.lastComputed)}
                </td>

                {/* Created */}
                <td className="px-4 py-3.5 text-[#B0B8C8] font-mono whitespace-nowrap">
                  {new Date(seg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ActionBtn onClick={() => onView(seg)} title="View" color="text-[#6B7280]">
                      <Eye className="w-3.5 h-3.5" />
                    </ActionBtn>
                    <ActionBtn onClick={() => onEdit(seg)} title="Edit" color="text-[#B0B8C8]">
                      <Pencil className="w-3.5 h-3.5" />
                    </ActionBtn>
                    <ActionBtn onClick={() => onRefresh(seg)} title="Refresh" color="text-blue-400">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </ActionBtn>
                    <ActionBtn onClick={() => onDelete(seg)} title="Delete" color="text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </ActionBtn>
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

function ActionBtn({
  onClick, title, color, children
}: {
  onClick: () => void
  title: string
  color: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg bg-[#12141A] border border-[#1E2230] hover:border-[#383E58] ${color} hover:bg-[#1C1F2D] transition-all cursor-pointer`}
    >
      {children}
    </button>
  )
}
