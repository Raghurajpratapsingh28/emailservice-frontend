"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, RefreshCw, Loader2 } from "lucide-react"
import { billingService, type Subscription, type Usage } from "@/lib/billing-service"
import { campaignsService } from "@/lib/campaigns-service"
import { contactsService } from "@/lib/contacts-service"
import { segmentsService } from "@/lib/segments-service"
import { workflowsService } from "@/lib/workflows-service"
import { domainsService } from "@/lib/domains-service"
import type { Campaign } from "@/lib/campaigns-data"
import UsageSection from "./usage-section"
import PlanCard from "./plan-card"
import CampaignsSection from "./campaigns-section"
import ContactsSection from "./contacts-section"
import SegmentsSection from "./segments-section"
import WorkflowsSection from "./workflows-section"
import DomainsSection from "./domains-section"
import QuickActions from "./quick-actions"

interface Props { workspaceId: string }

export interface HomeData {
  usage: Usage | null
  subscription: Subscription | null
  campaigns: Campaign[]
  campaignsTotal: number
  contactsTotal: number
  segments: Array<{ id: string; name: string; contactCount: number }>
  segmentsTotal: number
  workflowStats: { total: number; published: number; executions: { total: number; completed: number; failed: number; running: number } }
  domainsVerified: number
  domainsPending: number
}

export default function HomeDashboard({ workspaceId }: Props) {
  const router = useRouter()
  const [data, setData] = useState<HomeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const load = async (refresh = false) => {
    if (refresh) setIsRefreshing(true)
    try {
      const [usage, subscription, campaignsRes, contactsRes, segmentsRes, workflowsRes, domainsRes] = await Promise.allSettled([
        billingService.getUsage(workspaceId),
        billingService.getSubscription(workspaceId),
        campaignsService.list(workspaceId, { pageSize: 5 }),
        contactsService.getContacts(workspaceId, { pageSize: 1 }),
        segmentsService.listSegments(workspaceId, { pageSize: 5 }),
        workflowsService.list(workspaceId, { pageSize: 100 }),
        domainsService.list(workspaceId, { pageSize: 100 }),
      ])

      const workflows = workflowsRes.status === "fulfilled" ? workflowsRes.value.items : []
      const domains = domainsRes.status === "fulfilled" ? domainsRes.value.items : []

      setData({
        usage: usage.status === "fulfilled" ? usage.value : null,
        subscription: subscription.status === "fulfilled" ? subscription.value : null,
        campaigns: campaignsRes.status === "fulfilled" ? campaignsRes.value.items : [],
        campaignsTotal: campaignsRes.status === "fulfilled" ? campaignsRes.value.total : 0,
        contactsTotal: contactsRes.status === "fulfilled" ? contactsRes.value.total : 0,
        segments: segmentsRes.status === "fulfilled" ? segmentsRes.value.items.map(s => ({ id: s.id, name: s.name, contactCount: s.contactCount })) : [],
        segmentsTotal: segmentsRes.status === "fulfilled" ? segmentsRes.value.total : 0,
        workflowStats: {
          total: workflowsRes.status === "fulfilled" ? workflowsRes.value.total : 0,
          published: workflows.filter(w => w.status === "published").length,
          executions: workflows.reduce((acc, w) => ({
            total: acc.total + (w.executionStats?.total ?? 0),
            completed: acc.completed + (w.executionStats?.completed ?? 0),
            failed: acc.failed + (w.executionStats?.failed ?? 0),
            running: acc.running + (w.executionStats?.running ?? 0),
          }), { total: 0, completed: 0, failed: 0, running: 0 }),
        },
        domainsVerified: domains.filter(d => d.status === "verified").length,
        domainsPending: domains.filter(d => d.status !== "verified" && d.status !== "deleted" && d.status !== "deleting").length,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => { load() }, [workspaceId])

  if (isLoading) return <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 text-[#888888] animate-spin" /></div>

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 max-w-[1400px] w-full mx-auto select-none">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => router.push("/home")} className="flex items-center gap-1.5 text-[10px] font-medium text-[#8A8D96] hover:text-[#FFFFFF] transition-colors mb-2 cursor-pointer">
            <ArrowLeft className="w-3 h-3" /> All Workspaces
          </button>
          <span className="text-[10px] text-[#8A8D96] font-medium uppercase tracking-wider">Account Control Panel</span>
          <h1 className="text-2xl font-bold tracking-tight text-[#FFFFFF] mt-1">Workspace Home</h1>
        </div>
        <button onClick={() => load(true)} className="flex items-center gap-2 px-3.5 py-2 enterprise-btn text-xs font-semibold cursor-pointer">
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#8A8D96]" : ""}`} /> Sync Data
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2"><QuickActions workspaceId={workspaceId} /></div>
        <PlanCard subscription={data?.subscription ?? null} workspaceId={workspaceId} />
      </div>

      <UsageSection usage={data?.usage ?? null} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CampaignsSection campaigns={data?.campaigns ?? []} total={data?.campaignsTotal ?? 0} workspaceId={workspaceId} />
        <div className="space-y-6">
          <WorkflowsSection stats={data?.workflowStats ?? null} workspaceId={workspaceId} />
          <DomainsSection verified={data?.domainsVerified ?? 0} pending={data?.domainsPending ?? 0} workspaceId={workspaceId} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2"><ContactsSection total={data?.contactsTotal ?? 0} workspaceId={workspaceId} /></div>
        <SegmentsSection segments={data?.segments ?? []} total={data?.segmentsTotal ?? 0} workspaceId={workspaceId} />
      </div>
    </motion.div>
  )
}
