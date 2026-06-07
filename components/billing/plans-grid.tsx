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
    <div className="p-6 rounded-[16px] bg-[#18191C] border border-[#202126]">
      <div className="flex items-center justify-between border-b border-[#202126]/60 pb-4 mb-6">
        <div>
          <h3 className="text-xs font-semibold text-[#FFFFFF]/80 tracking-tight">Plans & Pricing</h3>
          <p className="text-[11px] text-[#8A8D96] mt-0.5">Upgrade or downgrade your plan at any time.</p>
        </div>
        {/* Interval toggle */}
        <div className="flex bg-[#18191C] p-1 rounded-[12px] border border-[#1E222D]">
          {(["monthly", "yearly"] as const).map((i) => (
            <button
              key={i}
              onClick={() => setInterval(i)}
              className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider font-semibold rounded-lg transition-all cursor-pointer ${interval === i ? "bg-[#252833] text-[#FFFFFF] shadow-md" : "text-[#767E8C] hover:text-[#FFFFFF]"}`}
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
              className={`p-5 rounded-[12px] border flex flex-col transition-all ${
                isCurrent
                  ? "bg-[#6B7280]/5 border-[#6B7280]/40 shadow-lg shadow-[#6B7280]/5"
                  : "bg-[#18191C] border-[#202126] hover:border-[#696CFF]"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className={`text-[10px] font-medium uppercase tracking-wider font-bold uppercase tracking-widest ${isCurrent ? "text-[#8A8D96]" : "text-[#8A8D96]"}`}>
                    {plan.name}
                  </p>
                  <p className="text-2xl font-bold text-[#FFFFFF] mt-1">
                    {price === 0 ? "Free" : `$${price}`}
                    {price > 0 && <span className="text-xs font-normal text-[#8A8D96] ml-1">/{interval === "yearly" ? "yr" : "mo"}</span>}
                  </p>
                </div>
                {isCurrent && <Sparkles className="w-4 h-4 text-[#8A8D96]" />}
              </div>

              <div className="space-y-2 flex-1 mb-5">
                {[
                  { label: "Contacts", value: plan.contacts },
                  { label: "Emails/mo", value: plan.emails },
                  { label: "Events/mo", value: plan.events },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-[#8A8D96] font-medium uppercase tracking-wider">{label}</span>
                    <span className="font-medium uppercase tracking-wider font-semibold text-[#FFFFFF]/80">{value.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {isCurrent ? (
                <div className="flex items-center justify-center gap-1.5 py-2 rounded-[12px] bg-[#6B7280]/10 border border-[#6B7280]/25 text-[10px] font-medium uppercase tracking-wider font-semibold text-[#8A8D96]">
                  <CheckCircle2 className="w-3 h-3" /> Current Plan
                </div>
              ) : isOwner ? (
                <button
                  onClick={() => onSelectPlan(plan.id, interval)}
                  className={`w-full py-2 rounded-[12px] text-xs font-semibold transition-all cursor-pointer ${
                    isUpgrade
                      ? "bg-[#696CFF] hover:bg-[#5A5CE6] text-[#FFFFFF] shadow-lg shadow-[#696CFF]/15"
                      : "bg-[#18191C] hover:bg-[#25262B] border border-[#202126] hover:border-[#696CFF] text-[#8A8D96] hover:text-[#FFFFFF]"
                  }`}
                >
                  {isUpgrade ? "Upgrade" : "Downgrade"}
                </button>
              ) : (
                <div className="py-2 text-center text-[10px] font-medium uppercase tracking-wider text-[#8A8D96]">View only</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
