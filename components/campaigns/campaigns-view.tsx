"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { initialCampaigns, Campaign } from "@/lib/campaigns-data"
import { Plus } from "lucide-react"
import CampaignsTable from "./campaigns-table"
import CampaignFilters from "./campaign-filters"
import CampaignFormModal from "./campaign-form-modal"
import ScheduleModal from "./schedule-modal"
import SendNowDialog from "./send-now-dialog"
import CampaignDetailView from "./campaign-detail-view"

export default function CampaignsView() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [view, setView] = useState<"list" | "detail">("list")
  const [selected, setSelected] = useState<Campaign | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [scheduleTarget, setScheduleTarget] = useState<Campaign | null>(null)
  const [sendTarget, setSendTarget] = useState<Campaign | null>(null)

  // Filters
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const filtered = useMemo(() => campaigns.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    if (status !== "all" && c.status !== status) return false
    if (dateFrom && new Date(c.createdAt) < new Date(dateFrom)) return false
    if (dateTo && new Date(c.createdAt) > new Date(dateTo)) return false
    return true
  }), [campaigns, search, status, dateFrom, dateTo])

  const update = (id: string, patch: Partial<Campaign>) =>
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c))

  const handleView = (c: Campaign) => { setSelected(c); setView("detail") }
  const handleEdit = (c: Campaign) => { setEditing(c); setFormOpen(true) }
  const handlePause = (c: Campaign) => update(c.id, { status: "paused" })
  const handleResume = (c: Campaign) => update(c.id, { status: c.scheduledAt ? "scheduled" : "sending" })
  const handleDelete = (c: Campaign) => {
    if (!window.confirm(`Delete "${c.name}"? This cannot be undone.`)) return
    setCampaigns((prev) => prev.filter((x) => x.id !== c.id))
    if (view === "detail") setView("list")
  }
  const handleScheduleConfirm = (c: Campaign, scheduledAt: string) =>
    update(c.id, { status: "scheduled", scheduledAt })
  const handleSendNowConfirm = (c: Campaign) =>
    update(c.id, { status: "sending", sentAt: null })

  const handleSave = (data: Partial<Campaign>) => {
    if (editing) {
      update(editing.id, data)
      if (selected?.id === editing.id) setSelected((p) => p ? { ...p, ...data } : p)
    } else {
      const newC: Campaign = {
        id: `cmp-${Date.now()}`,
        name: data.name ?? "Untitled",
        type: "regular",
        status: "draft",
        subject: data.subject ?? "",
        previewText: data.previewText ?? "",
        fromEmail: data.fromEmail ?? "",
        fromName: data.fromName ?? "",
        replyTo: data.replyTo ?? "",
        segmentId: data.segmentId ?? "",
        segmentName: data.segmentName ?? "",
        recipientCount: data.recipientCount ?? 0,
        scheduledAt: null,
        sentAt: null,
        htmlBody: data.htmlBody ?? "",
        plainText: data.plainText ?? "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setCampaigns((prev) => [newC, ...prev])
    }
    setEditing(null)
  }

  const STATUS_COUNTS = {
    total: campaigns.length,
    draft: campaigns.filter((c) => c.status === "draft").length,
    scheduled: campaigns.filter((c) => c.status === "scheduled").length,
    sending: campaigns.filter((c) => c.status === "sending").length,
    sent: campaigns.filter((c) => c.status === "sent").length,
  }

  if (view === "detail" && selected) {
    const live = campaigns.find((c) => c.id === selected.id) ?? selected
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-[1500px] mx-auto select-none">
        <CampaignDetailView
          campaign={live}
          onBack={() => setView("list")}
          onEdit={handleEdit}
          onSchedule={(c) => setScheduleTarget(c)}
          onSendNow={(c) => setSendTarget(c)}
          onPause={handlePause}
          onResume={handleResume}
          onDelete={handleDelete}
        />
        <CampaignFormModal isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null) }} campaign={editing} onSave={handleSave} />
        <ScheduleModal campaign={scheduleTarget} onClose={() => setScheduleTarget(null)} onConfirm={handleScheduleConfirm} />
        <SendNowDialog campaign={sendTarget} onClose={() => setSendTarget(null)} onConfirm={handleSendNowConfirm} />
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1500px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Broadcasts Dispatch</span>
          <div className="flex items-center gap-3 mt-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white/95 leading-none">Campaigns</h1>
            <div className="flex items-baseline gap-1 bg-[#111319] border border-[#1E2230] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-[#FE8A5C]">
              <span>{campaigns.length}</span>
              <span className="text-[9px] text-[#7A8499] font-normal uppercase">Total</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true) }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Total", value: STATUS_COUNTS.total, color: "text-white" },
          { label: "Draft", value: STATUS_COUNTS.draft, color: "text-zinc-400" },
          { label: "Scheduled", value: STATUS_COUNTS.scheduled, color: "text-blue-400" },
          { label: "Sending", value: STATUS_COUNTS.sending, color: "text-amber-400" },
          { label: "Sent", value: STATUS_COUNTS.sent, color: "text-emerald-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-2xl bg-[#0F1016]/95 border border-[#1C202C] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#7A8499] uppercase tracking-wider">{label}</span>
            <span className={`text-xl font-bold font-mono ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <CampaignFilters search={search} setSearch={setSearch} status={status} setStatus={setStatus} dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} />

      {/* Table */}
      <CampaignsTable
        campaigns={filtered}
        onView={handleView}
        onEdit={handleEdit}
        onSchedule={(c) => setScheduleTarget(c)}
        onSendNow={(c) => setSendTarget(c)}
        onPause={handlePause}
        onResume={handleResume}
        onDelete={handleDelete}
      />

      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-[10px] font-mono text-[#7A8499] px-1">
          <span>Showing {filtered.length} of {campaigns.length} campaigns</span>
          <span>Page 1 of 1</span>
        </div>
      )}

      <CampaignFormModal isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null) }} campaign={editing} onSave={handleSave} />
      <ScheduleModal campaign={scheduleTarget} onClose={() => setScheduleTarget(null)} onConfirm={handleScheduleConfirm} />
      <SendNowDialog campaign={sendTarget} onClose={() => setSendTarget(null)} onConfirm={handleSendNowConfirm} />
    </motion.div>
  )
}
