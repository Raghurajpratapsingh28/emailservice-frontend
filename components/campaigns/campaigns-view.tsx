"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Plus, ArrowLeft, Loader2 } from "lucide-react"
import { campaignsService } from "@/lib/campaigns-service"
import type { Campaign } from "@/lib/campaigns-data"
import CampaignsTable from "./campaigns-table"
import CampaignFilters from "./campaign-filters"

interface Props { workspaceId?: string }

export default function CampaignsView({ workspaceId: propWorkspaceId }: Props) {
  const router = useRouter()
  const workspaceId = propWorkspaceId ?? ""
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    if (!workspaceId) return
    setIsLoading(true); setError(null)
    try {
      const res = await campaignsService.list(workspaceId, {
        page, pageSize: 50,
        status: status !== "all" ? status : undefined,
        search: search || undefined,
        fromDate: dateFrom || undefined,
        toDate: dateTo || undefined,
      })
      setCampaigns(res.items); setTotal(res.total)
    } catch (err: any) { setError(err.message || "Failed to load campaigns") }
    finally { setIsLoading(false) }
  }, [workspaceId, page, status, search, dateFrom, dateTo])

  useEffect(() => { load() }, [load])

  const patch = (id: string, p: Partial<Campaign>) => setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, ...p } : c))

  const handlePause = async (c: Campaign) => {
    patch(c.id, { status: "paused" })
    try { patch(c.id, await campaignsService.pause(workspaceId, c.id)) } catch (e: any) { patch(c.id, { status: c.status }); alert(e.message) }
  }
  const handleResume = async (c: Campaign) => {
    try { patch(c.id, await campaignsService.resume(workspaceId, c.id)) } catch (e: any) { alert(e.message) }
  }
  const handleDelete = async (c: Campaign) => {
    if (!window.confirm(`Delete "${c.name}"?`)) return
    try { await campaignsService.delete(workspaceId, c.id); load() } catch (e: any) { alert(e.message) }
  }
  const handleSendNow = async (c: Campaign) => {
    if (!window.confirm(`Send "${c.name}" to ${c.recipientCount.toLocaleString()} contacts now?`)) return
    try { await campaignsService.send(workspaceId, c.id); patch(c.id, { status: "sending" }) } catch (e: any) { alert(e.message) }
  }

  const COUNTS = {
    total, draft: campaigns.filter(c => c.status === "draft").length,
    scheduled: campaigns.filter(c => c.status === "scheduled").length,
    sending: campaigns.filter(c => c.status === "sending").length,
    sent: campaigns.filter(c => c.status === "sent").length,
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1500px] mx-auto select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {propWorkspaceId && (
            <button onClick={() => router.push("/campaigns")} className="flex items-center gap-1.5 text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-colors mb-3 cursor-pointer">
              <ArrowLeft className="w-3 h-3" /> All Workspaces
            </button>
          )}
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Broadcasts Dispatch</span>
          <div className="flex items-center gap-3 mt-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white/95 leading-none">Campaigns</h1>
            <div className="flex items-baseline gap-1 bg-[#111319] border border-[#1E2230] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-[#FE8A5C]">
              <span>{total}</span><span className="text-[9px] text-[#7A8499] font-normal uppercase">Total</span>
            </div>
          </div>
        </div>
        <button onClick={() => router.push(`/campaigns/${workspaceId}/create`)} className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer">
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Total", value: COUNTS.total, color: "text-white" },
          { label: "Draft", value: COUNTS.draft, color: "text-zinc-400" },
          { label: "Scheduled", value: COUNTS.scheduled, color: "text-blue-400" },
          { label: "Sending", value: COUNTS.sending, color: "text-amber-400" },
          { label: "Sent", value: COUNTS.sent, color: "text-emerald-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-2xl bg-[#0F1016]/95 border border-[#1C202C] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#7A8499] uppercase tracking-wider">{label}</span>
            <span className={`text-xl font-bold font-mono ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      <CampaignFilters search={search} setSearch={setSearch} status={status} setStatus={setStatus} dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} />

      {isLoading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" /></div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-[#0F1016]/95 border border-red-500/30 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={load} className="mt-3 text-xs text-[#6B7280] underline hover:text-white cursor-pointer">Retry</button>
        </div>
      ) : (
        <CampaignsTable
          campaigns={campaigns}
          onView={(c) => router.push(`/campaigns/${workspaceId}/details/${c.id}`)}
          onEdit={(c) => router.push(`/campaigns/${workspaceId}/edit/${c.id}`)}
          onSchedule={(c) => router.push(`/campaigns/${workspaceId}/details/${c.id}`)}
          onSendNow={handleSendNow}
          onPause={handlePause}
          onResume={handleResume}
          onDelete={handleDelete}
        />
      )}

      {!isLoading && !error && total > 0 && (
        <div className="flex items-center justify-between text-[10px] font-mono text-[#7A8499] px-1">
          <span>Showing {campaigns.length} of {total} campaigns</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2.5 py-1 bg-[#12141A] border border-[#1E2230] rounded-lg disabled:opacity-40 hover:border-[#383E58] transition-all cursor-pointer disabled:cursor-not-allowed">Prev</button>
            <span>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={campaigns.length < 50} className="px-2.5 py-1 bg-[#12141A] border border-[#1E2230] rounded-lg disabled:opacity-40 hover:border-[#383E58] transition-all cursor-pointer disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
