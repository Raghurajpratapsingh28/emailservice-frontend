"use client"

import { useState } from "react"
import { EmailTemplate, VERIFIED_DOMAINS, TransactionalSend } from "@/lib/transactional-data"
import { X, Plus, ChevronDown, AlertTriangle } from "lucide-react"

export type SendFormData = Partial<TransactionalSend> & { htmlBody?: string }

interface Props {
  isOpen: boolean
  onClose: () => void
  templates: EmailTemplate[]
  onSend: (data: SendFormData) => void
}

export default function SendEmailModal({ isOpen, onClose, templates, onSend }: Props) {
  const [recipients, setRecipients] = useState<string[]>([])
  const [recipientInput, setRecipientInput] = useState("")
  const [fromEmail, setFromEmail] = useState(VERIFIED_DOMAINS[0])
  const [fromName, setFromName] = useState("")
  const [replyTo, setReplyTo] = useState("")
  const [mode, setMode] = useState<"custom" | "template">("custom")
  const [templateId, setTemplateId] = useState("")
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [subject, setSubject] = useState("")
  const [htmlBody, setHtmlBody] = useState("")
  const [plainText, setPlainText] = useState("")
  const [tags, setTags] = useState<Record<string, string>>({})
  const [tagKey, setTagKey] = useState("")
  const [tagVal, setTagVal] = useState("")
  const [idempotencyKey, setIdempotencyKey] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  if (!isOpen) return null

  const selectedTemplate = templates.find((t) => t.id === templateId)

  const addRecipient = () => {
    const email = recipientInput.trim()
    if (!email || recipients.includes(email) || recipients.length >= 50) return
    setRecipients([...recipients, email])
    setRecipientInput("")
  }

  const handleTemplateChange = (id: string) => {
    setTemplateId(id)
    const tpl = templates.find((t) => t.id === id)
    if (tpl) setVariables(Object.fromEntries(tpl.variables.map((v) => [v.name, ""])))
  }

  const validate = (): string[] => {
    const errs: string[] = []
    if (recipients.length === 0) errs.push("At least 1 recipient required.")
    if (!VERIFIED_DOMAINS.includes(fromEmail)) errs.push("Sender domain is not verified.")
    if (mode === "custom" && !subject.trim()) errs.push("Subject is required.")
    if (mode === "custom" && !htmlBody.trim() && !plainText.trim()) errs.push("HTML body or plain text required.")
    if (mode === "template" && !templateId) errs.push("Select a template.")
    return errs
  }

  const handleSend = () => {
    const errs = validate()
    if (errs.length) { setErrors(errs); return }
    onSend({
      recipient: recipients[0],
      fromEmail, fromName, replyTo,
      subject: mode === "template" ? (selectedTemplate?.subject ?? "") : subject,
      htmlBody: mode === "template" ? (selectedTemplate?.htmlBody ?? "") : htmlBody,
      tags,
      idempotencyKey: idempotencyKey || null,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C] shrink-0">
          <div>
            <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Transactional</span>
            <h2 className="text-sm font-bold text-white mt-0.5">Send Email</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {errors.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-1">
              {errors.map((e) => <p key={e} className="text-[10px] text-red-400 font-mono flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" />{e}</p>)}
            </div>
          )}

          {/* Recipients */}
          <Section label="Recipients (max 50)">
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#08090C] border border-[#1E2230] rounded-xl min-h-[40px]">
              {recipients.map((r) => (
                <span key={r} className="flex items-center gap-1 text-[10px] font-mono bg-[#6B7280]/10 border border-[#6B7280]/25 text-[#9CA3AF] px-2 py-0.5 rounded-lg">
                  {r}
                  <button onClick={() => setRecipients(recipients.filter((x) => x !== r))} className="hover:text-red-400 cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
              <input
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRecipient())}
                placeholder={recipients.length === 0 ? "Type email and press Enter..." : ""}
                className="flex-1 min-w-[160px] bg-transparent text-xs text-white placeholder-[#7A8499] focus:outline-none"
              />
            </div>
            <p className="text-[9px] text-[#7A8499] font-mono">{recipients.length}/50 recipients</p>
          </Section>

          {/* Sender */}
          <Section label="Sender">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className={labelCls}>From Email *</label>
                <SelectWrap value={fromEmail} onChange={setFromEmail}>
                  {VERIFIED_DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                </SelectWrap>
              </div>
              <div className="space-y-1.5">
                <label className={labelCls}>From Name</label>
                <input value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="EngageIQ Team" className={inputCls} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className={labelCls}>Reply To</label>
                <input type="email" value={replyTo} onChange={(e) => setReplyTo(e.target.value)} placeholder="support@company.com" className={inputCls} />
              </div>
            </div>
          </Section>

          {/* Content mode */}
          <Section label="Content">
            <div className="flex gap-3 mb-4">
              {(["custom", "template"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono font-semibold border transition-all cursor-pointer capitalize ${mode === m ? "bg-[#6B7280]/10 border-[#6B7280]/40 text-[#9CA3AF]" : "bg-[#08090C] border-[#1E2230] text-[#7A8499] hover:text-[#B0B8C8]"}`}>
                  {m === "custom" ? "Write Custom" : "Use Template"}
                </button>
              ))}
            </div>

            {mode === "template" ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className={labelCls}>Template *</label>
                  <SelectWrap value={templateId} onChange={handleTemplateChange}>
                    <option value="">Select template...</option>
                    {templates.filter((t) => t.status === "published").map((t) => (
                      <option key={t.id} value={t.id}>{t.name} (v{t.version})</option>
                    ))}
                  </SelectWrap>
                </div>
                {selectedTemplate && selectedTemplate.variables.length > 0 && (
                  <div className="space-y-2">
                    <label className={labelCls}>Variables</label>
                    {selectedTemplate.variables.map((v) => (
                      <div key={v.name} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#9CA3AF] w-28 shrink-0">{v.name}</span>
                        <input value={variables[v.name] ?? ""} onChange={(e) => setVariables({ ...variables, [v.name]: e.target.value })} placeholder={`Enter ${v.name}...`} className={inputCls} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className={labelCls}>Subject *</label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject..." className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>HTML Body</label>
                  <textarea value={htmlBody} onChange={(e) => setHtmlBody(e.target.value)} placeholder="<h1>Hello {{firstName}}</h1>" rows={5} className={`${inputCls} font-mono resize-y`} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelCls}>Plain Text</label>
                  <textarea value={plainText} onChange={(e) => setPlainText(e.target.value)} placeholder="Plain text fallback..." rows={3} className={`${inputCls} font-mono resize-y`} />
                </div>
              </div>
            )}
          </Section>

          {/* Options */}
          <Section label="Options">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className={labelCls}>Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {Object.entries(tags).map(([k, v]) => (
                    <span key={k} className="flex items-center gap-1 text-[9px] font-mono bg-[#6B7280]/10 border border-[#6B7280]/20 text-[#9CA3AF] px-2 py-0.5 rounded-lg">
                      {k}: {v}
                      <button onClick={() => { const t = { ...tags }; delete t[k]; setTags(t) }} className="hover:text-red-400 cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagKey} onChange={(e) => setTagKey(e.target.value)} placeholder="key" className={`${inputCls} flex-1`} />
                  <input value={tagVal} onChange={(e) => setTagVal(e.target.value)} placeholder="value" className={`${inputCls} flex-1`} />
                  <button onClick={() => { if (tagKey && tagVal) { setTags({ ...tags, [tagKey]: tagVal }); setTagKey(""); setTagVal("") } }} className="px-3 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-[#B0B8C8] hover:text-white transition-all cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelCls}>Idempotency Key (optional)</label>
                <input value={idempotencyKey} onChange={(e) => setIdempotencyKey(e.target.value)} placeholder="e.g. signup-user-123" className={inputCls} />
              </div>
            </div>
          </Section>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1C202C] shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">Cancel</button>
          <button onClick={handleSend} className="px-4 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer">Send</button>
        </div>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-white/80 tracking-tight border-b border-[#1C202C] pb-1.5">{label}</p>
      {children}
    </div>
  )
}

function SelectWrap({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white/90 cursor-pointer focus:outline-none transition-colors">
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#7A8499] pointer-events-none" />
    </div>
  )
}

const inputCls = "w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white placeholder-[#7A8499] focus:outline-none transition-colors"
const labelCls = "text-[9px] font-mono font-semibold text-[#7A8499] uppercase tracking-wider"
