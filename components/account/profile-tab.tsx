"use client"

import { useState } from "react"
import { ROLE_META } from "@/lib/settings-data"
import { CheckCircle2, AlertTriangle, Save } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { authService } from "@/lib/auth-service"
import { toast } from "@/lib/toast"

export default function ProfileTab() {
  const { user, refreshUser } = useAuth()
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [isResending, setIsResending] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleResendVerification = async () => {
    setIsResending(true)
    try {
      await authService.resendVerification()
      toast.success("Verification email sent", "Check your inbox")
    } catch (error: any) {
      if (error.code === "EMAIL_ALREADY_VERIFIED") {
        toast.error("Email already verified")
      } else {
        toast.error("Failed to send email", error.message)
      }
    } finally {
      setIsResending(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await authService.updateProfile({ firstName, lastName })
      toast.success("Profile updated")
      await refreshUser()
    } catch (error: any) {
      toast.error("Failed to update profile", error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-8 max-w-xl">
      {/* Unverified banner */}
      {!user.isEmailVerified && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-amber-400">Your email is not verified. Check your inbox or{" "}
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="underline cursor-pointer disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend verification email"}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* User info */}
      <div className="space-y-4">
        <h3 className={sectionTitle}>Profile Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name">
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inp} />
          </Field>
          <Field label="Last Name">
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inp} />
          </Field>
        </div>
        <Field label="Email">
          <div className="flex items-center gap-3">
            <input value={user.email} readOnly className={`${inp} opacity-60 cursor-not-allowed flex-1`} />
            {user.isEmailVerified ? (
              <span className="flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full bg-emerald-500/10 border-emerald-500/25 text-emerald-400 whitespace-nowrap">
                <CheckCircle2 className="w-2.5 h-2.5" /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full bg-amber-500/10 border-amber-500/25 text-amber-400 whitespace-nowrap">
                <AlertTriangle className="w-2.5 h-2.5" /> Unverified
              </span>
            )}
          </div>
        </Field>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" /> {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Workspace memberships */}
      <div className="space-y-3">
        <h3 className={sectionTitle}>Workspace Memberships</h3>
        <div className="rounded-2xl border border-[#1C202C] overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1C202C]">
                {["Workspace", "Role", "Joined"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-white/80 tracking-tight">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C202C]/60">
              {user.workspaces.map((w) => {
                const role = w.role.toLowerCase() as keyof typeof ROLE_META
                const meta = ROLE_META[role] ?? ROLE_META.member
                return (
                  <tr key={w.id} className="hover:bg-[#111319] transition-colors">
                    <td className="px-4 py-3 font-semibold text-white/90">{w.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase ${meta.cls}`}>{w.role}</span>
                    </td>
                    <td className="px-4 py-3 text-[#B0B8C8] font-mono whitespace-nowrap">
                      -
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-mono font-semibold text-[#7A8499] uppercase tracking-wider block">{label}</label>
      {children}
    </div>
  )
}

const inp = "w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white placeholder-[#7A8499] focus:outline-none transition-colors"
const sectionTitle = "text-xs font-semibold text-white/80 tracking-tight border-b border-[#1C202C] pb-2"
