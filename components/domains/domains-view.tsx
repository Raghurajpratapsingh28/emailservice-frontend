"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { initialDomains, Domain, generateDnsRecords } from "@/lib/domains-data"
import { Plus, ChevronDown } from "lucide-react"
import DomainsTable from "./domains-table"
import AddDomainModal from "./add-domain-modal"
import DomainDetailView from "./domain-detail-view"

export default function DomainsView() {
  const [domains, setDomains] = useState<Domain[]>(initialDomains)
  const [view, setView] = useState<"list" | "detail">("list")
  const [selected, setSelected] = useState<Domain | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = domains.filter((d) => statusFilter === "all" || d.status === statusFilter)

  const update = (id: string, patch: Partial<Domain>) =>
    setDomains((prev) => prev.map((d) => d.id === id ? { ...d, ...patch } : d))

  const handleView = (d: Domain) => { setSelected(d); setView("detail") }

  const handleReverify = (d: Domain) => {
    update(d.id, { status: "verifying", verificationAttempts: d.verificationAttempts + 1 })
    if (selected?.id === d.id) setSelected((p) => p ? { ...p, status: "verifying", verificationAttempts: p.verificationAttempts + 1 } : p)
    // Simulate async result
    setTimeout(() => {
      update(d.id, { status: "verified", verifiedAt: new Date().toISOString() })
      if (selected?.id === d.id) setSelected((p) => p ? { ...p, status: "verified", verifiedAt: new Date().toISOString() } : p)
    }, 3000)
  }

  const handleDelete = (d: Domain) => {
    if (!window.confirm(`Delete domain "${d.domain}"?\n\nThis will:\n• Remove the SES identity\n• Prevent sending from this domain\n• Existing campaigns using this domain will fail to send\n\nThis action cannot be undone.`)) return
    setDomains((prev) => prev.filter((x) => x.id !== d.id))
    if (view === "detail") setView("list")
  }

  const handleAdd = (domain: string) => {
    const newDomain: Domain = {
      id: `dom-${Date.now()}`,
      domain,
      status: "verifying",
      dnsRecords: generateDnsRecords(domain),
      verificationStartedAt: new Date().toISOString(),
      verificationAttempts: 1,
      verifiedAt: null,
      createdAt: new Date().toISOString(),
    }
    setDomains((prev) => [newDomain, ...prev])
    setSelected(newDomain)
    setView("detail")
  }

  const COUNTS = {
    total: domains.length,
    verified: domains.filter((d) => d.status === "verified").length,
    verifying: domains.filter((d) => d.status === "verifying").length,
    failed: domains.filter((d) => d.status === "failed").length,
  }

  if (view === "detail" && selected) {
    const live = domains.find((d) => d.id === selected.id) ?? selected
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-[1500px] mx-auto select-none">
        <DomainDetailView domain={live} onBack={() => setView("list")} onReverify={handleReverify} onDelete={handleDelete} />
        <AddDomainModal isOpen={addOpen} onClose={() => setAddOpen(false)} existingDomains={domains.map((d) => d.domain)} onAdd={handleAdd} />
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1500px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Email Infrastructure</span>
          <div className="flex items-center gap-3 mt-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white/95 leading-none">Domains</h1>
            <div className="flex items-baseline gap-1 bg-[#111319] border border-[#1E2230] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-[#3CD3AD]">
              <span>{domains.length}</span>
              <span className="text-[9px] text-[#7A8499] font-normal uppercase">Total</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#3CD3AD] rounded-xl text-xs text-white/80 font-mono cursor-pointer focus:outline-none transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="verifying">Verifying</option>
              <option value="verified">Verified</option>
              <option value="failed">Failed</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#7A8499] pointer-events-none" />
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#3CD3AD] to-teal-500 hover:from-teal-400 hover:to-teal-600 text-[#060709] font-bold rounded-xl text-xs shadow-lg shadow-[#3CD3AD]/15 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Domain
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: COUNTS.total, color: "text-white" },
          { label: "Verified", value: COUNTS.verified, color: "text-emerald-400" },
          { label: "Verifying", value: COUNTS.verifying, color: "text-blue-400" },
          { label: "Failed", value: COUNTS.failed, color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-2xl bg-[#0F1016]/95 border border-[#1C202C] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#7A8499] uppercase tracking-wider">{label}</span>
            <span className={`text-xl font-bold font-mono ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <DomainsTable domains={filtered} onView={handleView} onReverify={handleReverify} onDelete={handleDelete} />

      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-[10px] font-mono text-[#7A8499] px-1">
          <span>Showing {filtered.length} of {domains.length} domains</span>
          <span>Page 1 of 1</span>
        </div>
      )}

      <AddDomainModal isOpen={addOpen} onClose={() => setAddOpen(false)} existingDomains={domains.map((d) => d.domain)} onAdd={handleAdd} />
    </motion.div>
  )
}
