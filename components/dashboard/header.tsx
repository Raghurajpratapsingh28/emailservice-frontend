"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Bell, Settings, Plus, ChevronDown, LayoutDashboard } from "lucide-react"
import { useWorkspace } from "@/lib/workspace-context"
import { workspaceService, type Workspace } from "@/lib/workspace-service"
import { apiClient } from "@/lib/api-client"

export default function Header() {
  const router = useRouter()
  const { workspaceId, setWorkspaceId } = useWorkspace()
  const [workspaces, setWorkspaces] = useState<Array<{ workspace: Workspace; role: string }>>([])
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)

  const loadWorkspaces = () => {
    workspaceService.getWorkspaces()
      .then((res) => setWorkspaces(res.items))
      .catch(console.error)
  }

  useEffect(() => {
    loadWorkspaces()
  }, [])

  useEffect(() => {
    loadWorkspaces()
  }, [workspaceId])

  useEffect(() => {
    if (workspaceId && workspaces.length > 0) {
      const ws = workspaces.find(w => w.workspace.id === workspaceId)
      setCurrentWorkspace(ws?.workspace || null)
    }
  }, [workspaceId, workspaces])

  const handleSwitchWorkspace = async (wsId: string) => {
    try {
      const res = await workspaceService.switchWorkspace(wsId)
      apiClient.setAccessToken(res.accessToken)
    } catch {}
    setWorkspaceId(wsId)
    setShowWorkspaceMenu(false)
    router.push(`/campaigns/${wsId}`)
  }

  return (
    <header className="h-16 border-b border-[#161920] bg-[#090A0E] flex items-center justify-between px-6 select-none font-sans text-white shrink-0">
      {/* Left - Workspace Selector */}
      <div className="relative">
        <button
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="flex items-center gap-3 bg-[#111319]/80 border border-[#1E222E] rounded-xl pl-3 pr-4 py-2 cursor-pointer hover:border-[#2A2E3D] hover:bg-[#111319] transition-all"
        >
          <LayoutDashboard className="w-4 h-4 text-[#9CA3AF]" />
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold">{currentWorkspace?.name || 'Select Workspace'}</span>
            {currentWorkspace && <span className="text-[9px] text-[#7A8499] font-mono">/{currentWorkspace.slug}</span>}
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#7A8499]" />
        </button>

        {showWorkspaceMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowWorkspaceMenu(false)} />
            <div className="absolute top-full left-0 mt-2 w-72 bg-[#111319] border border-[#1E222E] rounded-xl shadow-2xl z-50 py-2">
              <div className="px-3 py-2 border-b border-[#1E222E]">
                <p className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Switch Workspace</p>
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {workspaces.map(({ workspace }) => (
                  <button
                    key={workspace.id}
                    onClick={() => handleSwitchWorkspace(workspace.id)}
                    className={`w-full text-left px-3 py-2 hover:bg-[#1E222E] transition-colors ${workspace.id === workspaceId ? 'bg-[#1E222E]' : ''}`}
                  >
                    <div className="text-xs font-semibold text-white">{workspace.name}</div>
                    <div className="text-[10px] text-[#7A8499] font-mono">/{workspace.slug}</div>
                  </button>
                ))}
              </div>
              <div className="border-t border-[#1E222E] mt-1 pt-1 px-2">
                <button
                  onClick={() => router.push('/settings')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#9CA3AF] hover:text-white hover:bg-[#1E222E] rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Workspace
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right side navigation utilities */}
      <div className="flex items-center gap-4">
        <div className="relative p-2 bg-[#111319] border border-[#1E222D] rounded-xl hover:bg-[#1B1E29] hover:border-[#2C3145] text-[#B0B8C8] hover:text-white cursor-pointer transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-3 h-3 bg-[#FE5C5C] rounded-full text-[8px] font-mono font-bold text-white flex items-center justify-center border-2 border-[#090A0E]">2</span>
        </div>

        <div className="relative flex items-center bg-[#111319] border border-[#1E222D] hover:border-[#2C3145] rounded-xl transition-all px-3 py-1.5 w-60">
          <Search className="w-3.5 h-3.5 text-[#B0B8C8] mr-2" />
          <input type="text" placeholder="Search..." className="bg-transparent text-xs text-white placeholder-[#7A8499] focus:outline-none w-full" />
          <span className="text-[9px] font-mono bg-[#1E222F] px-1.5 py-0.5 rounded border border-[#2D3246] text-[#B0B8C8]">⌘K</span>
        </div>

        <button
          onClick={() => router.push('/settings')}
          className="flex items-center gap-1.5 bg-[#111319] border border-[#1E222D] hover:bg-[#1B1E29] hover:border-[#2C3145] text-xs text-[#B0B8C8] hover:text-white px-3.5 py-2 rounded-xl cursor-pointer transition-all"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>
    </header>
  )
}
