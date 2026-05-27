"use client"

import { Campaign } from "@/lib/campaigns-data"
import CampaignStatusBadge from "./campaign-status-badge"
import { Eye, Pencil, Calendar, Play, Pause, Trash2, Send, Megaphone } from "lucide-react"

interface Props {
  campaigns: Campaign[]
  onView: (c: Campaign) => void
  onEdit: (c: Campaign) => void
  onSchedule: (c: Campaign) => void
  onSendNow: (c: Campaign) => void
  onPause: (c: Campaign) => void
  onResume: (c: Campaign) => void
  onDelete: (c: Campaign) => void
}

export default function CampaignsTable({ campaigns, onView, onEdit, onSchedule, onSendNow, onPause, onResume, onDelete }: Props) {
  if (campaigns.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FE8A5C]/10 border border-[#FE8A5C]/25 flex items-center justify-center text-[#FE8A5C] mb-4">
          <Megaphone className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No Campaigns Found</h3>
        <p className="text-xs text-[#B0B8C8] mt-1.5 max-w-[280px] leading-relaxed">
          Create your first campaign to start sending emails to your segments.
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
              {["Name", "Subject", "Status", "Segment", "Scheduled At", "Recipients", "Created", "Actions"].map((col) => (
                <th key={col} className="px-4 py-3.5 text-left text-xs font-semibold text-white/80 tracking-tight whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C202C]/60">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-[#111319] transition-colors duration-200 group">
                <td className="px-4 py-3.5">
                  <button onClick={() => onView(c)} className={`font-semibold hover:text-[#9CA3AF] transition-colors text-left ${c.status === "cancelled" ? "line-through text-zinc-600" : "text-white/90"}`}>
                    {c.name}
                  </button>
                </td>
                <td className="px-4 py-3.5 text-[#B0B8C8] max-w-[180px] truncate">{c.subject}</td>
                <td className="px-4 py-3.5"><CampaignStatusBadge status={c.status} /></td>
                <td className="px-4 py-3.5 text-[#B0B8C8] whitespace-nowrap">{c.segmentName}</td>
                <td className="px-4 py-3.5 text-[#B0B8C8] font-mono whitespace-nowrap">
                  {c.scheduledAt ? new Date(c.scheduledAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                </td>
                <td className="px-4 py-3.5 font-mono text-white/80">
                  {c.recipientCount > 0 ? c.recipientCount.toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3.5 text-[#B0B8C8] font-mono whitespace-nowrap">
                  {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Btn onClick={() => onView(c)} title="View" color="text-[#6B7280]"><Eye className="w-3.5 h-3.5" /></Btn>
                    {(c.status === "draft" || c.status === "scheduled") && (
                      <Btn onClick={() => onEdit(c)} title="Edit" color="text-[#B0B8C8]"><Pencil className="w-3.5 h-3.5" /></Btn>
                    )}
                    {c.status === "draft" && (
                      <>
                        <Btn onClick={() => onSchedule(c)} title="Schedule" color="text-blue-400"><Calendar className="w-3.5 h-3.5" /></Btn>
                        <Btn onClick={() => onSendNow(c)} title="Send Now" color="text-[#FE8A5C]"><Send className="w-3.5 h-3.5" /></Btn>
                      </>
                    )}
                    {(c.status === "scheduled" || c.status === "sending") && (
                      <Btn onClick={() => onPause(c)} title="Pause" color="text-amber-400"><Pause className="w-3.5 h-3.5" /></Btn>
                    )}
                    {c.status === "paused" && (
                      <Btn onClick={() => onResume(c)} title="Resume" color="text-emerald-400"><Play className="w-3.5 h-3.5" /></Btn>
                    )}
                    {["draft", "scheduled", "paused", "failed"].includes(c.status) && (
                      <Btn onClick={() => onDelete(c)} title="Delete" color="text-red-400"><Trash2 className="w-3.5 h-3.5" /></Btn>
                    )}
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
