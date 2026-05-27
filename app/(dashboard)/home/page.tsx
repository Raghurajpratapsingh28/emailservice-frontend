"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Mail,
  Zap,
  Calendar,
  Sparkles,
  Megaphone,
  UserPlus,
  GitBranch,
  FileText,
  AlertCircle,
  CheckCircle2,
  Hourglass,
  Plus,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Globe
} from "lucide-react"

export default function HomePage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Trigger loading state simulator
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // Section 1: Usage Data
  const usageStats = {
    billingPeriod: "May 1, 2026 - May 31, 2026",
    metrics: [
      {
        name: "Contacts",
        used: 1200,
        limit: 50000,
        icon: Users,
        color: "from-zinc-500 to-zinc-500",
        glow: "shadow-zinc-500/10"
      },
      {
        name: "Emails Sent",
        used: 8400,
        limit: 200000,
        icon: Mail,
        color: "from-orange-500 to-red-500",
        glow: "shadow-orange-500/10"
      },
      {
        name: "Events Tracked",
        used: 42000,
        limit: 500000,
        icon: Zap,
        color: "from-blue-500 to-teal-500",
        glow: "shadow-blue-500/10"
      }
    ]
  }

  // Section 2: Plan Info
  const subscription = {
    planName: "Growth Plan",
    interval: "Monthly",
    renewalDate: "June 1, 2026",
  }

  // Section 3: Campaigns Info
  const campaignsSummary = {
    total: 12,
    breakdown: {
      draft: 3,
      scheduled: 1,
      sending: 2,
      sent: 5,
      paused: 1
    },
    recent: [
      { id: 1, name: "Q2 Growth Newsletter", status: "sent", count: 4800, date: "2 days ago" },
      { id: 2, name: "Welcome Series Part 3", status: "sending", count: 1200, date: "Active" },
      { id: 3, name: "Re-engagement Promo", status: "scheduled", count: 10000, date: "May 28" },
      { id: 4, name: "Black Friday Prep Draft", status: "draft", count: 0, date: "3 hours ago" },
      { id: 5, name: "Abandon Cart Push Sequence", status: "paused", count: 3500, date: "May 20" }
    ]
  }

  // Section 4: Contacts Info
  const contactsSummary = {
    total: 1200,
    recentTrend: "+148 contacts this week",
    breakdown: [
      { stage: "Lead", count: 420, percent: 35, color: "bg-blue-400" },
      { stage: "Subscriber", count: 510, percent: 42, color: "bg-zinc-400" },
      { stage: "Customer", count: 210, percent: 18, color: "bg-emerald-400" },
      { stage: "Churned", count: 60, percent: 5, color: "bg-red-400" }
    ]
  }

  // Section 5: Segments Info
  const segmentsSummary = {
    total: 8,
    top: [
      { name: "High Value Customers", count: 540 },
      { name: "Inactive Subscriptions", count: 310 },
      { name: "EU Contacts Only", count: 220 }
    ]
  }

  // Section 6: Workflows Info
  const workflowsSummary = {
    activeCount: 5,
    executions: {
      total: 8450,
      completed: 8200,
      failed: 48,
      running: 202
    },
    needingAttention: [
      { name: "Post-Purchase Review Request", issue: "48 Failed Executions (API Timeout)", action: "Retry Failed Items" }
    ]
  }

  // Section 7: Domains Info
  const domainsSummary = {
    verifiedCount: 2,
    verifying: [
      { domain: "outreach.engageiq.com", status: "Verifying", issue: "DKIM Mismatch detected" }
    ]
  }

  // Helpers
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
      case "sending":
        return "bg-blue-500/10 border-blue-500/25 text-blue-400"
      case "scheduled":
        return "bg-zinc-500/10 border-zinc-500/25 text-zinc-400"
      case "draft":
        return "bg-zinc-500/10 border-zinc-500/25 text-zinc-400"
      case "paused":
        return "bg-amber-500/10 border-amber-500/25 text-amber-400"
      default:
        return "bg-zinc-500/10 border-zinc-500/25 text-zinc-400"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 max-w-[1500px] mx-auto select-none"
    >
      {/* Top Header Row with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Account Control Panel</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white/95 mt-1">Workspace Home</h1>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#111319] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#6B7280]" : ""}`} />
          <span>Sync Data</span>
        </button>
      </div>

      {/* Grid Block: Quick Actions Bar & Plan details */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Section 8: Quick Actions Bar */}
        <div className="xl:col-span-2 p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white/80 tracking-tight">Quick Actions</h3>
            <p className="text-[11px] text-[#B0B8C8] mt-1">Accelerated workflows to launch outreach sequences instantly.</p>
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Create Campaign", desc: "Broadcast push", icon: Megaphone, color: "hover:border-[#FE8A5C] hover:bg-[#FE8A5C]/5" },
              { label: "Add Contact", desc: "Profile ingest", icon: UserPlus, color: "hover:border-[#3CD3AD] hover:bg-[#3CD3AD]/5" },
              { label: "Create Segment", desc: "Group filters", icon: FileText, color: "hover:border-blue-400 hover:bg-blue-400/5" },
              { label: "Create Workflow", desc: "Visual automation", icon: GitBranch, color: "hover:border-[#6B7280] hover:bg-[#6B7280]/5" }
            ].map((action) => (
              <button
                key={action.label}
                className={`p-4 rounded-2xl bg-[#08090C] border border-[#1E2230] text-left transition-all duration-300 group cursor-pointer ${action.color}`}
              >
                <action.icon className="w-5 h-5 text-[#B0B8C8] group-hover:text-white mb-3 transition-colors" />
                <p className="text-xs font-semibold text-white leading-none">{action.label}</p>
                <p className="text-[9px] text-[#7A8499] font-mono mt-1.5 leading-none">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Current Plan Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#111318] to-[#0A0713] border border-[#1F2937] flex flex-col justify-between relative overflow-hidden group shadow-lg shadow-[#6B7280]/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#6B7280]/10 blur-3xl rounded-full pointer-events-none" />
          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-widest">Active Plan</span>
            <span className="bg-[#6B7280]/20 border border-[#6B7280]/40 text-[#D1D5DB] text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase">
              {subscription.interval}
            </span>
          </div>
          <div className="mt-4 z-10">
            <h3 className="text-2xl font-serif text-white font-light tracking-tight">{subscription.planName}</h3>
            <div className="flex items-center gap-1.5 text-xs text-[#B0B8C8] mt-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
              <span>Next Renewal: <span className="font-mono text-white/95">{subscription.renewalDate}</span></span>
            </div>
          </div>
          <button className="mt-5 w-full py-2.5 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#6B7280]/20 transition-all duration-300 cursor-pointer z-10 flex items-center justify-center gap-2">
            <span>Upgrade Subscription</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Section 1: Usage Overview (Progress meters) */}
      <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white/80 tracking-tight">Usage Overview</h3>
            <p className="text-[11px] text-[#B0B8C8] mt-0.5">Track resource thresholds for this billing period.</p>
          </div>
          <div className="text-[10px] text-[#B0B8C8] bg-[#090A0E] px-3 py-1.5 rounded-xl border border-[#1C202C] mt-2 sm:mt-0">
            Billing Period: <span className="text-white/90 font-mono font-semibold">{usageStats.billingPeriod}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {usageStats.metrics.map((metric) => {
            const percentage = Math.min((metric.used / metric.limit) * 100, 100)
            return (
              <div key={metric.name} className="p-5 rounded-2xl bg-[#08090C] border border-[#161922] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#12141A] border border-[#1E2230] text-[#A7ABB3]">
                      <metric.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-white/95">{metric.name}</span>
                  </div>
                  <span className="text-[10px] text-[#7A8499] font-mono">{percentage.toFixed(1)}%</span>
                </div>

                {/* Progress bar track */}
                <div className="h-2 bg-[#12141C] rounded-full w-full relative overflow-hidden mb-3">
                  <div
                    className={`absolute left-0 top-0 h-full bg-gradient-to-r ${metric.color} rounded-full`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-[10px] text-[#7A8499] font-mono uppercase">Consumption</span>
                  <span className="text-sm font-bold font-mono text-white/90">
                    {metric.used.toLocaleString()}{" "}
                    <span className="text-[10px] font-medium text-[#B0B8C8] font-mono">/ {metric.limit.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Grid: Campaigns & Workflows (Left/Right split) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Section 3: Campaigns Summary */}
        <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white/80 tracking-tight">Campaigns Status</h3>
                <p className="text-[11px] text-[#B0B8C8] mt-0.5">Detailed breakdown of broadcast outputs.</p>
              </div>
              <div className="flex items-baseline gap-1 bg-[#12141A] px-3 py-1 rounded-xl border border-[#1E2230]">
                <span className="text-lg font-bold font-mono text-white">{campaignsSummary.total}</span>
                <span className="text-[10px] text-[#B0B8C8] font-mono">Total</span>
              </div>
            </div>

            {/* Breakdown row */}
            <div className="grid grid-cols-5 gap-2 text-center py-2 mb-4 bg-[#08090C] rounded-2xl border border-[#161922] p-3">
              {Object.entries(campaignsSummary.breakdown).map(([status, val]) => (
                <div key={status} className="border-r border-[#1E2230] last:border-0">
                  <p className="text-[9px] text-[#7A8499] font-mono uppercase">{status}</p>
                  <p className="text-sm font-bold font-mono text-white/90 mt-1">{val}</p>
                </div>
              ))}
            </div>

            {/* List of last 5 */}
            <div className="space-y-2 mt-4">
              <p className="text-[10px] text-[#7A8499] font-mono uppercase pl-1">Recent Campaign Activities</p>
              {campaignsSummary.recent.map((camp) => (
                <div
                  key={camp.id}
                  className="p-3 bg-[#08090C] hover:bg-[#11131A] border border-[#161922] rounded-xl flex items-center justify-between transition-colors duration-300"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-white/95">{camp.name}</h4>
                    <p className="text-[9px] text-[#7A8499] font-mono mt-1">
                      Target count: <span className="text-white/70">{camp.count.toLocaleString()}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-mono px-2 py-0.5 border rounded-full capitalize ${getStatusStyle(camp.status)}`}>
                      {camp.status}
                    </span>
                    <span className="text-[10px] text-[#7A8499] font-mono">{camp.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-5 w-full py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
            <Plus className="w-4 h-4 text-[#FE8A5C]" />
            <span>Create New Campaign</span>
          </button>
        </div>

        {/* Section 6 & 7: Workflows & Domains */}
        <div className="space-y-6 flex flex-col">
          {/* Workflows Card */}
          <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white/80 tracking-tight">Workflow Automations</h3>
                  <p className="text-[11px] text-[#B0B8C8] mt-0.5">Execution stats & triggers.</p>
                </div>
                <div className="flex items-baseline gap-1 bg-[#12141A] px-3 py-1 rounded-xl border border-[#1E2230]">
                  <span className="text-lg font-bold font-mono text-[#6B7280]">{workflowsSummary.activeCount}</span>
                  <span className="text-[10px] text-[#B0B8C8] font-mono">Active</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-2 text-center py-2 mb-4 bg-[#08090C] rounded-2xl border border-[#161922] p-3">
                {[
                  { label: "Executions", val: workflowsSummary.executions.total },
                  { label: "Completed", val: workflowsSummary.executions.completed },
                  { label: "Failed", val: workflowsSummary.executions.failed, color: "text-[#FE5C5C]" },
                  { label: "Running", val: workflowsSummary.executions.running }
                ].map((stat) => (
                  <div key={stat.label} className="border-r border-[#1E2230] last:border-0">
                    <p className="text-[9px] text-[#7A8499] font-mono uppercase">{stat.label}</p>
                    <p className={`text-xs font-bold font-mono mt-1 ${stat.color || "text-white/90"}`}>{stat.val.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Workflows needing attention */}
              {workflowsSummary.needingAttention.map((flow) => (
                <div
                  key={flow.name}
                  className="p-3.5 bg-[#FE5C5C]/5 border border-[#FE5C5C]/20 rounded-2xl flex items-start gap-3 mt-4"
                >
                  <AlertCircle className="w-4 h-4 text-[#FE5C5C] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-white/95">Needs Attention</h4>
                    <p className="text-[10px] text-[#FE5C5C]/90 font-mono mt-1">{flow.name}</p>
                    <p className="text-[9px] text-[#B0B8C8] mt-0.5">{flow.issue}</p>
                  </div>
                  <button className="text-[9px] font-semibold text-[#FE5C5C] hover:underline cursor-pointer">
                    {flow.action}
                  </button>
                </div>
              ))}
            </div>

            <button className="mt-5 w-full py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
              <Plus className="w-4 h-4 text-[#6B7280]" />
              <span>Create New Workflow</span>
            </button>
          </div>

          {/* Section 7: Domains Status */}
          <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
            <div className="flex items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white/80 tracking-tight">Sending Domains</h3>
                <p className="text-[11px] text-[#B0B8C8] mt-0.5">Verification status of mailing targets.</p>
              </div>
              <div className="flex items-baseline gap-1 bg-[#12141A] px-3 py-1 rounded-xl border border-[#1E2230]">
                <span className="text-lg font-bold font-mono text-[#3CD3AD]">{domainsSummary.verifiedCount}</span>
                <span className="text-[10px] text-[#B0B8C8] font-mono">Verified</span>
              </div>
            </div>

            <div className="space-y-2">
              {domainsSummary.verifying.map((dom) => (
                <div
                  key={dom.domain}
                  className="p-3 bg-[#08090C] border border-[#FE5C5C]/15 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-[#FE5C5C] flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-white/95">{dom.domain}</h4>
                      <p className="text-[9px] text-[#FE5C5C] font-mono mt-0.5">{dom.issue}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-semibold bg-[#FE5C5C]/10 border border-[#FE5C5C]/25 text-[#FE5C5C] px-2 py-0.5 rounded-full uppercase">
                    {dom.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Contacts & Segments Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Section 4: Contacts Summary */}
        <div className="xl:col-span-2 p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white/80 tracking-tight">Contacts Stage</h3>
                <p className="text-[11px] text-[#B0B8C8] mt-0.5">Total subscribers & lifecycle analysis.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#3CD3AD] font-mono font-semibold bg-[#3CD3AD]/10 border border-[#3CD3AD]/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {contactsSummary.recentTrend}
                </span>
                <div className="flex items-baseline gap-1 bg-[#12141A] px-3 py-1 rounded-xl border border-[#1E2230]">
                  <span className="text-lg font-bold font-mono text-white">{contactsSummary.total}</span>
                  <span className="text-[10px] text-[#B0B8C8] font-mono">Contacts</span>
                </div>
              </div>
            </div>

            {/* Progress breakdown of stage channels */}
            <div className="space-y-4 my-2">
              <p className="text-[10px] text-[#7A8499] font-mono uppercase pl-1">Lifecycle stage breakdown</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactsSummary.breakdown.map((item) => (
                  <div key={item.stage} className="p-3 bg-[#08090C] border border-[#161922] rounded-xl">
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="font-semibold text-white/90">{item.stage}</span>
                      <span className="font-mono text-white/60 font-semibold">{item.count} <span className="text-[9px] text-[#7A8499] font-mono">({item.percent}%)</span></span>
                    </div>
                    {/* Progress track */}
                    <div className="h-1.5 bg-[#12141C] rounded-full w-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="mt-5 w-full py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
            <Plus className="w-4 h-4 text-[#3CD3AD]" />
            <span>Add New Contact</span>
          </button>
        </div>

        {/* Section 5: Segments Overview */}
        <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white/80 tracking-tight">Filtered Segments</h3>
                <p className="text-[11px] text-[#B0B8C8] mt-0.5">Top custom segment contact weight.</p>
              </div>
              <div className="flex items-baseline gap-1 bg-[#12141A] px-3 py-1 rounded-xl border border-[#1E2230]">
                <span className="text-lg font-bold font-mono text-blue-400">{segmentsSummary.total}</span>
                <span className="text-[10px] text-[#B0B8C8] font-mono">Segments</span>
              </div>
            </div>

            {/* List of segments */}
            <div className="space-y-2 mt-4">
              <p className="text-[10px] text-[#7A8499] font-mono uppercase pl-1">Top segments by contact weight</p>
              {segmentsSummary.top.map((seg, idx) => (
                <div
                  key={seg.name}
                  className="p-3 bg-[#08090C] hover:bg-[#11131A] border border-[#161922] rounded-xl flex items-center justify-between transition-colors duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#B0B8C8]">0{idx + 1}</span>
                    <h4 className="text-xs font-semibold text-white/95">{seg.name}</h4>
                  </div>
                  <span className="text-[11px] font-mono font-semibold bg-blue-500/10 border border-blue-500/25 text-blue-400 px-2 py-0.5 rounded-lg">
                    {seg.count.toLocaleString()} profiles
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-5 w-full py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
            <Plus className="w-4 h-4 text-blue-400" />
            <span>Create New Segment</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
