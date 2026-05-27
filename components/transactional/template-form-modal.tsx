"use client"

import { useState, useEffect } from "react"
import { EmailTemplate, TemplateVariable } from "@/lib/transactional-data"
import { X, Plus, Monitor, Smartphone, ChevronDown } from "lucide-react"

interface Props {
  isOpen: boolean
  onClose: () => void
  template?: EmailTemplate | null
  onSave: (data: Partial<EmailTemplate> & { publishNow: boolean }) => void
}

const EMPTY = { name: "", subject: "", htmlBody: "", plainText: "", variables: [] as TemplateVariable[], publishNow: false }

export default function TemplateFormModal({ isOpen, onClose, template, onSave }: Props) {
  const [form, setForm] = useState(EMPTY)
  const [publishNow, setPublishNow] = useState(false)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [tab, setTab] = useState<"edit" | "preview">("edit")
  const [nameError, setNameError] = useState("")

  useEffect(() => {
    if (template) setForm({ name: template.name, subject: template.subject, htmlBody: template.htmlBody, plainText: template.plainText, variables: template.variables, publishNow: false })
    else setForm(EMPTY)
    setPublishNow(false)
    setTab("edit")
    setNameError("")
  }, [template, isOpen])

  if (!isOpen) return null

  const set = <K extends keyof typeof EMPTY>(k: K, v: typeof EMPTY[K]) => setForm((f) => ({ ...f, [k]: v }))

  const addVar = () => set("variables", [...form.variables, { name: "", type: "string" as const }])
  const removeVar = (i: number) => set("variables", form.variables.filter((_, idx) => idx !== i))
  const updateVar = (i: number, patch: Partial<TemplateVariable>) =>
    set("variables", form.variables.map((v, idx) => idx === i ? { ...v, ...patch } : v))

  const handleSave = () => {
    if (!form.name.trim()) { setNameError("Name is required."); return }
    onSave({ ...form, publishNow })
    onClose()
  }

  // Live preview: replace {{var}} with sample values
  const previewHtml = form.htmlBody.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    const v = form.variables.find((x) => x.name === k)
    return v ? `<span style="background:#6B728020;color:#9CA3AF;padding:0 2px;border-radius:3px">{{${k}}}</span>` : `{{${k}}}`
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C] shrink-0">
          <div>
            <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">
              {template ? (template.status === "published" ? "Edit (creates new draft)" : "Edit Template") : "New Template"}
            </span>
            <h2 className="text-sm font-bold text-white mt-0.5">{form.name || "Untitled Template"}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1C202C] shrink-0 px-6">
          {(["edit", "preview"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-[10px] font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 -mb-px capitalize ${tab === t ? "border-[#6B7280] text-[#9CA3AF]" : "border-transparent text-[#7A8499] hover:text-[#B0B8C8]"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === "edit" ? (
            <div className="space-y-5">
              <Field label="Name *">
                <input value={form.name} onChange={(e) => { set("name", e.target.value); setNameError("") }} placeholder="e.g. Welcome Email" className={inputCls} />
                {nameError && <p className="text-[10px] text-red-400 font-mono mt-1">{nameError}</p>}
              </Field>
              <Field label="Subject * (supports {{variable}})">
                <input value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="Welcome to EngageIQ, {{first_name}}!" className={inputCls} />
              </Field>
              <Field label="HTML Body * (supports {{variable}})">
                <textarea value={form.htmlBody} onChange={(e) => set("htmlBody", e.target.value)} placeholder="<h1>Hello {{first_name}}</h1>" rows={7} className={`${inputCls} font-mono resize-y`} />
              </Field>
              <Field label="Plain Text Fallback">
                <textarea value={form.plainText} onChange={(e) => set("plainText", e.target.value)} placeholder="Plain text version..." rows={3} className={`${inputCls} font-mono resize-y`} />
              </Field>

              {/* Variables */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={labelCls}>Variables</label>
                  <button onClick={addVar} className="flex items-center gap-1 text-[10px] font-mono text-[#9CA3AF] hover:text-white transition-colors cursor-pointer">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                {form.variables.length === 0 && <p className="text-[10px] text-[#7A8499] font-mono">No variables defined.</p>}
                {form.variables.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={v.name} onChange={(e) => updateVar(i, { name: e.target.value })} placeholder="variable_name" className={`${inputCls} flex-1 font-mono`} />
                    <div className="relative w-28 shrink-0">
                      <select value={v.type} onChange={(e) => updateVar(i, { type: e.target.value as TemplateVariable["type"] })} className="w-full appearance-none pl-2.5 pr-7 py-2.5 bg-[#08090C] border border-[#1E2230] rounded-xl text-xs text-white/90 cursor-pointer focus:outline-none">
                        <option value="string">string</option>
                        <option value="number">number</option>
                        <option value="boolean">boolean</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#7A8499] pointer-events-none" />
                    </div>
                    <button onClick={() => removeVar(i)} className="p-2 rounded-lg hover:bg-red-500/10 text-[#7A8499] hover:text-red-400 transition-all cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {(["desktop", "mobile"] as const).map((m) => (
                  <button key={m} onClick={() => setPreviewMode(m)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono font-semibold border transition-all cursor-pointer ${previewMode === m ? "bg-[#6B7280]/10 border-[#6B7280]/40 text-[#9CA3AF]" : "bg-[#08090C] border-[#1E2230] text-[#7A8499] hover:text-[#B0B8C8]"}`}>
                    {m === "desktop" ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                    {m}
                  </button>
                ))}
              </div>
              <div className="p-3 rounded-2xl bg-[#08090C] border border-[#1E2230]">
                <p className="text-[9px] font-mono text-[#7A8499] uppercase mb-1">Subject</p>
                <p className="text-xs font-semibold text-white/90">{form.subject || <span className="text-[#7A8499]">No subject</span>}</p>
              </div>
              <div className={`rounded-2xl border border-[#1C202C] overflow-hidden bg-white ${previewMode === "mobile" ? "max-w-[375px] mx-auto" : "w-full"}`}>
                {form.htmlBody ? (
                  <iframe srcDoc={previewHtml} className="w-full h-[320px] border-0" sandbox="allow-same-origin" title="Template preview" />
                ) : (
                  <div className="h-[160px] flex items-center justify-center text-xs text-zinc-400 bg-zinc-900">No HTML content</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#1C202C] shrink-0">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)} className="w-3.5 h-3.5 accent-[#6B7280]" />
            <span className="text-[10px] font-mono text-[#B0B8C8]">Publish immediately</span>
          </label>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer">
              {template ? "Save Changes" : "Create Template"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><label className={labelCls}>{label}</label>{children}</div>
}

const inputCls = "w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white placeholder-[#7A8499] focus:outline-none transition-colors"
const labelCls = "text-[9px] font-mono font-semibold text-[#7A8499] uppercase tracking-wider block"
