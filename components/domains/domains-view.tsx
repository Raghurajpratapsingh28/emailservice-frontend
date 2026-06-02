"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Plus, ArrowLeft, ChevronDown, Loader2, Globe } from "lucide-react"
import DomainsTable from "./domains-table"
import AddDomainModal from "./add-domain-modal"
import { domainsService, type ApiDomain } from "@/lib/domains-service"

interface Props { workspaceId: string }

export default function DomainsView({ workspaceId }: Props) {
  const router = useRouter()
  const [domains, setDomains] = useState<ApiDomain[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await domainsService.list(workspaceId, {
        status: statusFilter !== "all" ? statusFilter : undefined,
        pageSize: 100,
      })
      setDomains(res.items)
      setTotal(res.total)
    } catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }, [workspaceId, statusFilter])

  useEffect(() => { load() }, [load])

  const handleReverify = async (d: ApiDomain) => {
    try { await domainsService.verify(workspaceId, d.id); load() } catch (e: any) { alert(e.message) }
  }

  const handleDelete = async (d: ApiDomain) => {
    if (!window.confirm(`Delete domain "${d.domain}"?\n\nThis will remove the SES identity and prevent sending from this domain.`)) return
    try { await domainsService.delete(workspaceId, d.id); load() } catch (e: any) { alert(e.message) }
  }

  const handleAdded = (d: ApiDomain) => {
    router.push(`/domains/${workspaceId}/${d.id}`)
  }

  const COUNTS = {
    total,
    verified: domains.filter(d => d.status === "verified").length,
    verifying: domains.filter(d => d.status === "verifying" || d.status === "pending").length,
    failed: domains.filter(d => d.status === "failed").length,
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1500px] mx-auto select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button onClick={() => router.push("/domains")} className="flex items-center gap-1.5 text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-colors mb-3 cursor-pointer">
            <ArrowLeft className="w-3 h-3" /> All Workspaces
          </button>
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Email Infrastructure</span>
          <div className="flex items-center gap-3 mt-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white/95 leading-none">Domains</h1>
            <div className="flex items-baseline gap-1 bg-[#111319] border border-[#1E2230] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-[#3CD3AD]">
              <span>{total}</span><span className="text-[9px] text-[#7A8499] font-normal uppercase">Total</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="appearance-none pl-3 pr-8 py-2 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#3CD3AD] rounded-xl text-xs text-white/80 font-mono cursor-pointer focus:outline-none transition-colors">
              <option value="all">All Statuses</option>
              {["pending", "verifying", "verified", "failed"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#7A8499] pointer-events-none" />
          </div>
          <button onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#3CD3AD] to-teal-500 hover:from-teal-400 hover:to-teal-600 text-[#060709] font-bold rounded-xl text-xs shadow-lg shadow-[#3CD3AD]/15 transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> Add Domain
          </button>
        </div>
      </div>

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

      {isLoading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" /></div>
      ) : (
        <>
          <DomainsTable
            domains={domains}
            onView={(d) => router.push(`/domains/${workspaceId}/${d.id}`)}
            onReverify={handleReverify}
            onDelete={handleDelete}
          />
          {total > 0 && <p className="text-[10px] font-mono text-[#7A8499] px-1">Showing {domains.length} of {total} domains</p>}
        </>
      )}

      <AddDomainModal isOpen={addOpen} onClose={() => setAddOpen(false)} workspaceId={workspaceId} onAdded={handleAdded} />
    </motion.div>
  )
}
