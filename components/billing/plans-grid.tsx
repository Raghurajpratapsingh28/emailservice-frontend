"use client"

import { useState } from "react"
import { PLANS, BillingInterval, planPrice, CURRENT_ROLE } from "@/lib/billing-data"
import { CheckCircle2, Sparkles } from "lucide-react"

interface Props {
  currentPlanId: string
  onSelectPlan: (planId: string, interval: BillingInterval) => void
}

const PLAN_ORDER = ["free", "starter", "growth", "pro"]

export default function PlansGrid({ currentPlanId, onSelectPlan }: Props) {
  const [interval, setInterval] = useState<BillingInterval>("monthly")
  const isOwner = CURRENT_ROLE === "owner"
  const currentIdx = PLAN_ORDER.indexOf(currentPlanId)

  return (
    <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
      <div className="flex items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-6">
        <div>
          <h3 className="text-xs font-semibold text-white/80 tracking-tight">Plans & Pricing</h3>
          <p className="text-[11px] text-[#B0B8C8] mt-0.5">Upgrade or downgrade your plan at any time.</p>
        </div>
        {/* Interval toggle */}
        <div className="flex bg-[#12141A] p-1 rounded-xl border border-[#1E222D]">
          {(["monthly", "yearly"] as const).map((i) => (
            <button
              key={i}
              onClick={() => setInterval(i)}
              className={`px-3 py-1.5 text-[10px] font-mono font-semibold rounded-lg transition-all cursor-pointer ${interval === i ? "bg-[#252833] text-white shadow-md" : "text-[#767E8C] hover:text-white"}`}
            >
              {i === "yearly" ? "Yearly (save 20%)" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {PLANS.map((plan, idx) => {
          const isCurrent = plan.id === currentPlanId
          const isUpgrade = idx > currentIdx
          const price = planPrice(plan, interval)

          return (
            <div
              key={plan.id}
              className={`p-5 rounded-2xl border flex flex-col transition-all ${
                isCurrent
                  ? "bg-[#6B7280]/5 border-[#6B7280]/40 shadow-lg shadow-[#6B7280]/5"
                  : "bg-[#08090C] border-[#1E2230] hover:border-[#383E58]"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isCurrent ? "text-[#9CA3AF]" : "text-[#7A8499]"}`}>
                    {plan.name}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {price === 0 ? "Free" : `$${price}`}
                    {price > 0 && <span className="text-xs font-normal text-[#7A8499] ml-1">/{interval === "yearly" ? "yr" : "mo"}</span>}
                  </p>
                </div>
                {isCurrent && <Sparkles className="w-4 h-4 text-[#9CA3AF]" />}
              </div>

              <div className="space-y-2 flex-1 mb-5">
                {[
                  { label: "Contacts", value: plan.contacts },
                  { label: "Emails/mo", value: plan.emails },
                  { label: "Events/mo", value: plan.events },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-[#7A8499] font-mono">{label}</span>
                    <span className="font-mono font-semibold text-white/80">{value.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {isCurrent ? (
                <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#6B7280]/10 border border-[#6B7280]/25 text-[10px] font-mono font-semibold text-[#9CA3AF]">
                  <CheckCircle2 className="w-3 h-3" /> Current Plan
                </div>
              ) : isOwner ? (
                <button
                  onClick={() => onSelectPlan(plan.id, interval)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isUpgrade
                      ? "bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white shadow-lg shadow-[#6B7280]/15"
                      : "bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-[#B0B8C8] hover:text-white"
                  }`}
                >
                  {isUpgrade ? "Upgrade" : "Downgrade"}
                </button>
              ) : (
                <div className="py-2 text-center text-[10px] font-mono text-[#7A8499]">View only</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
