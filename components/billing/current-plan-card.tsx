"use client"

import { Subscription, PLANS, CURRENT_ROLE } from "@/lib/billing-data"
import { CheckCircle2, AlertTriangle, XCircle, Clock, ExternalLink } from "lucide-react"

interface Props {
  subscription: any
  onChangePlan: () => void
  onCancel: () => void
  onResume: () => void
  onUpgrade: () => void
  onManageBilling?: () => void
}

export default function CurrentPlanCard({ subscription: sub, onChangePlan, onCancel, onResume, onUpgrade, onManageBilling }: Props) {
  const plan = PLANS.find((p) => p.id === sub.plan)
  const isOwner = CURRENT_ROLE === "owner"
  const periodEnd = new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  const periodStart = new Date(sub.currentPeriodStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })

  const STATUS_BADGE: Record<Subscription["status"], React.ReactNode> = {
    active:   <Badge cls="bg-emerald-500/10 border-emerald-500/25 text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Active</Badge>,
    trialing: <Badge cls="bg-blue-500/10 border-blue-500/25 text-blue-400"><Clock className="w-3 h-3" /> Trial</Badge>,
    past_due: <Badge cls="bg-red-500/10 border-red-500/25 text-red-400"><XCircle className="w-3 h-3" /> Past Due</Badge>,
    canceled: <Badge cls="bg-zinc-500/10 border-zinc-500/25 text-zinc-400"><XCircle className="w-3 h-3" /> Canceled</Badge>,
    free:     <Badge cls="bg-zinc-500/10 border-zinc-500/25 text-zinc-400">Free</Badge>,
  }

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-b from-[#111318] to-[#0A0713] border border-[#1F2937] relative overflow-hidden shadow-lg shadow-[#6B7280]/5">
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#6B7280]/8 blur-3xl rounded-full pointer-events-none" />

      <div className="flex items-start justify-between mb-5 z-10 relative">
        <div>
          <span className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-widest">Current Plan</span>
          <div className="flex items-center gap-3 mt-1.5">
            <h2 className="text-2xl font-bold text-white tracking-tight">{plan?.name ?? "Free"}</h2>
            {STATUS_BADGE[sub.status]}
          </div>
          {sub.status !== "free" && plan && (
            <p className="text-sm text-[#B0B8C8] mt-1 font-mono">
              ${sub.billingInterval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice}/{sub.billingInterval === "yearly" ? "yr" : "mo"}
              <span className="text-[#7A8499] ml-1.5 capitalize">({sub.billingInterval})</span>
            </p>
          )}
        </div>
        {isOwner && onManageBilling && (
          <button onClick={onManageBilling} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6B7280]/10 hover:bg-[#6B7280]/20 border border-[#6B7280]/30 rounded-xl text-[10px] font-mono font-semibold text-[#9CA3AF] transition-all cursor-pointer">
            <ExternalLink className="w-3 h-3" /> Manage Billing
          </button>
        )}
      </div>

      {/* Conditional banners */}
      {sub.cancelAtPeriodEnd && (
        <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-amber-400 font-semibold">Cancels on {periodEnd}</p>
            <p className="text-[10px] text-[#B0B8C8] mt-0.5">Your plan remains active until then. You can resume anytime.</p>
          </div>
          {isOwner && <button onClick={onResume} className="text-[10px] font-semibold text-amber-400 hover:underline cursor-pointer whitespace-nowrap">Resume Plan</button>}
        </div>
      )}
      {sub.status === "past_due" && (
        <div className="mb-4 p-3.5 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-start gap-3">
          <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-400">Payment failed. <button className="underline cursor-pointer">Update payment method</button> to avoid service interruption.</p>
        </div>
      )}
      {sub.status === "trialing" && sub.trialEndsAt && (
        <div className="mb-4 p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/20">
          <p className="text-xs text-blue-400">Trial ends on {new Date(sub.trialEndsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.</p>
        </div>
      )}

      {sub.status !== "free" && (
        <div className="p-3.5 rounded-2xl bg-[#08090C] border border-[#1E2230] space-y-1.5 text-xs mb-5">
          <div className="flex justify-between">
            <span className="text-[#7A8499] font-mono">Billing period</span>
            <span className="text-white/80 font-mono">{periodStart} – {periodEnd}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A8499] font-mono">Next renewal</span>
            <span className="text-white/80 font-mono">{periodEnd}</span>
          </div>
        </div>
      )}

      {isOwner && (
        <div className="flex items-center gap-2 flex-wrap">
          {sub.status === "free" ? (
            <button onClick={onUpgrade} className="px-4 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer">
              Upgrade Plan
            </button>
          ) : sub.status === "canceled" ? (
            <button onClick={onUpgrade} className="px-4 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] text-white rounded-xl text-xs font-semibold cursor-pointer">
              Resubscribe
            </button>
          ) : (
            <>
              {!sub.cancelAtPeriodEnd && (
                <button onClick={onChangePlan} className="px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">
                  Change Plan
                </button>
              )}
              {!sub.cancelAtPeriodEnd && (
                <button onClick={onCancel} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 rounded-xl text-xs font-semibold text-red-400 transition-all cursor-pointer">
                  Cancel Subscription
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function Badge({ cls, children }: { cls: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase ${cls}`}>
      {children}
    </span>
  )
}
