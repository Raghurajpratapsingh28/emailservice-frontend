"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, CheckCircle2, ChevronRight, FileText, Loader2, AlertCircle, Copy, Check } from "lucide-react"
import { contactsService } from "@/lib/contacts-service"

interface BulkImportProps {
  isOpen: boolean
  workspaceId: string
  onClose: () => void
  onImportComplete: (importedCount: number, skippedCount: number) => void
}

const CSV_FORMAT = `email,first_name,last_name,phone,lifecycle_stage,lead_score
john@example.com,John,Doe,+1234567890,lead,0
jane@example.com,Jane,Smith,,customer,80
bob@example.com,Bob,,,subscriber,`

const REQUIRED_HEADER = "email"
const OPTIONAL_HEADERS = ["first_name", "last_name", "phone", "lifecycle_stage", "lead_score"]
const LIFECYCLE_VALUES = ["lead", "subscriber", "customer", "churned"]

function parseCSV(text: string): { rows: Record<string, string>[]; errors: string[] } {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return { rows: [], errors: ["CSV must have a header row and at least one data row."] }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"))
  if (!headers.includes(REQUIRED_HEADER)) {
    return { rows: [], errors: [`Missing required column: "email". Found: ${headers.join(", ")}`] }
  }

  const rows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => { row[h] = vals[idx] ?? "" })
    if (row.email) rows.push(row)
  }

  return { rows, errors: [] }
}

