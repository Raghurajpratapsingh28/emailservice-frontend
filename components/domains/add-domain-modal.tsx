"use client"

import { useState } from "react"
import { X, Globe, Loader2 } from "lucide-react"
import { domainsService, type ApiDomain } from "@/lib/domains-service"
import DnsRecordsTable from "./dns-records-table"

interface Props {
  isOpen: boolean
  onClose: () => void
  workspaceId: string
  onAdded: (domain: ApiDomain) => void
}

export default function AddDomainModal({ isOpen, onClose, workspaceId, onAdded }: Props) {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [created, setCreated] = useState<ApiDomain | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const domain = value.trim().toLowerCase().replace(/^www\./, "")
    if (!domain) { setError("Domain is required."); return }
    setIsLoading(true)
    try {
      const d = await domainsService.add(workspaceId, domain)
      setCreated(d)
    } catch (err: any) {
      setError(err.message || "Failed to add domain.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDone = () => {
    if (created) onAdded(created)
    setValue(""); setError(""); setCreated(null); onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!created ? onClose : undefined} />
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#3CD3AD]/10 border border-[#3CD3AD]/25">
              <Globe className="w-4 h-4 text-[#3CD3AD]" />
            </div>
            <div>
              <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Sending Domain</span>
              <h2 className="text-sm font-bold text-white mt-0.5">{created ? `${created.domain} — Publish DNS Records` : "Add Domain"}</h2>
            </div>
          </div>
          {!created && <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer"><X className="w-4 h-4" /></button>}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!created ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80 tracking-tight">Domain <span className="text-red-400">*</span></label>
                <input type="text" value={value} onChange={(e) => { setValue(e.target.value); setError("") }} placeholder="acme.com" autoFocus className="w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#3CD3AD] rounded-xl text-sm text-white font-mono placeholder-[#7A8499] focus:outline-none transition-colors" />
                {error && <p className="text-[10px] text-red-400 font-mono">{error}</p>}
              </div>
              <div className="p-3.5 rounded-2xl bg-[#08090C] border border-[#1E2230] space-y-1 text-[10px] text-[#7A8499] font-mono">
                <p className="text-[#B0B8C8] font-semibold mb-1.5">Rules:</p>
                <p>• Lowercase, at least one dot (e.g. acme.com)</p>
                <p>• No localhost, IPs, or reserved TLDs (.test, .local)</p>
                <p>• Leading www. is stripped automatically</p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#3CD3AD] to-teal-500 hover:from-teal-400 hover:to-teal-600 disabled:opacity-50 text-[#060709] font-bold rounded-xl text-xs shadow-lg shadow-[#3CD3AD]/15 transition-all cursor-pointer">
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Add Domain
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-400 leading-relaxed">
                Domain <span className="font-mono font-bold">{created.domain}</span> has been added. Publish the DNS records below in your DNS provider, then verification will begin automatically. It may take up to 72 hours.
              </div>
              <DnsRecordsTable dns={created.dns} />
            </div>
          )}
        </div>

        {created && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1C202C] shrink-0">
            <button onClick={handleDone} className="px-4 py-2 bg-gradient-to-r from-[#3CD3AD] to-teal-500 hover:from-teal-400 hover:to-teal-600 text-[#060709] font-bold rounded-xl text-xs shadow-lg shadow-[#3CD3AD]/15 transition-all cursor-pointer">
              View Domain Details →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
