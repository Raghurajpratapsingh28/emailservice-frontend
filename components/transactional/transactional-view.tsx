"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Search, ChevronDown, ArrowLeft, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import SendsTable from "./sends-table"
import TemplatesTable from "./templates-table"
import { SendStatusBadge, TemplateStatusBadge } from "./status-badges"
import { transactionalService, type EmailSend, type EmailTemplate } from "@/lib/transactional-service"
import type { TransactionalSend, EmailTemplate as LocalEmailTemplate } from "@/lib/transactional-data"
import { initialTemplates } from "@/lib/transactional-data"

type Tab = "sends" | "templates"

interface Props { workspaceId?: string }

function mapSend(s: EmailSend): TransactionalSend {
  return {
    id: s.sendId, recipient: s.recipientEmail, recipientName: s.recipientEmail.split("@")[0],
    subject: s.subject, fromEmail: s.senderEmail, fromName: "", replyTo: "",
    status: s.status, tags: s.tags, providerMessageId: s.providerMessageId,
    failureReason: s.failureReason, idempotencyKey: null, sentAt: null,
    createdAt: s.createdAt, updatedAt: s.updatedAt,
  }
}

function mapTemplate(t: EmailTemplate): LocalEmailTemplate {
  return {
    id: t.id, name: t.name, subject: t.subject, htmlBody: t.htmlBody, plainText: t.textBody,
    variables: Object.entries(t.variables || {}).map(([name]) => ({ name, type: "string" as const })),
    status: t.status, version: t.version, createdAt: t.createdAt, updatedAt: t.updatedAt,
  }
}