export default function BulkImport({ isOpen, workspaceId, onClose, onImportComplete }: BulkImportProps) {
  const [step, setStep] = useState<"upload" | "preview" | "loading" | "result">("upload")
  const [fileName, setFileName] = useState("")
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([])
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [importResult, setImportResult] = useState({ imported: 0, skipped: 0 })
  const [importError, setImportError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) {
      setParseErrors(["Only CSV files are supported."])
      return
    }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const { rows, errors } = parseCSV(text)
      setParseErrors(errors)
      setParsedRows(rows)
      if (errors.length === 0 && rows.length > 0) setStep("preview")
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleImport = async () => {
    setStep("loading")
    setImportError("")
    try {
      const contacts = parsedRows.map((row) => ({
        email: row.email,
        firstName: row.first_name || undefined,
        lastName: row.last_name || undefined,
        phone: row.phone || undefined,
        lifecycleStage: LIFECYCLE_VALUES.includes(row.lifecycle_stage) ? row.lifecycle_stage : undefined,
        leadScore: row.lead_score ? Number(row.lead_score) || 0 : undefined,
      }))
      const res = await contactsService.bulkImport(workspaceId, contacts)
      setImportResult(res)
      setStep("result")
    } catch (err: any) {
      setImportError(err.message || "Import failed")
      setStep("preview")
    }
  }

  const handleFinish = () => {
    onImportComplete(importResult.imported, importResult.skipped)
    onClose()
    setStep("upload")
    setFileName("")
    setParsedRows([])
    setParseErrors([])
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(CSV_FORMAT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const reset = () => {
    setStep("upload")
    setFileName("")
    setParsedRows([])
    setParseErrors([])
    setImportError("")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="fixed inset-0 m-auto w-full max-w-lg h-fit max-h-[90vh] rounded-3xl bg-[#090A0E] border border-[#1C202C] text-white z-50 flex flex-col font-sans overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#1C202C] bg-[#0B0C10]/40 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-widest">CSV Bulk Importer</span>
                <h3 className="text-sm font-semibold text-white mt-1">Import Contacts</h3>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-[#1E2230] border border-[#1E2230]/20 rounded-lg text-[#B0B8C8] hover:text-white transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {step === "upload" && (
                <>
                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
                    className="border-2 border-dashed border-[#1E2230] hover:border-[#6B7280]/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[#0B0C10]/10 hover:bg-[#0B0C10]/35 transition-all relative group"
                  >
                    <input type="file" accept=".csv" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="p-3.5 rounded-2xl bg-[#6B7280]/10 border border-[#6B7280]/25 text-[#9CA3AF] group-hover:scale-105 transition-transform mb-4">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h4 className="text-xs font-semibold text-white">Drag & drop your CSV here</h4>
                    <p className="text-[10px] text-[#7A8499] font-mono mt-1.5">CSV only · Max 1,000 rows</p>
                    <button className="mt-4 px-3 py-1.5 bg-[#12141A] border border-[#1E2230] text-[10px] text-[#B0B8C8] font-semibold rounded-lg pointer-events-none">
                      Select File
                    </button>
                  </div>

                  {parseErrors.length > 0 && (
                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-red-400 font-mono">{parseErrors[0]}</p>
                    </div>
                  )}

                  {/* CSV Format Guide */}
                  <div className="rounded-2xl bg-[#0F1016] border border-[#1C202C] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#1C202C]">
                      <span className="text-[10px] font-mono font-semibold text-[#7A8499] uppercase tracking-wider">Expected CSV Format</span>
                      <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] font-mono text-[#6B7280] hover:text-white transition-colors cursor-pointer">
                        {copied ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></> : <><Copy className="w-3 h-3" />Copy</>}
                      </button>
                    </div>
                    <pre className="p-4 text-[10px] font-mono text-[#9CA3AF] overflow-x-auto leading-relaxed">{CSV_FORMAT}</pre>
                    <div className="px-4 py-3 border-t border-[#1C202C] space-y-2">
                      <p className="text-[10px] font-mono text-[#7A8499] uppercase tracking-wider mb-2">Column Reference</p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded">required</span>
                          <span className="text-[10px] font-mono text-white/80">email</span>
                        </div>
                        {OPTIONAL_HEADERS.map((h) => (
                          <div key={h} className="flex items-center gap-2">
                            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#6B7280]/10 border border-[#6B7280]/20 text-[#9CA3AF] rounded">optional</span>
                            <span className="text-[10px] font-mono text-[#B0B8C8]">{h}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-[#6B7280] font-mono mt-2">
                        <span className="text-white/60">lifecycle_stage</span> values: {LIFECYCLE_VALUES.join(", ")}
                      </p>
                      <p className="text-[10px] text-[#6B7280] font-mono">
                        Duplicate emails are automatically skipped.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {step === "preview" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 bg-[#0F1016] p-3 rounded-xl border border-[#1C202C]">
                    <FileText className="w-4 h-4 text-[#FE8A5C] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">{fileName}</p>
                      <p className="text-[9px] text-[#7A8499] font-mono mt-0.5">{parsedRows.length} rows ready to import</p>
                    </div>
                  </div>

                  {importError && (
                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-red-400 font-mono">{importError}</p>
                    </div>
                  )}

                  {/* Preview table */}
                  <div className="rounded-2xl border border-[#1C202C] overflow-hidden">
                    <div className="overflow-x-auto max-h-48">
                      <table className="w-full text-[10px]">
                        <thead>
                          <tr className="border-b border-[#1C202C] bg-[#0F1016]">
                            {["email", "first_name", "last_name", "phone", "lifecycle_stage"].map((h) => (
                              <th key={h} className="px-3 py-2 text-left font-mono font-semibold text-[#7A8499] whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1C202C]/60">
                          {parsedRows.slice(0, 5).map((row, i) => (
                            <tr key={i} className="hover:bg-[#111319]">
                              <td className="px-3 py-2 font-mono text-[#9CA3AF]">{row.email}</td>
                              <td className="px-3 py-2 text-white/70">{row.first_name || "—"}</td>
                              <td className="px-3 py-2 text-white/70">{row.last_name || "—"}</td>
                              <td className="px-3 py-2 font-mono text-white/70">{row.phone || "—"}</td>
                              <td className="px-3 py-2 font-mono text-white/70">{row.lifecycle_stage || "lead"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {parsedRows.length > 5 && (
                      <div className="px-3 py-2 border-t border-[#1C202C] text-[9px] font-mono text-[#6B7280]">
                        +{parsedRows.length - 5} more rows not shown
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === "loading" && (
                <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Importing {parsedRows.length} contacts...</h4>
                    <p className="text-[9px] text-[#7A8499] font-mono mt-1">Deduplicating and validating rows</p>
                  </div>
                </div>
              )}

              {step === "result" && (
                <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">Import Complete</h4>
                    <p className="text-xs text-[#B0B8C8] mt-1.5 leading-relaxed">
                      Imported <span className="text-emerald-400 font-bold font-mono">{importResult.imported}</span> contacts,
                      skipped <span className="text-[#FE8A5C] font-bold font-mono">{importResult.skipped}</span> duplicates.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-[#1C202C] bg-[#0B0C10]/40 flex gap-3 shrink-0">
              {step === "upload" && (
                <button onClick={onClose} className="w-full py-2.5 bg-transparent border border-[#232737] hover:border-[#3E4562] text-xs font-semibold text-[#B0B8C8] hover:text-white rounded-xl transition-all cursor-pointer">
                  Cancel
                </button>
              )}
              {step === "preview" && (
                <>
                  <button onClick={reset} className="flex-1 py-2 bg-transparent border border-[#232737] hover:border-[#3E4562] text-xs font-semibold text-[#B0B8C8] hover:text-white rounded-xl transition-all cursor-pointer">
                    Back
                  </button>
                  <button onClick={handleImport} className="flex-1 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-xs font-semibold text-white rounded-xl shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer flex items-center justify-center gap-1.5">
                    Import {parsedRows.length} Contacts <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              {step === "result" && (
                <button onClick={handleFinish} className="w-full py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] text-xs font-semibold text-white rounded-xl transition-colors cursor-pointer">
                  Close & View Contacts
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
