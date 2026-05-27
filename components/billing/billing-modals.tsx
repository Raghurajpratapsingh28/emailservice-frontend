"use client"

import { PLANS, BillingInterval, planPrice, Subscription } from "@/lib/billing-data"
import { X, ArrowRight, AlertTriangle } from "lucide-react"

// ── Change Plan Modal ──────────────────────────────────────────────

interface ChangePlanProps {
  targetPlanId: string | null
  interval: BillingInterval
  currentSubscription: Subscription
  onClose: () => void
  onConfirm: (planId: string, interval: BillingInterval) => void
}

export function ChangePlanModal({ targetPlanId, interval, currentSubscription, onClose, onConfirm }: ChangePlanProps) {
  if (!targetPlanId) return null
  const currentPlan = PLANS.find((p) => p.id === currentSubscription.plan)
  const targetPlan = PLANS.find((p) => p.id === targetPlanId)
  if (!currentPlan || !targetPlan) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C]">
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Change Plan</span>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <h2 className="text-sm font-bold text-white">Change to {targetPlan.name} plan?</h2>

          {/* Plan comparison */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#08090C] border border-[#1E2230] text-xs">
            <div className="text-center flex-1">
              <p className="text-[9px] font-mono text-[#7A8499] uppercase">Current</p>
              <p className="font-semibold text-white/80 mt-0.5">{currentPlan.name}</p>
              <p className="font-mono text-[#B0B8C8]">${planPrice(currentPlan, currentSubscription.billingInterval)}/mo</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#7A8499] shrink-0" />
            <div className="text-center flex-1">
              <p className="text-[9px] font-mono text-[#7A8499] uppercase">New</p>
              <p className="font-semibold text-[#9CA3AF] mt-0.5">{targetPlan.name}</p>
              <p className="font-mono text-[#B0B8C8]">${planPrice(targetPlan, interval)}/{interval === "yearly" ? "yr" : "mo"}</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-[#B0B8C8]">
            <p className="flex items-start gap-1.5"><span className="text-[#9CA3AF] mt-0.5">•</span> Proration applied immediately</p>
            <p className="flex items-start gap-1.5"><span className="text-[#9CA3AF] mt-0.5">•</span> New limits take effect now</p>
            <p className="flex items-start gap-1.5"><span className="text-[#9CA3AF] mt-0.5">•</span> {targetPlan.contacts.toLocaleString()} contacts · {targetPlan.emails.toLocaleString()} emails/mo</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1C202C]">
          <button onClick={onClose} className="px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">Cancel</button>
          <button onClick={() => { onConfirm(targetPlanId, interval); onClose() }} className="px-4 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer">
            Confirm Change
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Cancel Subscription Modal ──────────────────────────────────────

interface CancelProps {
  isOpen: boolean
  subscription: Subscription
  onClose: () => void
  onConfirm: () => void
}

export function CancelModal({ isOpen, subscription: sub, onClose, onConfirm }: CancelProps) {
  if (!isOpen) return null
  const plan = PLANS.find((p) => p.id === sub.plan)
  const periodEnd = new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C]">
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Cancel Subscription</span>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-400">Your {plan?.name} plan will remain active until <strong>{periodEnd}</strong>.</p>
          </div>
          <div className="space-y-1.5 text-xs text-[#B0B8C8]">
            <p className="font-semibold text-white/80 mb-2">After {periodEnd}:</p>
            <p className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">•</span> Workspace downgrades to Free plan</p>
            <p className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">•</span> Limits: 100 contacts, 500 emails</p>
            <p className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">•</span> Excess contacts will be read-only</p>
          </div>
          <p className="text-[10px] text-[#7A8499] font-mono">You can resume anytime before {periodEnd}.</p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1C202C]">
          <button onClick={onClose} className="px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">Keep Plan</button>
          <button onClick={() => { onConfirm(); onClose() }} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 rounded-xl text-xs font-semibold text-red-400 transition-all cursor-pointer">
            Cancel Plan
          </button>
        </div>
      </div>
    </div>
  )
}
