"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, RefreshCw, Loader2 } from "lucide-react"
import { analyticsService, type WorkspaceSummary } from "@/lib/analytics-service"
import { billingService } from "@/lib/billing-service"
import QuickActions from "./quick-actions"
import PlanCard from "./plan-card"
import UsageSection from "./usage-section"
import CampaignsSection from "./campaigns-section"
import WorkflowsSection from "./workflows-section"
import ContactsSection from "./contacts-section"
import SegmentsSection from "./segments-section"
import DomainsSection from "./domains-section"
import MembersSection from "./members-section"
import DeliveryStatsSection from "./delivery-stats-section"

interface Props { workspaceId: string }

export default function HomeDashboard({ workspaceId }: Props) {
  const router = useRouter()
  const [data, setData] = useState<WorkspaceSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const load = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true)
    try {
      const summary = await analyticsService.getSummary(workspaceId)
      setData(summary)
      setLastUpdated(new Date())
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [workspaceId])

  const handlePortal = async () => {
    try {
      const res = await billingService.createPortal(workspaceId)
      window.open(res.url, "_blank")
    } catch {}
  }

  useEffect(() => { load() }, [load])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-6 h-6 text-[#888888] animate-spin" />
        <p className="text-[12px] text-[#8A8D96] font-medium">Loading workspace data...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-[1400px] w-full mx-auto select-none"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push("/home")}
            className="flex items-center gap-1.5 text-[10px] font-medium text-[#8A8D96] hover:text-[#FFFFFF] transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" /> All Workspaces
          </button>
          <span className="text-[10px] text-[#8A8D96] font-medium uppercase tracking-wider">
            Account Control Panel
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#FFFFFF] mt-1">
            Workspace Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[11px] text-[#8A8D96]">
              Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            onClick={() => load(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 enterprise-btn text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#8A8D96]" : ""}`} />
            Sync Data
          </button>
        </div>
      </div>

      {/* ── Row 1: Quick Actions + Plan ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <QuickActions workspaceId={workspaceId} />
        </div>
        <PlanCard subscription={data?.subscription ?? null} workspaceId={workspaceId} onPortal={handlePortal} />
      </div>

      {/* ── Row 2: Usage Meters ── */}
      <UsageSection usage={data?.usage ?? null} />

      {/* ── Row 3: Delivery Stats (email performance KPIs) ── */}
      {data && <DeliveryStatsSection delivery={data.campaigns.delivery} />}

      {/* ── Row 4: Campaigns + Workflows + Domains ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CampaignsSection
          campaigns={data?.campaigns.recent ?? []}
          total={data?.campaigns.total ?? 0}
          workspaceId={workspaceId}
        />
        <div className="space-y-6">
          <WorkflowsSection
            stats={data ? { total: data.workflows.total, published: data.workflows.published, executions: data.workflows.executions } : null}
            workspaceId={workspaceId}
          />
          <DomainsSection
            verified={data?.domains.verified ?? 0}
            pending={data?.domains.pending ?? 0}
            failed={data?.domains.failed ?? 0}
            workspaceId={workspaceId}
          />
        </div>
      </div>

      {/* ── Row 5: Contacts + Segments + Members ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ContactsSection contacts={data?.contacts ?? null} workspaceId={workspaceId} />
        </div>
        <div className="space-y-6">
          <SegmentsSection
            segments={data?.segments.top ?? []}
            total={data?.segments.total ?? 0}
            workspaceId={workspaceId}
          />
          <MembersSection
            total={data?.members.total ?? 0}
            pendingInvites={data?.members.pendingInvites ?? 0}
            workspaceId={workspaceId}
          />
        </div>
      </div>
    </motion.div>
  )
}
