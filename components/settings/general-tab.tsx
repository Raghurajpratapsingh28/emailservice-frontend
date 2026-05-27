"use client"

import { useState } from "react"
import { Plus, X, ChevronDown, Save } from "lucide-react"
import { workspaceService, type WorkspaceSettings } from "@/lib/workspace-service"

const TIMEZONES = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Tokyo"]
const LOCALES = ["en-US", "es-ES", "fr-FR", "de-DE", "ja-JP"]
const WEBHOOK_EVENTS = ["campaign.sent", "contact.created", "contact.updated", "segment.updated"]

export default function GeneralTab({ settings, workspaceId, onUpdate }: { settings: WorkspaceSettings; workspaceId: string; onUpdate: () => void }) {
  const [timezone, setTimezone] = useState(settings.timezone)
  const [locale, setLocale] = useState(settings.locale)
  const [logoUrl, setLogoUrl] = useState(settings.branding.logoUrl || "")
  const [primaryColor, setPrimaryColor] = useState(settings.branding.primaryColor || "#000000")
  const [fromName, setFromName] = useState(settings.emailDefaults.fromName || "")
  const [fromEmail, setFromEmail] = useState(settings.emailDefaults.fromEmail || "")
  const [replyTo, setReplyTo] = useState(settings.emailDefaults.replyTo || "")
  const [webhookUrl, setWebhookUrl] = useState(settings.webhookSettings.url || "")
  const [webhookSecret, setWebhookSecret] = useState(settings.webhookSettings.secret || "")
  const [webhookEvents, setWebhookEvents] = useState<string[]>(settings.webhookSettings.events || [])
  const [isLoading, setIsLoading] = useState(false)

  const toggleEvent = (ev: string) => {
    setWebhookEvents(prev => prev.includes(ev) ? prev.filter(e => e !== ev) : [...prev, ev])
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await workspaceService.updateSettings(workspaceId, {
        timezone,
        locale,
        branding: { logoUrl, primaryColor },
        emailDefaults: { fromName, fromEmail, replyTo },
        webhookSettings: { url: webhookUrl, secret: webhookSecret, events: webhookEvents },
      })
      onUpdate()
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <Section title="Workspace Settings">
        <Field label="Timezone">
          <Sel value={timezone} onChange={setTimezone}>
            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </Sel>
        </Field>
        <Field label="Locale">
          <Sel value={locale} onChange={setLocale}>
            {LOCALES.map(l => <option key={l} value={l}>{l}</option>)}
          </Sel>
        </Field>
      </Section>

      <Section title="Branding">
        <Field label="Logo URL">
          <input type="url" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." className={inputCls} />
        </Field>
        <Field label="Primary Color">
          <div className="flex items-center gap-3">
            <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-xl border border-[#1E2230] bg-[#08090C] cursor-pointer p-1" />
            <input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className={`${inputCls} w-32 font-mono`} />
          </div>
        </Field>
      </Section>

      <Section title="Email Defaults">
        <Field label="From Name">
          <input value={fromName} onChange={e => setFromName(e.target.value)} className={inputCls} />
        </Field>
        <Field label="From Email">
          <input type="email" value={fromEmail} onChange={e => setFromEmail(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Reply To">
          <input type="email" value={replyTo} onChange={e => setReplyTo(e.target.value)} placeholder="support@company.com" className={inputCls} />
        </Field>
      </Section>

      <Section title="Webhook Settings">
        <Field label="Webhook URL">
          <input type="url" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://hooks.example.com/..." className={inputCls} />
        </Field>
        <Field label="Webhook Secret">
          <input type="password" value={webhookSecret} onChange={e => setWebhookSecret(e.target.value)} placeholder="Min 16 characters" className={`${inputCls} font-mono`} />
        </Field>
        <Field label="Events">
          <div className="flex flex-wrap gap-2">
            {WEBHOOK_EVENTS.map(ev => (
              <button key={ev} onClick={() => toggleEvent(ev)} className={`text-[9px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${webhookEvents.includes(ev) ? "bg-[#6B7280]/10 border-[#6B7280]/40 text-[#9CA3AF]" : "bg-[#08090C] border-[#1E2230] text-[#7A8499] hover:border-[#383E58] hover:text-[#B0B8C8]"}`}>
                {ev}
              </button>
            ))}
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

function Sel({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white/90 cursor-pointer focus:outline-none transition-colors">
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#7A8499] pointer-events-none" />
    </div>
  )
}

const inputCls = "w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white placeholder-[#7A8499] focus:outline-none transition-colors"
