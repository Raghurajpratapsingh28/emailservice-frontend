"use client"

import { useState } from "react"
import { Session, parseDevice } from "@/lib/account-data"
import { X, ShieldCheck } from "lucide-react"

export default function SessionsTab({ sessions: init }: { sessions: Session[] }) {
  const [sessions, setSessions] = useState(init)
  const [revokeTarget, setRevokeTarget] = useState<Session | null>(null)

  const revoke = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id))
    setRevokeTarget(null)
  }

  const revokeAllOthers = () => {
    setSessions(sessions.filter((s) => s.isCurrent))
  }

  const others = sessions.filter((s) => !s.isCurrent)

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#7A8499]">{sessions.length} active session{sessions.length !== 1 ? "s" : ""}</span>
        {others.length > 0 && (
          <button onClick={revokeAllOthers} className="px-3.5 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-red-500/30 rounded-xl text-[10px] font-mono font-semibold text-[#B0B8C8] hover:text-red-400 transition-all cursor-pointer">
            Revoke All Other Sessions
          </button>
        )}
      </div>

      {/* Session cards */}
      <div className="space-y-3">
        {sessions.map((s) => {
          const { icon, label } = parseDevice(s.userAgent)
          return (
            <div key={s.id} className={`p-5 rounded-2xl border transition-all ${s.isCurrent ? "bg-[#6B7280]/5 border-[#6B7280]/25" : "bg-[#0F1016]/95 border-[#1C202C]"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{icon}</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white/90">{label}</span>
                      {s.isCurrent && (
                        <span className="flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full bg-emerald-500/10 border-emerald-500/25 text-emerald-400">
                          <ShieldCheck className="w-2.5 h-2.5" /> Current
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#7A8499] font-mono">IP: {s.ipAddress}</p>
                    <p className="text-[10px] text-[#7A8499] font-mono truncate max-w-[380px]">{s.userAgent}</p>
                    <div className="flex items-center gap-4 text-[9px] font-mono text-[#7A8499]">
                      <span>Created: {new Date(s.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      <span>Expires: {new Date(s.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>
                {!s.isCurrent && (
                  <button onClick={() => setRevokeTarget(s)} className="shrink-0 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 rounded-xl text-[10px] font-mono font-semibold text-red-400 transition-all cursor-pointer">
                    Revoke
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Revoke confirm */}
      {revokeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRevokeTarget(null)} />
          <div className="relative w-full max-w-sm bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C]">
              <h2 className="text-sm font-bold text-white">Revoke this session?</h2>
              <button onClick={() => setRevokeTarget(null)} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#08090C] border border-[#1E2230] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#7A8499] font-mono">Device</span>
                  <span className="text-white/80">{parseDevice(revokeTarget.userAgent).label} ({revokeTarget.ipAddress})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A8499] font-mono">Created</span>
                  <span className="text-white/80 font-mono">{new Date(revokeTarget.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-xs text-[#B0B8C8]">This device will be logged out immediately.</p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1C202C]">
              <button onClick={() => setRevokeTarget(null)} className="px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">Cancel</button>
              <button onClick={() => revoke(revokeTarget.id)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 rounded-xl text-xs font-semibold text-red-400 transition-all cursor-pointer">Revoke</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
