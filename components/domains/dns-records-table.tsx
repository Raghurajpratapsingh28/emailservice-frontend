"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import type { DomainDns, DnsRecord } from "@/lib/domains-service"

export default function DnsRecordsTable({ dns }: { dns: DomainDns }) {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const groups: { title: string; records: Array<DnsRecord & { label: string }> }[] = [
    { title: "SPF Record", records: [{ ...dns.spf, label: "SPF" }] },
    { title: "DKIM Records", records: dns.dkim.map((r, i) => ({ ...r, label: `DKIM-${i + 1}` })) },
    { title: "DMARC Record", records: [{ ...dns.dmarc, label: "DMARC" }] },
  ]

  return (
    <div className="space-y-5">
      {groups.map(({ title, records }) => (
        <div key={title}>
          <h4 className="text-xs font-semibold text-white/80 tracking-tight mb-2">{title}</h4>
          <div className="rounded-2xl border border-[#1C202C] overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1C202C] bg-[#08090C]">
                  {["Type", "Host", "Value", ""].map(col => (
                    <th key={col} className="px-4 py-2.5 text-left text-[9px] font-mono font-semibold text-[#7A8499] uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C202C]/60">
                {records.map((rec) => (
                  <tr key={rec.label} className="hover:bg-[#111319] transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono font-semibold text-[#9CA3AF] text-[10px] bg-[#6B7280]/10 border border-[#6B7280]/25 px-1.5 py-0.5 rounded">{rec.type}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[#B0B8C8] max-w-[180px]">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{rec.host}</span>
                        <CopyBtn id={`h-${rec.label}`} text={rec.host} copied={copied} onCopy={copy} />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[#B0B8C8] max-w-[260px]">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[10px]">{rec.value}</span>
                        <CopyBtn id={`v-${rec.label}`} text={rec.value} copied={copied} onCopy={copy} />
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button onClick={() => copy(`r-${rec.label}`, `${rec.host}\t${rec.value}`)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-[9px] font-mono text-[#B0B8C8] hover:text-white transition-all cursor-pointer">
                        {copied === `r-${rec.label}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

function CopyBtn({ id, text, copied, onCopy }: { id: string; text: string; copied: string | null; onCopy: (id: string, text: string) => void }) {
  return (
    <button onClick={() => onCopy(id, text)} className="shrink-0 p-1 rounded text-[#7A8499] hover:text-[#3CD3AD] transition-colors cursor-pointer" title="Copy">
      {copied === id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}
