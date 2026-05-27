"use client"

import { EmailTemplate } from "@/lib/transactional-data"
import { TemplateStatusBadge } from "./status-badges"
import { Eye, Pencil, Zap, Trash2, FileText } from "lucide-react"

interface Props {
  templates: EmailTemplate[]
  onView: (t: EmailTemplate) => void
  onEdit: (t: EmailTemplate) => void
  onPublish: (t: EmailTemplate) => void
  onDelete: (t: EmailTemplate) => void
}

export default function TemplatesTable({ templates, onView, onEdit, onPublish, onDelete }: Props) {
  if (templates.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#6B7280]/10 border border-[#6B7280]/25 flex items-center justify-center text-[#9CA3AF] mb-4">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No Templates Yet</h3>
        <p className="text-xs text-[#B0B8C8] mt-1.5 max-w-[280px] leading-relaxed">
          Create reusable email templates with variable support for transactional sends.
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
              {["Name", "Subject", "Status", "Version", "Updated At", "Actions"].map((col) => (
                <th key={col} className="px-4 py-3.5 text-left text-xs font-semibold text-white/80 tracking-tight whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C202C]/60">
            {templates.map((t) => (
              <tr key={t.id} className="hover:bg-[#111319] transition-colors duration-200 group">
                <td className="px-4 py-3.5">
                  <button onClick={() => onView(t)} className={`font-semibold hover:text-[#9CA3AF] transition-colors text-left ${t.status === "archived" ? "line-through text-zinc-600" : "text-white/90"}`}>
                    {t.name}
                  </button>
                  <p className="text-[9px] text-[#7A8499] font-mono mt-0.5">{t.variables.length} variable{t.variables.length !== 1 ? "s" : ""}</p>
                </td>
                <td className="px-4 py-3.5 text-[#B0B8C8] max-w-[200px] truncate font-mono text-[10px]">{t.subject}</td>
                <td className="px-4 py-3.5"><TemplateStatusBadge status={t.status} /></td>
                <td className="px-4 py-3.5 font-mono text-[#B0B8C8]">v{t.version}</td>
                <td className="px-4 py-3.5 text-[#B0B8C8] font-mono whitespace-nowrap">
                  {new Date(t.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Btn onClick={() => onView(t)} title="View" color="text-[#6B7280]"><Eye className="w-3.5 h-3.5" /></Btn>
                    {t.status !== "archived" && <Btn onClick={() => onEdit(t)} title="Edit" color="text-[#B0B8C8]"><Pencil className="w-3.5 h-3.5" /></Btn>}
                    {t.status === "draft" && <Btn onClick={() => onPublish(t)} title="Publish" color="text-emerald-400"><Zap className="w-3.5 h-3.5" /></Btn>}
                    {t.status !== "archived" && <Btn onClick={() => onDelete(t)} title="Delete" color="text-red-400"><Trash2 className="w-3.5 h-3.5" /></Btn>}
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
