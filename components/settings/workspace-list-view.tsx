"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Plus, Settings, Users, AlertTriangle, ArrowRightLeft } from "lucide-react"
import { workspaceService, type Workspace } from "@/lib/workspace-service"
import { apiClient } from "@/lib/api-client"
import { tokenManager } from "@/lib/token-manager"

export default function WorkspaceListView() {
  const router = useRouter()
  const [workspaces, setWorkspaces] = useState<Array<{ workspace: Workspace; role: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [plan, setPlan] = useState("free")
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadWorkspaces()
  }, [])

  const loadWorkspaces = async () => {
    try {
      const res = await workspaceService.getWorkspaces()
      setWorkspaces(res.items)
    } catch (error) {
      console.error("Failed to load workspaces:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      await workspaceService.createWorkspace({ name, slug: slug || undefined, plan })
      setShowCreateForm(false)
      setName("")
      setSlug("")
      setPlan("free")
      loadWorkspaces()
    } catch (error) {
      console.error("Failed to create workspace:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleSwitch = async (workspaceId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const res = await workspaceService.switchWorkspace(workspaceId)
      apiClient.setAccessToken(res.accessToken)
      tokenManager.setAccessToken(res.accessToken, res.expiresIn)
      router.push(`/settings/${workspaceId}`)
    } catch (error) {
      console.error("Failed to switch workspace:", error)
    }
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1200px] mx-auto select-none">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Workspace Management</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white/95 mt-1">Workspaces</h1>
        </div>
        <button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer">
          <Plus className="w-4 h-4" /> Create Workspace
        </button>
      </div>

      <div className="grid gap-4">
        {workspaces.map(({ workspace, role }) => (
          <div key={workspace.id} className="p-6 bg-[#08090C] border border-[#1E2230] rounded-2xl hover:border-[#383E58] transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1" onClick={() => router.push(`/settings/${workspace.id}`)} className="cursor-pointer">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{workspace.name}</h3>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-lg bg-[#6B7280]/10 border border-[#6B7280]/20 text-[#9CA3AF]">{role}</span>
                  {workspace.status === "inactive" && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">inactive</span>
                  )}
                </div>
                <p className="text-xs text-[#7A8499] font-mono mt-1">/{workspace.slug}</p>
                <p className="text-xs text-[#B0B8C8] mt-2">Plan: {workspace.plan}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => handleSwitch(workspace.id, e)} className="p-2 hover:bg-[#12141A] rounded-xl text-[#7A8499] hover:text-white transition-all cursor-pointer" title="Switch to this workspace">
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
                <Settings className="w-5 h-5 text-[#7A8499]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateForm(false)} />
          <div className="relative w-full max-w-md bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-[#1C202C]">
              <h2 className="text-sm font-bold text-white">Create Workspace</h2>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1.5">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required className="w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white placeholder-[#7A8499] focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1.5">Slug (optional)</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Auto-generated from name" className="w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white placeholder-[#7A8499] focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1.5">Plan</label>
                <select value={plan} onChange={e => setPlan(e.target.value)} className="w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white cursor-pointer focus:outline-none transition-colors">
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateForm(false)} className="flex-1 px-4 py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isCreating} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50">
                  {isCreating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  )
}
