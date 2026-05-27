"use client"

import { useState } from "react"
import { validateDomain, normalizeDomain } from "@/lib/domains-data"
import { X, Globe } from "lucide-react"

interface Props {
  isOpen: boolean
  onClose: () => void
  existingDomains: string[]
  onAdd: (domain: string) => void
}

export default function AddDomainModal({ isOpen, onClose, existingDomains, onAdd }: Props) {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = normalizeDomain(value)
    const validationError = validateDomain(normalized)
    if (validationError) { setError(validationError); return }
    if (existingDomains.includes(normalized)) { setError("This domain is already added."); return }
    onAdd(normalized)
    setValue("")
    setError("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0F1016] border border-[#1C202C] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C202C]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#3CD3AD]/10 border border-[#3CD3AD]/25">
              <Globe className="w-4 h-4 text-[#3CD3AD]" />
            </div>
            <div>
              <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Sending Domain</span>
              <h2 className="text-sm font-bold text-white mt-0.5">Add Domain</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#1C1F2D] text-[#7A8499] hover:text-white transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/80 tracking-tight">
                Domain <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => { setValue(e.target.value); setError("") }}
                placeholder="acme.com"
                autoFocus
                className="w-full px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#3CD3AD] rounded-xl text-sm text-white font-mono placeholder-[#7A8499] focus:outline-none transition-colors"
              />
              {error && <p className="text-[10px] text-red-400 font-mono">{error}</p>}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#08090C] border border-[#1E2230] space-y-1.5 text-[10px] text-[#7A8499] font-mono">
              <p className="text-[#B0B8C8] font-semibold mb-2">Rules:</p>
              <p>• Lowercase, at least one dot</p>
              <p>• No localhost, IPs, or reserved TLDs</p>
              <p>• Leading www. is stripped automatically</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1C202C]">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#3CD3AD] to-teal-500 hover:from-teal-400 hover:to-teal-600 text-[#060709] font-bold rounded-xl text-xs shadow-lg shadow-[#3CD3AD]/15 transition-all cursor-pointer">
              Add Domain
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
