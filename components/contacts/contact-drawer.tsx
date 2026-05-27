"use client"

import { Contact } from "@/lib/contacts-data"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShieldAlert, Edit, Trash2, ShieldCheck, Plus, Sparkles } from "lucide-react"

interface ContactDrawerProps {
  isOpen: boolean
  onClose: () => void
  mode: "view" | "create" | "edit"
  contact: Contact | null
  onSave: (contact: Partial<Contact>) => void
  onDelete?: (contact: Contact) => void
  onToggleSuppress?: (contact: Contact) => void
}

export default function ContactDrawer({
  isOpen,
  onClose,
  mode,
  contact,
  onSave,
  onDelete,
  onToggleSuppress
}: ContactDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "tags">("overview")

  // Form State
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [lifecycleStage, setLifecycleStage] = useState<Contact["lifecycleStage"]>("lead")
  const [leadScore, setLeadScore] = useState(50)
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [sourceChannel, setSourceChannel] = useState("Direct Signup")

  // Custom properties key-value state
  const [customProps, setCustomProps] = useState<Array<{ key: string; value: any }>>([])

  // Load contact data when entering edit or view mode
  useEffect(() => {
    if (contact && (mode === "edit" || mode === "view")) {
      setEmail(contact.email)
      setFirstName(contact.firstName)
      setLastName(contact.lastName)
      setPhone(contact.phone || "")
      setLifecycleStage(contact.lifecycleStage as any)
      setLeadScore(contact.leadScore)
      setTags(contact.tags)
      setSourceChannel(contact.source?.channel || "")
      setCustomProps(
        Object.entries(contact.properties || {}).map(([k, v]) => ({
          key: k,
          value: typeof v === "object" ? JSON.stringify(v) : v
        }))
      )
    } else if (mode === "create") {
      setEmail("")
      setFirstName("")
      setLastName("")
      setPhone("")
      setLifecycleStage("lead")
      setLeadScore(50)
      setTags([])
      setSourceChannel("Direct Ingest")
      setCustomProps([{ key: "company", value: "Acme Inc" }])
    }
  }, [contact, mode, isOpen])

  const handleAddPropRow = () => {
    setCustomProps([...customProps, { key: "", value: "" }])
  }

  const handleRemovePropRow = (idx: number) => {
    setCustomProps(customProps.filter((_, i) => i !== idx))
  }

  const handlePropChange = (idx: number, field: "key" | "value", val: string) => {
    const updated = [...customProps]
    updated[idx][field] = val
    setCustomProps(updated)
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const propertiesObj: Record<string, any> = {}
    customProps.forEach((item) => {
      if (item.key.trim()) {
        let val = item.value
        if (val === "true") val = true
        else if (val === "false") val = false
        else if (!isNaN(Number(val)) && val.trim() !== "") val = Number(val)
        propertiesObj[item.key.trim()] = val
      }
    })

    onSave({
      email,
      firstName,
      lastName,
      phone,
      lifecycleStage,
      leadScore,
      tags,
      source: { channel: sourceChannel },
      properties: propertiesObj
    })
    onClose()
  }

  // Generate initials for avatar
  const getInitials = () => {
    if (!firstName && !lastName) return "U"
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Sliding sheet container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#090A0E] border-l border-[#1C202C] text-white z-50 flex flex-col justify-between font-sans overflow-hidden"
          >
            {/* 1. Header block */}
            <div className="p-6 border-b border-[#1C202C] flex items-center justify-between bg-[#0B0C10]/40">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-widest leading-none">
                  CRM Inspector
                </span>
                <span className="bg-[#1E2230] text-[#B0B8C8] text-[9px] font-mono px-2 py-0.5 rounded uppercase font-semibold">
                  {mode} Mode
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-[#1E2230] border border-[#1E2230]/20 rounded-lg text-[#B0B8C8] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {mode === "view" && contact && (
                /* INSPECTOR DETAIL VIEW */
                <div className="space-y-6">
                  {/* Profile banner */}
                  <div className="flex items-center gap-4 bg-[#0F1016] p-5 rounded-2xl border border-[#1C202C]/80">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6B7280] to-[#6B7280] flex items-center justify-center font-bold text-lg tracking-tight select-none shadow-md shadow-[#6B7280]/10">
                      {getInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white/95 leading-snug truncate">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-xs text-[#B0B8C8] font-mono truncate leading-none mt-1">{contact.email}</p>
                      <div className="flex items-center gap-2 mt-2.5">
                        <span className="bg-zinc-500/10 border border-zinc-500/25 text-[#9CA3AF] text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full capitalize">
                          {contact.lifecycleStage}
                        </span>
                        <span className="bg-[#12141C] border border-[#1E2230] text-[#7A8499] text-[9px] font-mono px-2 py-0.5 rounded">
                          Score: {contact.leadScore}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Inspector Quick actions */}
                  <div className="flex gap-2">
                    {onToggleSuppress && (
                      <button
                        onClick={() => onToggleSuppress(contact)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                          contact.suppressed
                            ? "bg-[#3CD3AD]/10 border-[#3CD3AD]/25 text-[#3CD3AD] hover:bg-[#3CD3AD]/20"
                            : "bg-[#FE5C5C]/10 border-[#FE5C5C]/25 text-[#FE5C5C] hover:bg-[#FE5C5C]/20"
                        }`}
                      >
                        {contact.suppressed ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Unsuppress Profile</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Suppress Profile</span>
                          </>
                        )}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete(contact)
                          onClose()
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#FE5C5C]/5 border border-[#FE5C5C]/15 hover:bg-[#FE5C5C]/15 text-xs font-semibold text-[#FE5C5C] py-2 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Contact</span>
                      </button>
                    )}
                  </div>

                  {/* Tabs Section selectors */}
                  <div className="border-b border-[#1C202C]/60 flex gap-4 text-xs font-semibold">
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "properties", label: "Custom Details" },
                      { id: "tags", label: "Tag Chips" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-2.5 relative transition-colors duration-300 cursor-pointer ${
                          activeTab === tab.id ? "text-[#6B7280]" : "text-[#B0B8C8] hover:text-white"
                        }`}
                      >
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                          <motion.div layoutId="tab-glow-bar" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6B7280]" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Tab Contents */}
                  <div className="pt-2">
                    {activeTab === "overview" && (
                      <div className="space-y-4 text-xs">
                        {[
                          { label: "Phone Connection", val: contact.phone || "—", mono: true },
                          { label: "Traffic Source", val: contact.sourceChannel, mono: false },
                          { label: "Profile Created", val: new Date(contact.createdAt).toLocaleString(), mono: true },
                          { label: "Database ID", val: contact.id, mono: true }
                        ].map((row) => (
                          <div key={row.label} className="flex justify-between py-2 border-b border-[#1C202C]/40">
                            <span className="text-[#7A8499]">{row.label}</span>
                            <span className={`font-semibold ${row.mono ? "font-mono text-white/80" : "text-white/95"}`}>{row.val}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "properties" && (
                      <div className="space-y-3.5">
                        {Object.entries(contact.customProperties).length === 0 ? (
                          <p className="text-xs text-[#7A8499] font-mono italic">No custom JSON fields registered.</p>
                        ) : (
                          Object.entries(contact.customProperties).map(([k, v]) => (
                            <div key={k} className="p-3 bg-[#08090C] border border-[#161922] rounded-xl flex items-center justify-between">
                              <span className="text-xs font-mono font-semibold text-[#B0B8C8]">{k}</span>
                              <span className="text-xs font-mono text-white/90">
                                {typeof v === "object" ? JSON.stringify(v) : String(v)}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeTab === "tags" && (
                      <div className="flex flex-wrap gap-1.5">
                        {contact.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-0.5 bg-[#12141B] border border-[#1E2230] text-[#9CA3AF] text-[10px] font-mono rounded-full font-semibold">
                            {tag}
                          </span>
                        ))}
                        {contact.tags.length === 0 && (
                          <p className="text-xs text-[#7A8499] font-mono italic">No tags attached to this profile.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {mode !== "view" && (
                /* CREATE / EDIT FORM VIEW */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email (Required) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#B0B8C8] uppercase tracking-wider">Email address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@company.com"
                      className="w-full px-4 py-2.5 bg-[#08090C] border border-[#1E2230] focus:border-[#6B7280]/50 rounded-xl text-xs placeholder-[#7A8499] focus:outline-none"
                    />
                  </div>

                  {/* First & Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#B0B8C8] uppercase tracking-wider">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Amélie"
                        className="w-full px-4 py-2.5 bg-[#08090C] border border-[#1E2230] focus:border-[#6B7280]/50 rounded-xl text-xs placeholder-[#7A8499] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#B0B8C8] uppercase tracking-wider">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Laurent"
                        className="w-full px-4 py-2.5 bg-[#08090C] border border-[#1E2230] focus:border-[#6B7280]/50 rounded-xl text-xs placeholder-[#7A8499] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone Connection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#B0B8C8] uppercase tracking-wider">Phone number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-4 py-2.5 bg-[#08090C] border border-[#1E2230] focus:border-[#6B7280]/50 rounded-xl text-xs placeholder-[#7A8499] focus:outline-none font-mono"
                    />
                  </div>

                  {/* Lifecycle Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#B0B8C8] uppercase tracking-wider">Lifecycle Stage</label>
                    <div className="relative">
                      <select
                        value={lifecycleStage}
                        onChange={(e) => setLifecycleStage(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-[#08090C] border border-[#1E2230] focus:border-[#6B7280]/50 rounded-xl text-xs focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="lead">Lead</option>
                        <option value="prospect">Prospect</option>
                        <option value="customer">Customer</option>
                        <option value="churned">Churned</option>
                        <option value="unqualified">Unqualified</option>
                      </select>
                      <X className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#7A8499]" />
                    </div>
                  </div>

                  {/* Lead Score Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <label className="text-xs font-semibold text-[#B0B8C8] uppercase tracking-wider">Lead Score</label>
                      <span className="text-xs font-mono font-bold text-[#9CA3AF]">{leadScore} / 100</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={leadScore}
                        onChange={(e) => setLeadScore(Number(e.target.value))}
                        className="w-full accent-[#6B7280] h-1 bg-[#1E2230] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Creatable Tags Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#B0B8C8] uppercase tracking-wider">Tags (Press Enter to add)</label>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Add tag and hit Enter..."
                      className="w-full px-4 py-2.5 bg-[#08090C] border border-[#1E2230] focus:border-[#6B7280]/50 rounded-xl text-xs placeholder-[#7A8499] focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-[#141620] border border-[#6B7280]/20 text-[#9CA3AF] text-[10px] font-mono rounded flex items-center gap-1.5"
                        >
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="hover:text-white transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Custom properties JSONB builder */}
                  <div className="space-y-2.5 pt-2 border-t border-[#1C202C]/60">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#B0B8C8] uppercase tracking-wider">Custom Properties (JSONB)</label>
                      <button
                        type="button"
                        onClick={handleAddPropRow}
                        className="text-[10px] font-semibold text-[#6B7280] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Property</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {customProps.map((prop, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Property Key"
                            value={prop.key}
                            onChange={(e) => handlePropChange(idx, "key", e.target.value)}
                            className="w-1/2 px-3 py-2 bg-[#08090C] border border-[#1E2230] rounded-xl text-xs font-mono placeholder-[#7A8499] focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Value (text, number, bool)"
                            value={prop.value}
                            onChange={(e) => handlePropChange(idx, "value", e.target.value)}
                            className="w-1/2 px-3 py-2 bg-[#08090C] border border-[#1E2230] rounded-xl text-xs font-mono placeholder-[#7A8499] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePropRow(idx)}
                            className="p-2 bg-transparent text-[#7A8499] hover:text-[#FE5C5C] transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Traffic source */}
                  <div className="space-y-1.5 pt-2 border-t border-[#1C202C]/60">
                    <label className="text-xs font-semibold text-[#B0B8C8] uppercase tracking-wider">Source Channel</label>
                    <input
                      type="text"
                      value={sourceChannel}
                      onChange={(e) => setSourceChannel(e.target.value)}
                      placeholder="e.g. Google Search, Direct Signup"
                      className="w-full px-4 py-2.5 bg-[#08090C] border border-[#1E2230] focus:border-[#6B7280]/50 rounded-xl text-xs placeholder-[#7A8499] focus:outline-none"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* 3. Footer row actions */}
            {mode !== "view" && (
              <div className="p-6 border-t border-[#1C202C] bg-[#0B0C10]/40 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-transparent border border-[#232737] hover:border-[#3E4562] text-xs font-semibold text-[#B0B8C8] hover:text-white rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-xs font-semibold text-white rounded-xl shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{mode === "create" ? "Create Profile" : "Save Changes"}</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
