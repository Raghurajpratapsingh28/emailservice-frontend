"use client"

import { Calendar, Sparkles } from "lucide-react"
import type { Subscription } from "@/lib/billing-service"
import { billingService } from "@/lib/billing-service"
import { toast } from "sonner"

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
    } catch (e: any) { toast.error(e.message) }
  }

  return (
    <div className="p-5 enterprise-card flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-[#8A8D96] font-medium tracking-wide">Active Plan</span>
        <span className="bg-[#696CFF]/10 text-[#696CFF] text-[10px] font-bold px-3 py-1 rounded-[12px] uppercase">{interval}</span>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-sans text-[#FFFFFF] font-bold tracking-tight capitalize">{plan} Plan</h3>
        <div className="flex items-center gap-1.5 text-sm text-[#8A8D96] mt-2">
          <Calendar className="w-4 h-4 text-[#8A8D96]" />
          <span>{cancelPending ? "Cancels" : "Renews"}: <span className="text-[#FFFFFF] font-medium">{renewal}</span></span>
        </div>
        {cancelPending && <p className="text-[11px] text-[#FF5A4F] font-medium mt-1">Cancellation pending at period end</p>}
      </div>
      <button onClick={handlePortal} className="mt-6 w-full py-3 bg-[#696CFF] hover:bg-[#5A5CE6] rounded-[16px] text-[#FFFFFF] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
        Manage Subscription <Sparkles className="w-4 h-4 text-white" />
      </button>
    </div>
  )
}
