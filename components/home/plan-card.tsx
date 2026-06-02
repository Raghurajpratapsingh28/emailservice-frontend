"use client"

import { Calendar, Sparkles } from "lucide-react"
import type { Subscription } from "@/lib/billing-service"
import { billingService } from "@/lib/billing-service"

interface Props { subscription: Subscription | null; workspaceId: string }

export default function PlanCard({ subscription, workspaceId }: Props) {
  const plan = subscription?.plan ?? "free"
  const interval = subscription?.billingInterval ?? "—"
  const renewal = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "—"
  const cancelPending = subscription?.cancelAtPeriodEnd

  const handlePortal = async () => {
    try {
      const res = await billingService.createPortal(workspaceId)
      window.open(res.url, "_blank")
    } catch (e: any) { alert(e.message) }
  }

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-b from-[#111318] to-[#0A0713] border border-[#1F2937] flex flex-col justify-between relative overflow-hidden shadow-lg shadow-[#6B7280]/5">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#6B7280]/10 blur-3xl rounded-full pointer-events-none" />
      <div className="flex items-center justify-between z-10">
        <span className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-widest">Active Plan</span>
        <span className="bg-[#6B7280]/20 border border-[#6B7280]/40 text-[#D1D5DB] text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase">{interval}</span>
      </div>
      <div className="mt-4 z-10">
        <h3 className="text-2xl font-serif text-white font-light tracking-tight capitalize">{plan} Plan</h3>
        <div className="flex items-center gap-1.5 text-xs text-[#B0B8C8] mt-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span>{cancelPending ? "Cancels" : "Renews"}: <span className="font-mono text-white/95">{renewal}</span></span>
        </div>
        {cancelPending && <p className="text-[10px] text-amber-400 font-mono mt-1">Cancellation pending at period end</p>}
      </div>
      <button onClick={handlePortal} className="mt-5 w-full py-2.5 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer z-10 flex items-center justify-center gap-2">
        Manage Subscription <Sparkles className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
