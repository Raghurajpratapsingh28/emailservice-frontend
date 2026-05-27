"use client"

import { Campaign } from "@/lib/campaigns-data"
import CampaignStatusBadge from "./campaign-status-badge"
import { ArrowLeft, Pencil, Calendar, Send, Pause, Play, Trash2, Users, Mail, Clock, AlertCircle } from "lucide-react"

interface Props {
  campaign: Campaign
  onBack: () => void
  onEdit: (c: Campaign) => void
  onSchedule: (c: Campaign) => void
  onSendNow: (c: Campaign) => void
  onPause: (c: Campaign) => void
  onResume: (c: Campaign) => void
  onDelete: (c: Campaign) => void
}

export default function CampaignDetailView({ campaign: c, onBack, onEdit, onSchedule, onSendNow, onPause, onResume, onDelete }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-1.5 text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-colors mb-3 cursor-pointer">
            <ArrowLeft className="w-3 h-3" /> Back to Campaigns
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-extrabold tracking-tight text-white/95">{c.name}</h1>
            <CampaignStatusBadge status={c.status} />
          </div>
          <p className="text-xs text-[#B0B8C8] mt-1.5 font-mono">{c.subject}</p>
        </div>

        {/* Context-aware actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {(c.status === "draft" || c.status === "scheduled") && (
            <ActionBtn onClick={() => onEdit(c)} color="text-[#9CA3AF]" border="border-[#6B7280]/25 hover:border-[#6B7280]/50">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </ActionBtn>
          )}
          {c.status === "draft" && (
            <>
              <ActionBtn onClick={() => onSchedule(c)} color="text-blue-400" border="border-blue-500/25 hover:border-blue-500/50">
                <Calendar className="w-3.5 h-3.5" /> Schedule
              </ActionBtn>
              <ActionBtn onClick={() => onSendNow(c)} color="text-[#FE8A5C]" border="border-[#FE8A5C]/25 hover:border-[#FE8A5C]/50">
                <Send className="w-3.5 h-3.5" /> Send Now
              </ActionBtn>
            </>
          )}
          {(c.status === "scheduled" || c.status === "sending") && (
            <ActionBtn onClick={() => onPause(c)} color="text-amber-400" border="border-amber-500/25 hover:border-amber-500/50">
              <Pause className="w-3.5 h-3.5" /> Pause
            </ActionBtn>
          )}
          {c.status === "paused" && (
            <ActionBtn onClick={() => onResume(c)} color="text-emerald-400" border="border-emerald-500/25 hover:border-emerald-500/50">
              <Play className="w-3.5 h-3.5" /> Resume
            </ActionBtn>
          )}
          {["draft", "scheduled", "paused", "failed"].includes(c.status) && (
            <ActionBtn onClick={() => onDelete(c)} color="text-red-400" border="border-red-500/25 hover:border-red-500/50">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </ActionBtn>
          )}
        </div>
      </div>

      {/* Error banner for failed */}
      {c.status === "failed" && c.errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-400">Campaign Failed</p>
            <p className="text-[10px] text-red-400/80 font-mono mt-0.5">{c.errorMessage}</p>
          </div>
        </div>
      )}

      {/* Info cards */}
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
          {c.sentAt ? (
            <p className="text-xs font-mono text-emerald-400">Sent {new Date(c.sentAt).toLocaleString()}</p>
          ) : c.scheduledAt ? (
            <p className="text-xs font-mono text-blue-400">{new Date(c.scheduledAt).toLocaleString()}</p>
          ) : (
            <p className="text-xs text-[#7A8499] font-mono">Not scheduled</p>
          )}
        </InfoCard>
      </div>

      {/* Content preview */}
      <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] space-y-4">
        <h3 className="text-xs font-semibold text-white/80 tracking-tight">Content Preview</h3>
        <div className="space-y-1">
          <p className="text-[9px] font-mono text-[#7A8499] uppercase">Subject</p>
          <p className="text-sm font-semibold text-white/90">{c.subject}</p>
          {c.previewText && <p className="text-xs text-[#B0B8C8]">{c.previewText}</p>}
        </div>
        <div className="rounded-2xl border border-[#1C202C] overflow-hidden bg-white">
          {c.htmlBody ? (
            <iframe srcDoc={c.htmlBody} className="w-full h-[300px] border-0" sandbox="allow-same-origin" title="Email preview" />
          ) : (
            <div className="h-[120px] flex items-center justify-center text-xs text-zinc-400 bg-zinc-900">No HTML content</div>
          )}
        </div>
      </div>
    </div>
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

function ActionBtn({ onClick, color, border, children }: { onClick: () => void; color: string; border: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3.5 py-2 bg-[#111319] hover:bg-[#1C1F2D] border ${border} rounded-xl text-xs font-semibold ${color} transition-all cursor-pointer`}>
      {children}
    </button>
  )
}
