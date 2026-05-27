"use client"

import { Contact } from "@/lib/contacts-data"
import { MoreHorizontal, ShieldAlert, MailX, Eye, Edit2, ShieldAlert as SuppressIcon, Trash2, ShieldCheck } from "lucide-react"
import { useState } from "react"

interface ContactTableProps {
  contacts: Contact[]
  onView: (contact: Contact) => void
  onEdit: (contact: Contact) => void
  onDelete: (contactId: string) => void
  onToggleSuppress: (contactId: string) => void
}

export default function ContactTable({
  contacts,
  onView,
  onEdit,
  onDelete,
  onToggleSuppress
}: ContactTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  // Pagination bounds calculations
  const totalItems = contacts.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedContacts = contacts.slice(startIndex, endIndex)

  const getStageStyle = (stage: string) => {
    switch (stage) {
      case "customer":
        return "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
      case "prospect":
        return "bg-zinc-500/10 border-zinc-500/25 text-zinc-400"
      case "lead":
        return "bg-blue-500/10 border-blue-500/25 text-blue-400"
      case "churned":
        return "bg-red-500/10 border-red-500/25 text-red-400"
      case "unqualified":
        return "bg-amber-500/10 border-amber-500/25 text-amber-400"
      default:
        return "bg-zinc-500/10 border-zinc-500/25 text-zinc-400"
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] overflow-hidden select-none font-sans text-white">
      {/* Table grid wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1C202C] bg-[#090A0E] text-[10px] text-[#7A8499] uppercase font-mono tracking-wider">
              <th className="p-4 pl-6">Email / Contact</th>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Stage</th>
              <th className="p-4">Lead Score</th>
              <th className="p-4">Tags</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C202C]/60 text-xs">
            {paginatedContacts.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-[#B0B8C8]">
                  No matching contacts found in database. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              paginatedContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-[#12141B] transition-colors duration-300">
                  {/* Email */}
                  <td className="p-4 pl-6 font-medium text-white/95">{contact.email}</td>

                  {/* Name */}
                  <td className="p-4 text-[#A7ABB3]">
                    {contact.firstName} {contact.lastName}
                  </td>

                  {/* Phone */}
                  <td className="p-4 font-mono text-[#7A8499]">{contact.phone || "—"}</td>

                  {/* Lifecycle Stage */}
                  <td className="p-4">
                    <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full capitalize ${getStageStyle(contact.lifecycleStage)}`}>
                      {contact.lifecycleStage}
                    </span>
                  </td>

                  {/* Lead Score */}
                  <td className="p-4 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-xs text-white/90 w-6">{contact.leadScore}</span>
                      <div className="h-1.5 bg-[#1C202D] rounded-full flex-1 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#6B7280] to-[#6B7280] rounded-full"
                          style={{ width: `${contact.leadScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Tags */}
                  <td className="p-4 max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.2 bg-[#12141B] border border-[#1E2230] text-[#B0B8C8] text-[9px] font-mono rounded">
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length === 0 && <span className="text-[#7A8499] font-mono">—</span>}
                    </div>
                  </td>

                  {/* Status Indicators */}
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      {contact.emailSuppressed && (
                        <div className="flex items-center gap-1 text-[#FE5C5C] text-[9px] font-mono bg-[#FE5C5C]/10 border border-[#FE5C5C]/25 px-1.5 py-0.2 rounded">
                          <ShieldAlert className="w-3 h-3 text-[#FE5C5C]" />
                          <span>SUPRESSED</span>
                        </div>
                      )}
                      {contact.unsubscribed && (
                        <div className="flex items-center gap-1 text-[#FE8A5C] text-[9px] font-mono bg-[#FE8A5C]/10 border border-[#FE8A5C]/25 px-1.5 py-0.2 rounded">
                          <MailX className="w-3 h-3 text-[#FE8A5C]" />
                          <span>UNSUB</span>
                        </div>
                      )}
                      {!contact.emailSuppressed && !contact.unsubscribed && (
                        <span className="text-[#3CD3AD] text-[9px] font-mono">Active</span>
                      )}
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="p-4 font-mono text-[#7A8499]">
                    {new Date(contact.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="p-4 pr-6 text-right relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === contact.id ? null : contact.id)}
                      className="p-1.5 hover:bg-[#1C1F2C] border border-transparent hover:border-[#1E2230] rounded-lg text-[#B0B8C8] hover:text-white cursor-pointer transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Popover Action Menu */}
                    {activeMenuId === contact.id && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                        <div className="absolute right-6 mt-1 w-44 rounded-2xl bg-[#090A0E] border border-[#1E222D] shadow-2xl p-1.5 z-40 text-left">
                          <button
                            onClick={() => {
                              onView(contact)
                              setActiveMenuId(null)
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#B0B8C8] hover:text-white hover:bg-[#12141B] rounded-xl cursor-pointer transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                          <button
                            onClick={() => {
                              onEdit(contact)
                              setActiveMenuId(null)
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#B0B8C8] hover:text-white hover:bg-[#12141B] rounded-xl cursor-pointer transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Contact</span>
                          </button>
                          <button
                            onClick={() => {
                              onToggleSuppress(contact.id)
                              setActiveMenuId(null)
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#B0B8C8] hover:text-white hover:bg-[#12141B] rounded-xl cursor-pointer transition-colors"
                          >
                            {contact.emailSuppressed ? (
                              <>
                                <ShieldCheck className="w-3.5 h-3.5 text-[#3CD3AD]" />
                                <span>Unsuppress</span>
                              </>
                            ) : (
                              <>
                                <SuppressIcon className="w-3.5 h-3.5 text-[#FE5C5C]" />
                                <span>Suppress</span>
                              </>
                            )}
                          </button>
                          <div className="h-[1px] bg-[#1E222D] my-1" />
                          <button
                            onClick={() => {
                              onDelete(contact.id)
                              setActiveMenuId(null)
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#FE5C5C] hover:bg-[#FE5C5C]/10 rounded-xl cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Contact</span>
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-[#090A0E] border-t border-[#1C202C] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-[#7A8499]">
        <div className="flex items-center gap-2">
          <span>Page size:</span>
          <div className="flex items-center bg-[#111319] border border-[#1E222D] rounded-lg px-2 py-0.5">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="bg-transparent text-[#B0B8C8] focus:outline-none cursor-pointer pr-3"
            >
              <option value={10} className="bg-[#090A0E]">10</option>
              <option value={20} className="bg-[#090A0E]">20</option>
              <option value={50} className="bg-[#090A0E]">50</option>
              <option value={100} className="bg-[#090A0E]">100</option>
              <option value={200} className="bg-[#090A0E]">200</option>
            </select>
          </div>
          <span className="ml-2">
            Showing {startIndex + 1} - {endIndex} of {totalItems} items
          </span>
        </div>

        {/* Page Navigators */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 bg-[#111319] hover:bg-[#1E222F] disabled:opacity-30 disabled:hover:bg-[#111319] border border-[#1E222D] rounded-lg text-[#B0B8C8] disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-2.5 py-1 rounded-lg text-xs border transition-colors cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-[#6B7280] border-[#6B7280] text-white"
                    : "bg-[#111319] hover:bg-[#1E222F] border-[#1E222D] text-[#B0B8C8]"
                }`}
              >
                {pageNum}
              </button>
            )
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 bg-[#111319] hover:bg-[#1E222F] disabled:opacity-30 disabled:hover:bg-[#111319] border border-[#1E222D] rounded-lg text-[#B0B8C8] disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
