"use client"

import { Workflow, triggerLabel, validateNodes } from "@/lib/workflows-data"
import { X, Zap, AlertCircle } from "lucide-react"

interface Props {
  workflow: Workflow | null
  onClose: () => void
  onConfirm: (w: Workflow) => void
}

export default function PublishDialog({ workflow, onClose, onConfirm }: Props) {
  if (!workflow) return null

  const errors = validateNodes(workflow.nodes)
  const canPublish = errors.length === 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C]">
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Publish Workflow</span>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white">Publish "{workflow.name}"?</h2>
            <p className="text-xs text-[#B0B8C8] mt-1.5 leading-relaxed">Once published:</p>
            <ul className="mt-2 space-y-1 text-xs text-[#B0B8C8]">
              <li className="flex items-start gap-1.5"><span className="text-[#9CA3AF] mt-0.5">•</span> Contacts matching the trigger will be automatically enrolled</li>
              <li className="flex items-start gap-1.5"><span className="text-[#9CA3AF] mt-0.5">•</span> Graph cannot be edited — pause first to make changes</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#08090C] border border-[#1E2230] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#7A8499] font-mono">Trigger</span>
              <span className="text-white/80">{triggerLabel(workflow.nodes)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A8499] font-mono">Steps</span>
              <span className="text-white/80 font-mono">{workflow.nodes.length} nodes</span>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-1.5">
              {errors.map((e) => (
                <div key={e} className="flex items-start gap-2 text-xs text-red-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {e}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1C202C]">
          <button onClick={onClose} className="px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(workflow); onClose() }}
            disabled={!canPublish}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/15 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" /> Publish
          </button>
        </div>
      </div>
    </div>
  )
}
