"use client"

import { useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import { workspaceService } from "@/lib/workspace-service"

export default function DangerZoneTab({ workspaceId, onUpdate }: { workspaceId: string; onUpdate?: () => void }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [action, setAction] = useState<"deactivate" | "reactivate">("deactivate")
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async () => {
    setIsLoading(true)
    try {
      if (action === "deactivate") {
        await workspaceService.deactivateWorkspace(workspaceId)
      } else {
        await workspaceService.reactivateWorkspace(workspaceId)
      }
      setConfirmOpen(false)
      onUpdate?.()
    } catch (error) {
      console.error(`Failed to ${action} workspace:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/20">
        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <p className="text-xs text-red-400">Actions in this section are irreversible or have significant impact. Proceed with caution.</p>
      </div>

      <DangerCard
        title="Deactivate Workspace"
        description="All mutating operations will be blocked. Members can still read data."
        actionLabel="Deactivate"
        actionCls="bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400"
        onAction={() => { setAction("deactivate"); setConfirmOpen(true) }}
      />

      <DangerCard
        title="Reactivate Workspace"
        description="Restore full workspace functionality. All operations will be re-enabled."
        actionLabel="Reactivate"
        actionCls="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400"
        onAction={() => { setAction("reactivate"); setConfirmOpen(true) }}
      />

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          <div className="relative w-full max-w-sm bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C]">
              <h2 className="text-sm font-bold text-white capitalize">{action} Workspace?</h2>
              <button onClick={() => setConfirmOpen(false)} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5">
              <p className="text-xs text-[#B0B8C8]">
                {action === "deactivate" 
                  ? "This will block all mutating operations. Members can still read data."
                  : "This will restore full workspace functionality."}
              </p>
            </div>
            <div className="flex items-center gap-3 px-6 py-5 border-t border-[#1C202C]">
              <button onClick={() => setConfirmOpen(false)} className="flex-1 px-4 py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAction} disabled={isLoading} className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 ${action === "deactivate" ? "bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400" : "bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400"}`}>
                {isLoading ? "Processing..." : action === "deactivate" ? "Deactivate" : "Reactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DangerCard({ title, description, actionLabel, actionCls, onAction }: { title: string; description: string; actionLabel: string; actionCls: string; onAction: () => void }) {
  return (
    <div className="flex items-center justify-between p-5 bg-[#08090C] border border-[#1E2230] rounded-2xl">
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-[#7A8499] mt-1">{description}</p>
      </div>
      <button onClick={onAction} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${actionCls}`}>
        {actionLabel}
      </button>
    </div>
  )
}