export default function TransactionalView({ workspaceId: propWorkspaceId }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const workspaceId = propWorkspaceId ?? ""
  const [tab, setTab] = useState<Tab>((searchParams.get("tab") as Tab) ?? "sends")

  const [sends, setSends] = useState<TransactionalSend[]>([])
  const [sendsTotal, setSendsTotal] = useState(0)
  const [sendsLoading, setSendsLoading] = useState(true)
  const [recipientFilter, setRecipientFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const [templates, setTemplates] = useState<LocalEmailTemplate[]>([])
  const [templatesTotal, setTemplatesTotal] = useState(0)
  const [templatesLoading, setTemplatesLoading] = useState(true)
  const [tplSearch, setTplSearch] = useState("")
  const [tplStatus, setTplStatus] = useState("all")
  const [latestOnly, setLatestOnly] = useState(true)

  const loadSends = useCallback(async () => {
    if (!workspaceId) return
    setSendsLoading(true)
    try {
      const res = await transactionalService.getSends(workspaceId, {
        status: statusFilter !== "all" ? statusFilter : undefined,
        recipient: recipientFilter || undefined,
        fromDate: dateFrom || undefined,
        toDate: dateTo || undefined,
        pageSize: 100,
      })
      setSends(res.items.map(mapSend))
      setSendsTotal(res.total)
    } catch (err) { console.error(err) }
    finally { setSendsLoading(false) }
  }, [workspaceId, statusFilter, recipientFilter, dateFrom, dateTo])

  const loadTemplates = useCallback(async () => {
    if (!workspaceId) { setTemplates(initialTemplates); setTemplatesTotal(initialTemplates.length); setTemplatesLoading(false); return }
    setTemplatesLoading(true)
    try {
      const res = await transactionalService.getTemplates(workspaceId, {
        status: tplStatus !== "all" ? tplStatus : undefined,
        search: tplSearch || undefined,
        latestOnly,
        pageSize: 100,
      })
      const mapped = res.items.map(mapTemplate)
      if (mapped.length === 0) {
        setTemplates(initialTemplates)
        setTemplatesTotal(initialTemplates.length)
      } else {
        setTemplates(mapped)
        setTemplatesTotal(res.total)
      }
    } catch {
      setTemplates(initialTemplates)
      setTemplatesTotal(initialTemplates.length)
    }
    finally { setTemplatesLoading(false) }
  }, [workspaceId, tplStatus, tplSearch, latestOnly])

  useEffect(() => { loadSends() }, [loadSends])
  useEffect(() => { loadTemplates() }, [loadTemplates])

  // Auto-refresh every 5s while any send is queued or sending
  useEffect(() => {
    const hasPending = sends.some((s) => s.status === "queued" || s.status === "sending")
    if (!hasPending) return
    const id = setInterval(loadSends, 30000)
    return () => clearInterval(id)
  }, [sends, loadSends])

  const filteredSends = useMemo(() => sends.filter((s) => {
    if (recipientFilter && !s.recipient.toLowerCase().includes(recipientFilter.toLowerCase())) return false
    if (statusFilter !== "all" && s.status !== statusFilter) return false
    if (dateFrom && new Date(s.createdAt) < new Date(dateFrom)) return false
    if (dateTo && new Date(s.createdAt) > new Date(dateTo)) return false
    return true
  }), [sends, recipientFilter, statusFilter, dateFrom, dateTo])

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

  const handlePublishTemplate = async (t: LocalEmailTemplate) => {
    try { await transactionalService.updateTemplate(workspaceId, t.id, { publish: true }); loadTemplates() }
    catch (err) { console.error(err) }
  }

  const handleDeleteTemplate = async (t: LocalEmailTemplate) => {
    if (!window.confirm(`Archive template "${t.name}"?`)) return
    try { await transactionalService.deleteTemplate(workspaceId, t.id); loadTemplates() }
    catch (err) { console.error(err) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1500px] mx-auto select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {propWorkspaceId && (
            <button onClick={() => router.push("/transactional")} className="flex items-center gap-1.5 text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-colors mb-3 cursor-pointer">
              <ArrowLeft className="w-3 h-3" /> All Workspaces
            </button>
          )}
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Developer API</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white/95 mt-1">Transactional Emails</h1>
        </div>
        {tab === "sends" ? (
          <button onClick={() => router.push(`/transactional/${workspaceId}/send`)} className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> Send Email
          </button>
        ) : (
          <button onClick={() => router.push(`/transactional/${workspaceId}/template`)} className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> Create Template
          </button>
        )}
      </div>

      <div className="flex bg-[#12141A] p-1 rounded-xl border border-[#1E222D] w-fit">
        {(["sends", "templates"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 capitalize cursor-pointer ${tab === t ? "bg-[#252833] text-white shadow-md shadow-black/20" : "text-[#767E8C] hover:text-white"}`}>
            {t}<span className="ml-1.5 text-[9px] font-mono opacity-60">{t === "sends" ? sendsTotal : templatesTotal}</span>
          </button>
        ))}
      </div>

      {tab === "sends" && (
        <>
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

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(["queued", "sending", "sent", "failed", "bounced"] as const).map((s) => (
              <div key={s} className="p-3.5 rounded-2xl bg-[#0F1016]/95 border border-[#1C202C] flex items-center justify-between">
                <SendStatusBadge status={s} />
                <span className="text-sm font-bold font-mono text-white/80">{sends.filter((x) => x.status === s).length}</span>
              </div>
            ))}
          </div>

          {sendsLoading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" /></div>
          ) : (
            <>
              <SendsTable sends={filteredSends} onView={(s) => router.push(`/transactional/${workspaceId}/details/${s.id}`)} />
              {filteredSends.length > 0 && <p className="text-[10px] font-mono text-[#7A8499] px-1">Showing {filteredSends.length} of {sendsTotal} sends</p>}
            </>
          )}
        </>
      )}

      {tab === "templates" && (
        <>
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

          <div className="grid grid-cols-3 gap-3">
            {(["draft", "published", "archived"] as const).map((s) => (
              <div key={s} className="p-3.5 rounded-2xl bg-[#0F1016]/95 border border-[#1C202C] flex items-center justify-between">
                <TemplateStatusBadge status={s} />
                <span className="text-sm font-bold font-mono text-white/80">{templates.filter((x) => x.status === s).length}</span>
              </div>
            ))}
          </div>

          {templatesLoading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" /></div>
          ) : (
            <TemplatesTable
              templates={filteredTemplates}
              onView={(t) => router.push(`/transactional/${workspaceId}/template?edit=${t.id}`)}
              onEdit={(t) => router.push(`/transactional/${workspaceId}/template?edit=${t.id}`)}
              onPublish={handlePublishTemplate}
              onDelete={handleDeleteTemplate}
            />
          )}
        </>
      )}
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
