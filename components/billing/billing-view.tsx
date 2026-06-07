"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PLANS } from "@/lib/billing-data"
import CurrentPlanCard from "./current-plan-card"
import UsageSection from "./usage-section"
import PlansGrid from "./plans-grid"
import InvoicesTable from "./invoices-table"
import { ChangePlanModal, CancelModal } from "./billing-modals"
import { billingService, type Subscription, type Usage, type Invoice } from "@/lib/billing-service"
import { useAuth } from "@/lib/auth-context"

export default function BillingView() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [changePlanTarget, setChangePlanTarget] = useState<string | null>(null)
  const [changePlanInterval, setChangePlanInterval] = useState<"monthly" | "yearly">("monthly")
  const [cancelOpen, setCancelOpen] = useState(false)
  const [workspaceId, setWorkspaceId] = useState<string>("")

  useEffect(() => {
    if (user?.workspaces?.[0]) {
      const wsId = user.workspaces[0].id
      setWorkspaceId(wsId)
      loadData(wsId)
    }
  }, [user])

  const loadData = async (wsId: string) => {
    try {
      const [subRes, usageRes, invoicesRes] = await Promise.all([
        billingService.getSubscription(wsId),
        billingService.getUsage(wsId),
        billingService.getInvoices(wsId),
      ])
      setSubscription(subRes)
      setUsage(usageRes)
      setInvoices(invoicesRes.items)
    } catch (error) {
      console.error("Failed to load billing data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectPlan = async (planId: string, interval: "monthly" | "yearly") => {
    if (!subscription || subscription.status === "free") {
      try {
        const res = await billingService.createCheckout(workspaceId, { plan: planId, billingInterval: interval })
        window.location.href = res.checkoutUrl
      } catch (error) {
        console.error("Failed to create checkout:", error)
      }
      return
    }
    setChangePlanTarget(planId)
    setChangePlanInterval(interval)
  }

  const handleConfirmChange = async (planId: string, interval: "monthly" | "yearly") => {
    try {
      const res = await billingService.changePlan(workspaceId, { plan: planId, billingInterval: interval })
      setSubscription(res)
      setChangePlanTarget(null)
      loadData(workspaceId)
    } catch (error) {
      console.error("Failed to change plan:", error)
    }
  }

  const handleCancel = async () => {
    try {
      const res = await billingService.cancelSubscription(workspaceId)
      setSubscription(res)
      setCancelOpen(false)
    } catch (error) {
      console.error("Failed to cancel subscription:", error)
    }
  }

  const handleResume = async () => {
    try {
      const res = await billingService.resumeSubscription(workspaceId)
      setSubscription(res)
    } catch (error) {
      console.error("Failed to resume subscription:", error)
    }
  }

  const handleManageBilling = async () => {
    try {
      const res = await billingService.createPortal(workspaceId)
      window.location.href = res.url
    } catch (error) {
      console.error("Failed to open billing portal:", error)
    }
  }

  if (isLoading || !subscription || !usage) {
    return <div className="text-[#FFFFFF]">Loading...</div>
  }

  const period = `${new Date(usage.periodStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(usage.periodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`

  const usageMetrics = [
    { name: "Contacts", used: usage.contacts.used, limit: usage.contacts.limit },
    { name: "Emails Sent", used: usage.emails.used, limit: usage.emails.limit },
    { name: "Events Tracked", used: usage.events.used, limit: usage.events.limit },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1200px] mx-auto select-none">
      <div>
        <span className="text-[10px] text-[#8A8D96] font-medium uppercase tracking-wider">Subscription & Payments</span>
        <h1 className="text-3xl font-bold tracking-tight text-[#FFFFFF] mt-1">Billing</h1>
      </div>

      <CurrentPlanCard subscription={subscription} onChangePlan={() => setCancelOpen(false)} onCancel={() => setCancelOpen(true)} onResume={handleResume} onUpgrade={() => setChangePlanTarget("growth")} onManageBilling={handleManageBilling} />

      <UsageSection metrics={usageMetrics} period={period} />

      <PlansGrid currentPlanId={subscription.plan} onSelectPlan={handleSelectPlan} />

      <InvoicesTable invoices={invoices} />

      <ChangePlanModal targetPlanId={changePlanTarget} interval={changePlanInterval} currentSubscription={subscription} onClose={() => setChangePlanTarget(null)} onConfirm={handleConfirmChange} />
      <CancelModal isOpen={cancelOpen} subscription={subscription} onClose={() => setCancelOpen(false)} onConfirm={handleCancel} />
    </motion.div>
  )
}