"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import WorkspaceTab from "./workspace-tab"
import GeneralTab from "./general-tab"
import MembersTab from "./members-tab"
import DangerZoneTab from "./danger-zone-tab"
import { Settings, Users, AlertTriangle, Building2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { workspaceService, type WorkspaceSettings, type WorkspaceMember } from "@/lib/workspace-service"

type Tab = "workspace" | "general" | "members" | "danger"

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "workspace", label: "Workspace",   icon: Building2 },
  { id: "general",   label: "General",     icon: Settings },
  { id: "members",   label: "Members",     icon: Users },
  { id: "danger",    label: "Danger Zone", icon: AlertTriangle },
]

export default function SettingsView({ workspaceId: propWorkspaceId }: { workspaceId?: string }) {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>("general")
  const [settings, setSettings] = useState<WorkspaceSettings | null>(null)
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [workspace, setWorkspace] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [workspaceId, setWorkspaceId] = useState<string>("")

  useEffect(() => {
    if (propWorkspaceId) {
      setWorkspaceId(propWorkspaceId)
      loadData(propWorkspaceId)
    } else if (user?.workspaces?.[0]) {
      const wsId = user.workspaces[0].id
      setWorkspaceId(wsId)
      loadData(wsId)
    }
  }, [user, propWorkspaceId])

  const loadData = async (wsId: string) => {
    try {
      const [settingsRes, membersRes, workspacesRes] = await Promise.all([
        workspaceService.getSettings(wsId).catch(() => ({ settings: null })),
        workspaceService.getMembers(wsId).catch(() => ({ items: [] })),
        workspaceService.getWorkspaces(),
      ])
      setSettings(settingsRes.settings)
      setMembers(membersRes.items)
      
      const currentWs = workspacesRes.items.find(item => item.workspace.id === wsId)
      if (currentWs) {
        setWorkspace(currentWs.workspace)
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !settings) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1200px] mx-auto select-none">
      {/* Header */}
      <div>
        <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Workspace Administration</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white/95 mt-1">Settings</h1>
      </div>

      {/* Status banner */}
      {workspace?.status === "inactive" && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-400 font-semibold">Workspace is deactivated. All mutating operations are blocked.</p>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <nav className="w-44 shrink-0 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                tab === id
                  ? id === "danger"
                    ? "bg-red-500/10 border border-red-500/20 text-red-400"
                    : "bg-[#6B7280]/10 border border-[#6B7280]/25 text-[#9CA3AF]"
                  : "text-[#B0B8C8] hover:bg-[#12141A] hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === "workspace" && workspace && <WorkspaceTab workspace={workspace} workspaceId={workspaceId} onUpdate={() => loadData(workspaceId)} />}
          {tab === "general" && <GeneralTab settings={settings} workspaceId={workspaceId} onUpdate={() => loadData(workspaceId)} />}
          {tab === "members" && <MembersTab members={members} workspaceId={workspaceId} onUpdate={() => loadData(workspaceId)} />}
          {tab === "danger" && <DangerZoneTab workspaceId={workspaceId} onUpdate={() => loadData(workspaceId)} />}
        </div>
      </div>
    </motion.div>
  )
}
