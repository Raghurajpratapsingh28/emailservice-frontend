"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { workspaceService, type Workspace } from "@/lib/workspace-service"

export default function WorkspaceTab({ workspace, workspaceId, onUpdate }: { workspace: Workspace; workspaceId: string; onUpdate: () => void }) {
  const [name, setName] = useState(workspace.name)
  const [slug, setSlug] = useState(workspace.slug)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await workspaceService.updateWorkspace(workspaceId, {
        name,
        slug,
        version: workspace.version,
      })
      onUpdate()
    } catch (error) {
      console.error("Failed to update workspace:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <Section title="Workspace Information">
        <Field label="Name">
          <input value={name} onChange={e => setName(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Slug">
          <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} className={inputCls} />
          <p className="text-[9px] text-[#7A8499] font-mono mt-1">app.engageiq.com/{slug}</p>
        </Field>
        <Field label="Plan">
          <div className="text-xs text-[#B0B8C8] font-mono">{workspace.plan}</div>
        </Field>
        <Field label="Status">
          <div className={`inline-flex text-[9px] font-mono px-2 py-0.5 rounded-lg ${workspace.status === "active" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border border-amber-500/20 text-amber-400"}`}>
            {workspace.status}
          </div>
        </Field>
      </Section>

      <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer disabled:opacity-50">
        <Save className="w-3.5 h-3.5" /> {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-white/80 tracking-tight border-b border-[#1C202C] pb-2">{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/80 tracking-tight block">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white placeholder-[#7A8499] focus:outline-none transition-colors"
