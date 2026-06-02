"use client"

import { Domain } from "@/lib/domains-data"
import DomainStatusBadge from "./domain-status-badge"
import DnsRecordsTable from "./dns-records-table"
import { ArrowLeft, RefreshCw, Trash2, CheckCircle2, AlertTriangle, Info } from "lucide-react"

const STEPS = ["Add Domain", "Publish DNS Records", "Verification", "Ready to Send"]

function stepIndex(status: Domain["status"]): number {
  return { pending: 1, verifying: 2, verified: 3, failed: 2 }[status]
}

interface Props {
  domain: Domain
  onBack: () => void
  onReverify: (d: Domain) => void
  onDelete: (d: Domain) => void
}

export default function DomainDetailView({ domain: d, onBack, onReverify, onDelete }: Props) {
  const activeStep = stepIndex(d.status)

  const BANNER: Record<Domain["status"], { icon: React.ElementType; cls: string; msg: string } | null> = {
    pending: null,
    verifying: { icon: Info, cls: "bg-blue-500/5 border-blue-500/20 text-blue-400", msg: "Verification in progress. Add the DNS records below and wait up to 72 hours." },
    verified: { icon: CheckCircle2, cls: "bg-emerald-500/5 border-emerald-500/20 text-emerald-400", msg: "Domain verified and ready to send." },
    failed: { icon: AlertTriangle, cls: "bg-red-500/5 border-red-500/20 text-red-400", msg: "Verification failed. Check your DNS records and click Re-verify." },
  }
  const banner = BANNER[d.status]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-1.5 text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-colors mb-3 cursor-pointer">
            <ArrowLeft className="w-3 h-3" /> Back to Domains
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-extrabold tracking-tight text-white/95 font-mono">{d.domain}</h1>
            <DomainStatusBadge status={d.status} />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {d.status !== "verified" && (
            <button onClick={() => onReverify(d)} className="flex items-center gap-1.5 px-3.5 py-2 bg-[#111319] hover:bg-[#1C1F2D] border border-blue-500/25 hover:border-blue-500/50 rounded-xl text-xs font-semibold text-blue-400 transition-all cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" /> Re-verify
            </button>
          )}
          <button onClick={() => onDelete(d)} className="flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 hover:border-red-500/50 rounded-xl text-xs font-semibold text-red-400 transition-all cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      {/* Status banner */}
      {banner && (
        <div className={`flex items-start gap-3 p-4 rounded-2xl border ${banner.cls}`}>
          <banner.icon className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">{banner.msg}</p>
        </div>
      )}

      {/* Progress stepper */}
      <div className="p-5 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
        <h3 className="text-xs font-semibold text-white/80 tracking-tight mb-4">Setup Progress</h3>
        <div className="flex items-center gap-0">
          {STEPS.map((step, idx) => {
            const done = idx < activeStep
            const active = idx === activeStep
            const failed = d.status === "failed" && idx === 2
            return (
              <div key={step} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                    failed ? "border-red-500 bg-red-500/10 text-red-400" :
                    done ? "border-emerald-500 bg-emerald-500/20 text-emerald-400" :
                    active ? "border-[#6B7280] bg-[#6B7280]/20 text-[#9CA3AF]" :
                    "border-[#1E2230] bg-[#08090C] text-[#7A8499]"
                  }`}>
                    {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span className={`text-[9px] font-mono text-center leading-tight ${
                    failed ? "text-red-400" : done ? "text-emerald-400" : active ? "text-[#9CA3AF]" : "text-[#7A8499]"
                  }`}>{step}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`h-px flex-1 mx-1 mb-5 ${done ? "bg-emerald-500/40" : "bg-[#1E2230]"}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* DNS Records */}
        <div className="xl:col-span-2 p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
          <h3 className="text-xs font-semibold text-white/80 tracking-tight mb-4">DNS Records</h3>
          <DnsRecordsTable dns={{ spf: { type: "TXT", host: "@", value: "" }, dkim: [], dmarc: { type: "TXT", host: "", value: "" } }} />
        </div>

        {/* Verification status */}
        <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] h-fit">
          <h3 className="text-xs font-semibold text-white/80 tracking-tight mb-4">Verification Status</h3>
          <div className="space-y-4">
            {[
              { label: "Status", value: <DomainStatusBadge status={d.status} /> },
              { label: "Verification Started", value: new Date(d.verificationStartedAt).toLocaleString() },
              { label: "Verification Attempts", value: d.verificationAttempts.toString() },
              { label: "Verified At", value: d.verifiedAt ? new Date(d.verifiedAt).toLocaleString() : "—" },
              { label: "Domain ID", value: d.id },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[9px] font-mono text-[#7A8499] uppercase tracking-wider mb-0.5">{label}</p>
                {typeof value === "string"
                  ? <p className="text-xs text-white/80 font-mono break-all">{value}</p>
                  : value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
