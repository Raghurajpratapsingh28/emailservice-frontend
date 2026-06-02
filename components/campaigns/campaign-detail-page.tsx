"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Pencil, Calendar, Send, Pause, Play, Trash2, Users, Mail, Clock, AlertCircle, Loader2, X } from "lucide-react"
import CampaignStatusBadge from "./campaign-status-badge"
import { campaignsService } from "@/lib/campaigns-service"
import type { Campaign } from "@/lib/campaigns-data"

interface Props { workspaceId: string; campaignId: string }

export default function CampaignDetailPage({ workspaceId, campaignId }: Props) {
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleTime, setScheduleTime] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 16))
  const [scheduleError, setScheduleError] = useState("")

  useEffect(() => {
    campaignsService.get(workspaceId, campaignId)
      .then(setCampaign)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [workspaceId, campaignId])

  const refresh = () => campaignsService.get(workspaceId, campaignId).then(setCampaign).catch(console.error)

  const handlePause = async () => {
    try { setCampaign(await campaignsService.pause(workspaceId, campaignId)) } catch (e: any) { alert(e.message) }
  }
  const handleResume = async () => {
    try { setCampaign(await campaignsService.resume(workspaceId, campaignId)) } catch (e: any) { alert(e.message) }
  }
  const handleDelete = async () => {
    if (!campaign || !window.confirm(`Delete "${campaign.name}"?`)) return
    try { await campaignsService.delete(workspaceId, campaignId); router.push(`/campaigns/${workspaceId}`) } catch (e: any) { alert(e.message) }
  }
  const handleSendNow = async () => {
    if (!campaign || !window.confirm(`Send "${campaign.name}" to ${campaign.recipientCount.toLocaleString()} contacts now?`)) return
    try { await campaignsService.send(workspaceId, campaignId); refresh() } catch (e: any) { alert(e.message) }
  }
  const handleScheduleConfirm = async () => {
    const d = new Date(scheduleTime)
    if (d <= new Date()) { setScheduleError("Must be in the future."); return }
    try { setCampaign(await campaignsService.schedule(workspaceId, campaignId, d.toISOString())); setScheduleOpen(false) } catch (e: any) { alert(e.message) }
  }

  if (isLoading) return <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" /></div>
  if (!campaign) return <div className="flex items-center justify-center py-24"><p className="text-sm text-[#7A8499] font-mono">Campaign not found.</p></div>

  const c = campaign
  const canEdit = ["draft", "scheduled"].includes(c.status)

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1200px] mx-auto select-none">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <button onClick={() => router.push(`/campaigns/${workspaceId}`)} className="flex items-center gap-1.5 text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-colors mb-3 cursor-pointer">
            <ArrowLeft className="w-3 h-3" /> Back to Campaigns
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-extrabold tracking-tight text-white/95">{c.name}</h1>
            <CampaignStatusBadge status={c.status} />
          </div>
          <p className="text-xs text-[#B0B8C8] mt-1.5 font-mono">{c.subject}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {canEdit && <Btn onClick={() => router.push(`/campaigns/${workspaceId}/edit/${c.id}`)} color="text-[#9CA3AF]" border="border-[#6B7280]/25 hover:border-[#6B7280]/50"><Pencil className="w-3.5 h-3.5" /> Edit</Btn>}
          {c.status === "draft" && <>
            <Btn onClick={() => setScheduleOpen(true)} color="text-blue-400" border="border-blue-500/25 hover:border-blue-500/50"><Calendar className="w-3.5 h-3.5" /> Schedule</Btn>
            <Btn onClick={handleSendNow} color="text-[#FE8A5C]" border="border-[#FE8A5C]/25 hover:border-[#FE8A5C]/50"><Send className="w-3.5 h-3.5" /> Send Now</Btn>
          </>}
          {["scheduled", "sending"].includes(c.status) && <Btn onClick={handlePause} color="text-amber-400" border="border-amber-500/25 hover:border-amber-500/50"><Pause className="w-3.5 h-3.5" /> Pause</Btn>}
          {c.status === "paused" && <Btn onClick={handleResume} color="text-emerald-400" border="border-emerald-500/25 hover:border-emerald-500/50"><Play className="w-3.5 h-3.5" /> Resume</Btn>}
          {["draft", "scheduled", "paused", "failed"].includes(c.status) && <Btn onClick={handleDelete} color="text-red-400" border="border-red-500/25 hover:border-red-500/50"><Trash2 className="w-3.5 h-3.5" /> Delete</Btn>}
        </div>
      </div>

      {c.status === "failed" && c.errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-400">Campaign Failed</p>
            <p className="text-[10px] text-red-400/80 font-mono mt-0.5">{c.errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoCard icon={<Users className="w-4 h-4 text-[#6B7280]" />} label="Recipients">
          <p className="text-sm font-bold font-mono text-white">{c.recipientCount > 0 ? c.recipientCount.toLocaleString() : "—"}</p>
          <p className="text-[10px] text-[#B0B8C8] mt-0.5">{c.segmentName}</p>
        </InfoCard>
        <InfoCard icon={<Mail className="w-4 h-4 text-[#FE8A5C]" />} label="Sender">
          <p className="text-xs font-semibold text-white/90">{c.fromName}</p>
          <p className="text-[10px] text-[#B0B8C8] font-mono mt-0.5">{c.fromEmail}</p>
        </InfoCard>
        <InfoCard icon={<Clock className="w-4 h-4 text-blue-400" />} label="Schedule">
          {c.sentAt ? <p className="text-xs font-mono text-emerald-400">Sent {new Date(c.sentAt).toLocaleString()}</p>
            : c.scheduledAt ? <p className="text-xs font-mono text-blue-400">{new Date(c.scheduledAt).toLocaleString()}</p>
            : <p className="text-xs text-[#7A8499] font-mono">Not scheduled</p>}
        </InfoCard>
      </div>

      <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] space-y-4">
        <h3 className="text-xs font-semibold text-white/80 tracking-tight">Content Preview</h3>
        <div className="space-y-1">
          <p className="text-[9px] font-mono text-[#7A8499] uppercase">Subject</p>
          <p className="text-sm font-semibold text-white/90">{c.subject}</p>
          {c.previewText && <p className="text-xs text-[#B0B8C8]">{c.previewText}</p>}
        </div>
        <div className="rounded-2xl border border-[#1C202C] overflow-hidden bg-white">
          {c.htmlBody
            ? <iframe srcDoc={c.htmlBody} className="w-full h-[300px] border-0" sandbox="allow-same-origin" title="Preview" />
            : <div className="h-[120px] flex items-center justify-center text-xs text-zinc-400 bg-zinc-900">No HTML content</div>
          }
        </div>
      </div>

      {/* Schedule modal */}
      {scheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setScheduleOpen(false)} />
          <div className="relative w-full max-w-md bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C]">
              <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Schedule Campaign</span>
              <button onClick={() => setScheduleOpen(false)} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <input type="datetime-local" value={scheduleTime} min={new Date().toISOString().slice(0, 16)} onChange={(e) => { setScheduleTime(e.target.value); setScheduleError("") }} className="w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white font-mono focus:outline-none transition-colors cursor-pointer" />
              {scheduleError && <p className="text-[10px] text-red-400 font-mono">{scheduleError}</p>}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1C202C]">
              <button onClick={() => setScheduleOpen(false)} className="px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">Cancel</button>
              <button onClick={handleScheduleConfirm} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer">Confirm Schedule</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

function InfoCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-2xl bg-[#0F1016]/95 border border-[#1C202C]">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-[#12141A] border border-[#1E2230]">{icon}</div>
        <span className="text-xs font-semibold text-white/80 tracking-tight">{label}</span>
      </div>
      {children}
    </div>
  )
}

function Btn({ onClick, color, border, children }: { onClick: () => void; color: string; border: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3.5 py-2 bg-[#111319] hover:bg-[#1C1F2D] border ${border} rounded-xl text-xs font-semibold ${color} transition-all cursor-pointer`}>
      {children}
    </button>
  )
}
