"use client"

import { useState, useMemo } from "react"
import { Search, ChevronDown, UserPlus, Trash2, ArrowRight, X } from "lucide-react"
import { workspaceService, type WorkspaceMember } from "@/lib/workspace-service"
import { authService } from "@/lib/auth-service"
import { useAuth } from "@/lib/auth-context"

const ROLES = ["owner", "admin", "member", "viewer"]

export default function MembersTab({ members, workspaceId, onUpdate }: { members: WorkspaceMember[]; workspaceId: string; onUpdate: () => void }) {
  const { user } = useAuth()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(null)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"admin" | "member" | "viewer">("member")

  const currentUserRole = members.find(m => m.userId === user?.id)?.roleSlug

  const filtered = useMemo(() => members.filter(m => {
    const q = search.toLowerCase()
    if (q && !m.email.toLowerCase().includes(q) && !m.firstName.toLowerCase().includes(q) && !m.lastName.toLowerCase().includes(q)) return false
    if (roleFilter !== "all" && m.roleSlug !== roleFilter) return false
    return true
  }), [members, search, roleFilter])

  const handleChangeRole = async (memberId: string, role: string) => {
    setIsLoading(true)
    try {
      await workspaceService.updateMemberRole(workspaceId, memberId, role)
      onUpdate()
    } catch (error) {
      console.error("Failed to update role:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (memberId: string) => {
    if (!confirm("Remove this member?")) return
    setIsLoading(true)
    try {
      await workspaceService.removeMember(workspaceId, memberId)
      onUpdate()
    } catch (error) {
      console.error("Failed to remove member:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransfer = async () => {
    if (!selectedMember) return
    setIsLoading(true)
    try {
      await workspaceService.transferOwnership(workspaceId, selectedMember.userId)
      setShowTransfer(false)
      setSelectedMember(null)
      onUpdate()
    } catch (error) {
      console.error("Failed to transfer ownership:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await authService.createInvite({ email: inviteEmail, role: inviteRole }, workspaceId)
      setShowInvite(false)
      setInviteEmail("")
      setInviteRole("member")
      alert("Invite sent! The user will receive an email with instructions.")
    } catch (error) {
      console.error("Failed to send invite:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#7A8499]">{members.length} members</span>
        <div className="flex items-center gap-2">
          {currentUserRole === "owner" && (
            <button onClick={() => setShowTransfer(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-all cursor-pointer">
              <ArrowRight className="w-3 h-3" /> Transfer Ownership
            </button>
          )}
          {(currentUserRole === "owner" || currentUserRole === "admin") && (
            <button onClick={() => setShowInvite(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer">
              <UserPlus className="w-3.5 h-3.5" /> Invite Member
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8499]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." className="w-full pl-9 pr-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white placeholder-[#7A8499] focus:outline-none transition-colors" />
        </div>
        <div className="relative w-40">
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white cursor-pointer focus:outline-none transition-colors">
            <option value="all">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#7A8499] pointer-events-none" />
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(m => (
          <div key={m.membershipId} className="flex items-center justify-between p-4 bg-[#08090C] border border-[#1E2230] rounded-xl hover:border-[#383E58] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B7280] to-[#4B5563] flex items-center justify-center text-xs font-bold text-white">
                {m.firstName[0]}{m.lastName[0]}
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{m.firstName} {m.lastName}</div>
                <div className="text-[10px] text-[#7A8499] font-mono">{m.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select value={m.roleSlug} onChange={e => handleChangeRole(m.membershipId, e.target.value)} disabled={isLoading || m.roleSlug === "owner"} className="appearance-none px-3 py-1.5 bg-[#12141A] border border-[#1E2230] rounded-lg text-[10px] font-mono text-[#9CA3AF] cursor-pointer focus:outline-none disabled:opacity-50">
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {m.roleSlug !== "owner" && (
                <button onClick={() => handleRemove(m.membershipId)} disabled={isLoading} className="p-1.5 hover:bg-red-500/10 rounded-lg text-[#7A8499] hover:text-red-400 transition-colors disabled:opacity-50">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTransfer(false)} />
          <div className="relative w-full max-w-md bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C]">
              <h2 className="text-sm font-bold text-white">Transfer Ownership</h2>
              <button onClick={() => setShowTransfer(false)} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-xs text-[#B0B8C8]">Select a member to transfer workspace ownership. You will be demoted to admin.</p>
              <div className="space-y-2">
                {members.filter(m => m.roleSlug !== "owner").map(m => (
                  <button key={m.membershipId} onClick={() => setSelectedMember(m)} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedMember?.membershipId === m.membershipId ? "bg-[#6B7280]/10 border-[#6B7280]/40" : "bg-[#08090C] border-[#1E2230] hover:border-[#383E58]"}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B7280] to-[#4B5563] flex items-center justify-center text-xs font-bold text-white">
                      {m.firstName[0]}{m.lastName[0]}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xs font-semibold text-white">{m.firstName} {m.lastName}</div>
                      <div className="text-[10px] text-[#7A8499] font-mono">{m.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-5 border-t border-[#1C202C]">
              <button onClick={() => setShowTransfer(false)} className="flex-1 px-4 py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">
                Cancel
              </button>
              <button onClick={handleTransfer} disabled={!selectedMember || isLoading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50">
                {isLoading ? "Transferring..." : "Transfer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowInvite(false)} />
          <div className="relative w-full max-w-md bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C]">
              <h2 className="text-sm font-bold text-white">Invite Member</h2>
              <button onClick={() => setShowInvite(false)} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleInvite} className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1.5">Email</label>
                <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required className="w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white placeholder-[#7A8499] focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1.5">Role</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value as any)} className="w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white cursor-pointer focus:outline-none transition-colors">
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setShowInvite(false)} className="flex-1 px-4 py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50">
                  {isLoading ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
