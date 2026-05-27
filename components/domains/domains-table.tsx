"use client"

import { Domain } from "@/lib/domains-data"
import DomainStatusBadge from "./domain-status-badge"
import { Eye, RefreshCw, Trash2, Globe } from "lucide-react"

interface Props {
  domains: Domain[]
  onView: (d: Domain) => void
  onReverify: (d: Domain) => void
  onDelete: (d: Domain) => void
}

export default function DomainsTable({ domains, onView, onReverify, onDelete }: Props) {
  if (domains.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#3CD3AD]/10 border border-[#3CD3AD]/25 flex items-center justify-center text-[#3CD3AD] mb-4">
          <Globe className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No Domains Added</h3>
        <p className="text-xs text-[#B0B8C8] mt-1.5 max-w-[280px] leading-relaxed">
          Add a sending domain to start sending emails from your own domain via AWS SES.
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
              {["Domain", "Status", "Verified At", "Created", "Actions"].map((col) => (
                <th key={col} className="px-4 py-3.5 text-left text-xs font-semibold text-white/80 tracking-tight whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C202C]/60">
            {domains.map((d) => (
              <tr key={d.id} className="hover:bg-[#111319] transition-colors duration-200 group">
                <td className="px-4 py-3.5">
                  <button onClick={() => onView(d)} className="font-semibold text-white/90 hover:text-[#3CD3AD] transition-colors font-mono text-left">
                    {d.domain}
                  </button>
                </td>
                <td className="px-4 py-3.5"><DomainStatusBadge status={d.status} /></td>
                <td className="px-4 py-3.5 text-[#B0B8C8] font-mono whitespace-nowrap">
                  {d.verifiedAt ? new Date(d.verifiedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                </td>
                <td className="px-4 py-3.5 text-[#B0B8C8] font-mono whitespace-nowrap">
                  {new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Btn onClick={() => onView(d)} title="View DNS" color="text-[#3CD3AD]"><Eye className="w-3.5 h-3.5" /></Btn>
                    {d.status !== "verified" && (
                      <Btn onClick={() => onReverify(d)} title="Re-verify" color="text-blue-400"><RefreshCw className="w-3.5 h-3.5" /></Btn>
                    )}
                    <Btn onClick={() => onDelete(d)} title="Delete" color="text-red-400"><Trash2 className="w-3.5 h-3.5" /></Btn>
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
