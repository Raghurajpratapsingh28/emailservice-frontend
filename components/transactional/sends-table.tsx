"use client"

import { TransactionalSend } from "@/lib/transactional-data"
import { SendStatusBadge } from "./status-badges"
import { Eye, Send } from "lucide-react"

interface Props {
  sends: TransactionalSend[]
  onView: (s: TransactionalSend) => void
}

export default function SendsTable({ sends, onView }: Props) {
  if (sends.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#FE8A5C]/10 border border-[#FE8A5C]/25 flex items-center justify-center text-[#FE8A5C] mb-4">
          <Send className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No Sends Yet</h3>
        <p className="text-xs text-[#B0B8C8] mt-1.5 max-w-[280px] leading-relaxed">
          Send your first transactional email using the "Send Email" button above.
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
              {["Recipient", "Subject", "Sender", "Status", "Tags", "Sent At", ""].map((col) => (
                <th key={col} className="px-4 py-3.5 text-left text-xs font-semibold text-white/80 tracking-tight whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C202C]/60">
            {sends.map((s) => (
              <tr key={s.id} className="hover:bg-[#111319] transition-colors duration-200 group">
                <td className="px-4 py-3.5">
                  <p className="font-semibold text-white/90">{s.recipientName}</p>
                  <p className="text-[10px] text-[#B0B8C8] font-mono">{s.recipient}</p>
                </td>
                <td className="px-4 py-3.5 text-[#B0B8C8] max-w-[180px] truncate">{s.subject}</td>
                <td className="px-4 py-3.5 text-[#B0B8C8] font-mono whitespace-nowrap">{s.fromEmail}</td>
                <td className="px-4 py-3.5"><SendStatusBadge status={s.status} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(s.tags).map(([k, v]) => (
                      <span key={k} className="text-[9px] font-mono px-1.5 py-0.5 bg-[#6B7280]/10 border border-[#6B7280]/20 text-[#9CA3AF] rounded">
                        {k}: {v}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-[#B0B8C8] font-mono whitespace-nowrap">
                  {s.sentAt ? new Date(s.sentAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                </td>
                <td className="px-4 py-3.5">
                  <button onClick={() => onView(s)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-[#12141A] border border-[#1E2230] hover:border-[#383E58] text-[#6B7280] hover:bg-[#1C1F2D] transition-all cursor-pointer">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
