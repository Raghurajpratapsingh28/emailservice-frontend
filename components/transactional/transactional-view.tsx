"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  initialSends, initialTemplates, TransactionalSend, EmailTemplate,
  VERIFIED_DOMAINS
} from "@/lib/transactional-data"
import { Plus, Search, ChevronDown } from "lucide-react"
import SendsTable from "./sends-table"
import SendDetailPanel from "./send-detail-panel"
import SendEmailModal from "./send-email-modal"
import { SendFormData } from "./send-email-modal"
import TemplatesTable from "./templates-table"
import TemplateFormModal from "./template-form-modal"
import { SendStatusBadge, TemplateStatusBadge } from "./status-badges"

type Tab = "sends" | "templates"

export default function TransactionalView() {
  const [tab, setTab] = useState<Tab>("sends")

  // Sends state
  const [sends, setSends] = useState<TransactionalSend[]>(initialSends)
  const [selectedSend, setSelectedSend] = useState<TransactionalSend | null>(null)
  const [sendModalOpen, setSendModalOpen] = useState(false)
  const [recipientFilter, setRecipientFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  // Templates state
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates)
  const [templateFormOpen, setTemplateFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [tplSearch, setTplSearch] = useState("")
  const [tplStatus, setTplStatus] = useState("all")
  const [latestOnly, setLatestOnly] = useState(true)

  // Filtered sends
  const filteredSends = useMemo(() => sends.filter((s) => {
    if (recipientFilter && !s.recipient.toLowerCase().includes(recipientFilter.toLowerCase())) return false
    if (statusFilter !== "all" && s.status !== statusFilter) return false
    if (dateFrom && new Date(s.createdAt) < new Date(dateFrom)) return false
    if (dateTo && new Date(s.createdAt) > new Date(dateTo)) return false
    return true
  }), [sends, recipientFilter, statusFilter, dateFrom, dateTo])

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    let list = templates
    if (tplSearch) list = list.filter((t) => t.name.toLowerCase().includes(tplSearch.toLowerCase()))
    if (tplStatus !== "all") list = list.filter((t) => t.status === tplStatus)
    if (latestOnly) {
      const seen = new Set<string>()
      list = list.filter((t) => { if (seen.has(t.name)) return false; seen.add(t.name); return true })
    }
    return list
  }, [templates, tplSearch, tplStatus, latestOnly])

  const handleSend = (data: SendFormData) => {
    const newSend: TransactionalSend = {
      id: `snd-${Date.now()}`,
      recipient: data.recipient ?? "",
      recipientName: data.recipient?.split("@")[0] ?? "",
      subject: data.subject ?? "",
      fromEmail: data.fromEmail ?? VERIFIED_DOMAINS[0],
      fromName: data.fromName ?? "",
      replyTo: data.replyTo ?? "",
      status: "queued",
      tags: data.tags ?? {},
      providerMessageId: null,
      failureReason: null,
      idempotencyKey: data.idempotencyKey ?? null,
      sentAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setSends((prev) => [newSend, ...prev])
  }

  const handleTemplateSave = (data: Partial<EmailTemplate> & { publishNow: boolean }) => {
    if (editingTemplate) {
      if (editingTemplate.status === "published") {
        // Create new draft version
        const newVersion: EmailTemplate = {
          ...editingTemplate, ...data,
          id: `tpl-${Date.now()}`,
          status: data.publishNow ? "published" : "draft",
          version: editingTemplate.version + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setTemplates((prev) => [newVersion, ...prev])
      } else {
        setTemplates((prev) => prev.map((t) => t.id === editingTemplate.id
          ? { ...t, ...data, status: data.publishNow ? "published" : t.status, updatedAt: new Date().toISOString() }
          : t))
      }
    } else {
      const newTpl: EmailTemplate = {
        id: `tpl-${Date.now()}`,
        name: data.name ?? "Untitled",
        subject: data.subject ?? "",
        htmlBody: data.htmlBody ?? "",
        plainText: data.plainText ?? "",
        variables: data.variables ?? [],
        status: data.publishNow ? "published" : "draft",
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setTemplates((prev) => [newTpl, ...prev])
    }
    setEditingTemplate(null)
  }

  const handlePublishTemplate = (t: EmailTemplate) =>
    setTemplates((prev) => prev.map((x) => x.id === t.id ? { ...x, status: "published", updatedAt: new Date().toISOString() } : x))

  const handleDeleteTemplate = (t: EmailTemplate) => {
    if (!window.confirm(`Archive template "${t.name}"?`)) return
    setTemplates((prev) => prev.map((x) => x.id === t.id ? { ...x, status: "archived" } : x))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1500px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Developer API</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white/95 mt-1">Transactional Emails</h1>
        </div>
        {tab === "sends" ? (
          <button onClick={() => setSendModalOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> Send Email
          </button>
        ) : (
          <button onClick={() => { setEditingTemplate(null); setTemplateFormOpen(true) }} className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> Create Template
          </button>
        )}
      </div>

      {/* Tab nav */}
      <div className="flex bg-[#12141A] p-1 rounded-xl border border-[#1E222D] w-fit">
        {(["sends", "templates"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 capitalize cursor-pointer ${tab === t ? "bg-[#252833] text-white shadow-md shadow-black/20" : "text-[#767E8C] hover:text-white"}`}>
            {t}
            <span className="ml-1.5 text-[9px] font-mono opacity-60">
              {t === "sends" ? sends.length : templates.filter((x) => x.status !== "archived").length}
            </span>
          </button>
        ))}
      </div>

      {tab === "sends" && (
        <>
          {/* Sends filters */}
          <div className="p-4 rounded-2xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8499]" />
              <input value={recipientFilter} onChange={(e) => setRecipientFilter(e.target.value)} placeholder="Search by recipient..." className="w-full pl-9 pr-3 py-2 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white placeholder-[#7A8499] focus:outline-none transition-colors" />
            </div>
            <Sel value={statusFilter} onChange={setStatusFilter}>
              <option value="all">All Statuses</option>
              {["queued", "sending", "sent", "failed", "bounced"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </Sel>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={dateCls} />
            <span className="text-[10px] text-[#7A8499] font-mono">to</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={dateCls} />
            {(recipientFilter || statusFilter !== "all" || dateFrom || dateTo) && (
              <button onClick={() => { setRecipientFilter(""); setStatusFilter("all"); setDateFrom(""); setDateTo("") }} className="text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] cursor-pointer">Clear</button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(["queued", "sending", "sent", "failed", "bounced"] as const).map((s) => (
              <div key={s} className="p-3.5 rounded-2xl bg-[#0F1016]/95 border border-[#1C202C] flex items-center justify-between">
                <SendStatusBadge status={s} />
                <span className="text-sm font-bold font-mono text-white/80">{sends.filter((x) => x.status === s).length}</span>
              </div>
            ))}
          </div>

          <SendsTable sends={filteredSends} onView={setSelectedSend} />
          {filteredSends.length > 0 && <p className="text-[10px] font-mono text-[#7A8499] px-1">Showing {filteredSends.length} of {sends.length} sends</p>}
        </>
      )}

      {tab === "templates" && (
        <>
          {/* Templates filters */}
          <div className="p-4 rounded-2xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8499]" />
              <input value={tplSearch} onChange={(e) => setTplSearch(e.target.value)} placeholder="Search templates..." className="w-full pl-9 pr-3 py-2 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white placeholder-[#7A8499] focus:outline-none transition-colors" />
            </div>
            <Sel value={tplStatus} onChange={setTplStatus}>
              <option value="all">All Statuses</option>
              {["draft", "published", "archived"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </Sel>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={latestOnly} onChange={(e) => setLatestOnly(e.target.checked)} className="w-3.5 h-3.5 accent-[#6B7280]" />
              <span className="text-[10px] font-mono text-[#B0B8C8]">Latest only</span>
            </label>
          </div>

          {/* Template stats */}
          <div className="grid grid-cols-3 gap-3">
            {(["draft", "published", "archived"] as const).map((s) => (
              <div key={s} className="p-3.5 rounded-2xl bg-[#0F1016]/95 border border-[#1C202C] flex items-center justify-between">
                <TemplateStatusBadge status={s} />
                <span className="text-sm font-bold font-mono text-white/80">{templates.filter((x) => x.status === s).length}</span>
              </div>
            ))}
          </div>

          <TemplatesTable
            templates={filteredTemplates}
            onView={(t) => { setEditingTemplate(t); setTemplateFormOpen(true) }}
            onEdit={(t) => { setEditingTemplate(t); setTemplateFormOpen(true) }}
            onPublish={handlePublishTemplate}
            onDelete={handleDeleteTemplate}
          />
        </>
      )}

      {/* Modals */}
      {selectedSend && <SendDetailPanel send={selectedSend} onClose={() => setSelectedSend(null)} />}
      <SendEmailModal isOpen={sendModalOpen} onClose={() => setSendModalOpen(false)} templates={templates} onSend={handleSend} />
      <TemplateFormModal isOpen={templateFormOpen} onClose={() => { setTemplateFormOpen(false); setEditingTemplate(null) }} template={editingTemplate} onSave={handleTemplateSave} />
    </motion.div>
  )
}

function Sel({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none pl-3 pr-8 py-2 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white/80 font-mono cursor-pointer focus:outline-none transition-colors">
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#7A8499] pointer-events-none" />
    </div>
  )
}

const dateCls = "px-3 py-2 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white/80 font-mono focus:outline-none transition-colors cursor-pointer"
