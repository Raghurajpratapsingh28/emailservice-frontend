"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Upload, ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import ContactFilters from "./contact-filters"
import ContactTable from "./contact-table"
import ContactDrawer from "./contact-drawer"
import BulkImport from "./bulk-import"
import { contactsService } from "@/lib/contacts-service"
import type { Contact } from "@/lib/contacts-data"
import { useAuth } from "@/lib/auth-context"

interface Props {
  workspaceId?: string
}

export default function ContactsView({ workspaceId: propWorkspaceId }: Props) {
  const { user } = useAuth()
  const router = useRouter()
  const [workspaceId, setWorkspaceId] = useState<string>("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

  const loadContacts = useCallback(async (wsId: string) => {
    setIsLoading(true)
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
      setContacts(res.items as unknown as Contact[])
      setTotal(res.total)
    } catch (error) {
      console.error("Failed to load contacts:", error)
      setContacts([])
    } finally {
      setIsLoading(false)
    }
  }, [page, searchQuery, lifecycleStage, selectedTags, showSuppressed, showUnsubscribed, dateFrom, dateTo])

  useEffect(() => {
    if (propWorkspaceId) {
      setWorkspaceId(propWorkspaceId)
      loadContacts(propWorkspaceId)
    } else if (user?.workspaces?.[0]) {
      const wsId = user.workspaces[0].id
      setWorkspaceId(wsId)
      loadContacts(wsId)
    }
  }, [user, propWorkspaceId, loadContacts])

  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>()
    contacts.forEach(c => c.tags?.forEach(t => tagsSet.add(t)))
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

  const handleBulkImportComplete = (imported: number, skipped: number) => {
    alert(`Imported ${imported} contacts, skipped ${skipped}`)
    setIsImportOpen(false)
    loadContacts(workspaceId)
  }

  const handleSuppress = async (contactId: string) => {
    try {
      await contactsService.suppressContact(workspaceId, contactId)
      loadContacts(workspaceId)
    } catch (error) {
      console.error("Failed to suppress contact:", error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-[1400px] mx-auto select-none"
    >
      <div className="flex items-center justify-between">
        <div>
          {propWorkspaceId && (
            <button
              onClick={() => router.push("/contact")}
              className="flex items-center gap-1.5 text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-colors mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" /> All Workspaces
            </button>
          )}
          <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Contact Management</span>
          <div className="flex items-center gap-3 mt-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white/95 leading-none">Contacts</h1>
            <div className="flex items-baseline gap-1 bg-[#111319] border border-[#1E2230] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-[#6B7280]">
              <span>{total}</span>
              <span className="text-[9px] text-[#7A8499] font-normal uppercase">Total</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Import
          </button>
          <button
            onClick={() => handleOpenDrawer("create", null)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer"
          >
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
        toggleTag={handleToggleTag}
        showSuppressed={showSuppressed}
        setShowSuppressed={setShowSuppressed}
        showUnsubscribed={showUnsubscribed}
        setShowUnsubscribed={setShowUnsubscribed}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" />
        </div>
      ) : (
        <ContactTable
          contacts={contacts}
          onView={(c) => handleOpenDrawer("view", c)}
          onEdit={(c) => handleOpenDrawer("edit", c)}
          onDelete={(id) => handleDeleteContact(id)}
          onToggleSuppress={(id) => handleSuppress(id)}
        />
      )}

      {!isLoading && total > 0 && (
        <div className="flex items-center justify-between text-[10px] font-mono text-[#7A8499] px-1">
          <span>Showing {contacts.length} of {total} contacts</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 bg-[#12141A] border border-[#1E2230] rounded-lg disabled:opacity-40 hover:border-[#383E58] transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={contacts.length < 50}
              className="px-2.5 py-1 bg-[#12141A] border border-[#1E2230] rounded-lg disabled:opacity-40 hover:border-[#383E58] transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ContactDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        contact={selectedContact}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveContact}
      />

      <BulkImport
        isOpen={isImportOpen}
        workspaceId={workspaceId}
        onClose={() => setIsImportOpen(false)}
        onImportComplete={handleBulkImportComplete}
      />
    </motion.div>
  )
}
