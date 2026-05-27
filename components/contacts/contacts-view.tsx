"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Upload } from "lucide-react"
import ContactFilters from "./contact-filters"
import ContactTable from "./contact-table"
import ContactDrawer from "./contact-drawer"
import BulkImport from "./bulk-import"
import { contactsService, type Contact } from "@/lib/contacts-service"
import { useAuth } from "@/lib/auth-context"

export default function ContactsView() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [workspaceId, setWorkspaceId] = useState<string>("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [searchQuery, setSearchQuery] = useState("")
  const [lifecycleStage, setLifecycleStage] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showSuppressed, setShowSuppressed] = useState(false)
  const [showUnsubscribed, setShowUnsubscribed] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<"view" | "create" | "edit">("view")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isImportOpen, setIsImportOpen] = useState(false)

  useEffect(() => {
    if (user?.workspaces?.[0]) {
      const wsId = user.workspaces[0].id
      setWorkspaceId(wsId)
      loadContacts(wsId)
    }
  }, [user, page, searchQuery, lifecycleStage, selectedTags, showSuppressed, showUnsubscribed, dateFrom, dateTo])

  const loadContacts = async (wsId: string) => {
    setIsLoading(true)
    console.log("Loading contacts for workspace:", wsId)
    try {
      const res = await contactsService.getContacts(wsId, {
        page,
        pageSize: 50,
        search: searchQuery || undefined,
        lifecycleStage: lifecycleStage !== "all" ? lifecycleStage : undefined,
        tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
        emailSuppressed: showSuppressed || undefined,
        unsubscribed: showUnsubscribed || undefined,
        fromDate: dateFrom || undefined,
        toDate: dateTo || undefined,
      })
      console.log("Contacts loaded:", res)
      setContacts(res.items)
      setTotal(res.total)
    } catch (error) {
      console.error("Failed to load contacts:", error)
      setContacts([])
    } finally {
      setIsLoading(false)
    }
  }

  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>()
    contacts.forEach(c => c.tags.forEach(t => tagsSet.add(t)))
    return Array.from(tagsSet).slice(0, 8)
  }, [contacts])

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const handleOpenDrawer = (mode: "view" | "create" | "edit", contact: Contact | null) => {
    setDrawerMode(mode)
    setSelectedContact(contact)
    setIsDrawerOpen(true)
  }

  const handleSaveContact = async (formData: Partial<Contact>) => {
    try {
      if (drawerMode === "create") {
        await contactsService.createContact(workspaceId, formData)
      } else if (drawerMode === "edit" && selectedContact) {
        await contactsService.updateContact(workspaceId, selectedContact.id, formData)
      }
      setIsDrawerOpen(false)
      loadContacts(workspaceId)
    } catch (error) {
      console.error("Failed to save contact:", error)
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm("Delete this contact?")) return
    try {
      await contactsService.deleteContact(workspaceId, contactId)
      loadContacts(workspaceId)
    } catch (error) {
      console.error("Failed to delete contact:", error)
    }
  }

  const handleBulkImport = async (importedContacts: Partial<Contact>[]) => {
    try {
      const res = await contactsService.bulkImport(workspaceId, importedContacts)
      alert(`Imported ${res.imported} contacts, skipped ${res.skipped}`)
      setIsImportOpen(false)
      loadContacts(workspaceId)
    } catch (error) {
      console.error("Failed to import contacts:", error)
    }
  }

  const handleSuppress = async (contactId: string) => {
    try {
      await contactsService.suppressContact(workspaceId, contactId)
      loadContacts(workspaceId)
    } catch (error) {
      console.error("Failed to suppress contact:", error)
    }
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1400px] mx-auto select-none">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Contact Management</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white/95 mt-1">Contacts</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsImportOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Import
          </button>
          <button onClick={() => handleOpenDrawer("create", null)} className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add Contact
          </button>
        </div>
      </div>

      <ContactFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        lifecycleStage={lifecycleStage}
        setLifecycleStage={setLifecycleStage}
        selectedTags={selectedTags}
        availableTags={availableTags}
        onToggleTag={handleToggleTag}
        showSuppressed={showSuppressed}
        setShowSuppressed={setShowSuppressed}
        showUnsubscribed={showUnsubscribed}
        setShowUnsubscribed={setShowUnsubscribed}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />

      <ContactTable contacts={contacts} onView={(c) => handleOpenDrawer("view", c)} onEdit={(c) => handleOpenDrawer("edit", c)} onDelete={(id) => handleDeleteContact(id)} onToggleSuppress={(id) => handleSuppress(id)} />

      <ContactDrawer isOpen={isDrawerOpen} mode={drawerMode} contact={selectedContact} onClose={() => setIsDrawerOpen(false)} onSave={handleSaveContact} />

      <BulkImport isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} onImport={handleBulkImport} />
    </motion.div>
  )
}
