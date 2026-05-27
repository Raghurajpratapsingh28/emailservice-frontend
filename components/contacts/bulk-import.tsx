"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, CheckCircle2, ChevronRight, FileText, Loader2 } from "lucide-react"

interface BulkImportProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete: (importedCount: number, skippedCount: number) => void
}

export default function BulkImport({ isOpen, onClose, onImportComplete }: BulkImportProps) {
  const [step, setStep] = useState<"upload" | "mapping" | "loading" | "result">("upload")
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState("")

  // Simulation mapping headers
  const [mappings, setMappings] = useState({
    email: "email_address",
    firstName: "first_name",
    lastName: "last_name",
    phone: "mobile_phone",
    lifecycleStage: "ignore",
    leadScore: "ignore",
  })

  const [importResult, setImportResult] = useState({ imported: 0, skipped: 0 })

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setFileName("subscribers_export_2026.csv")
    setFileSize("142 KB")
    setStep("mapping")
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name)
      const sizeKb = (e.target.files[0].size / 1024).toFixed(1)
      setFileSize(`${sizeKb} KB`)
      setStep("mapping")
    }
  }

  const handleStartImport = () => {
    setStep("loading")
    setTimeout(() => {
      // Simulate random imports between 150 and 800 rows
      const imported = Math.floor(180 + Math.random() * 400)
      const skipped = Math.floor(2 + Math.random() * 10)
      setImportResult({ imported, skipped })
      setStep("result")
    }, 1500)
  }

  const handleFinish = () => {
    onImportComplete(importResult.imported, importResult.skipped)
    onClose()
    setStep("upload")
    setFileName("")
  }

  const handleMappingChange = (field: keyof typeof mappings, val: string) => {
    setMappings({ ...mappings, [field]: val })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Modal Center panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="fixed inset-0 m-auto w-full max-w-lg h-[460px] rounded-3xl bg-[#090A0E] border border-[#1C202C] text-white z-50 flex flex-col justify-between font-sans overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#1C202C] bg-[#0B0C10]/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-widest leading-none">CSV / JSON Bulk Uploader</span>
                <h3 className="text-sm font-semibold text-white mt-1">Bulk Contact Import</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-[#1E2230] border border-[#1E2230]/20 rounded-lg text-[#B0B8C8] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Wizard Content */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              {step === "upload" && (
                /* STEP 1: UPLOAD AREA */
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-[#1E2230] hover:border-[#6B7280]/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[#0B0C10]/10 hover:bg-[#0B0C10]/35 transition-all duration-300 relative group min-h-[220px]"
                >
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="p-3.5 rounded-2xl bg-[#6B7280]/10 border border-[#6B7280]/25 text-[#9CA3AF] group-hover:scale-105 transition-transform duration-300 mb-4">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-none">Drag and drop file here</h4>
                  <p className="text-[10px] text-[#7A8499] font-mono mt-2 leading-none">Supports CSV or JSON (Max 1,000 profiles)</p>
                  <button className="mt-5 px-3 py-1.5 bg-[#12141A] border border-[#1E2230] text-[10px] text-[#B0B8C8] group-hover:text-white font-semibold rounded-lg transition-colors pointer-events-none">
                    Select File
                  </button>
                </div>
              )}

              {step === "mapping" && (
                /* STEP 2: COLUMN MAPPING PREVIEW */
                <div className="space-y-4">
                  <div className="flex items-center gap-2 bg-[#0F1016] p-3 rounded-xl border border-[#1C202C]/80">
                    <FileText className="w-4 h-4 text-[#FE8A5C]" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{fileName}</p>
                      <p className="text-[9px] text-[#7A8499] font-mono leading-none mt-0.5">{fileSize}</p>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    <p className="text-[9px] text-[#7A8499] font-mono uppercase tracking-wide">Map CSV headers to EngageIQ Fields</p>
                    {[
                      { field: "email", label: "Email Identifier *", headers: ["email_address", "Email", "mail", "ignore"] },
                      { field: "firstName", label: "First Name", headers: ["first_name", "FirstName", "Name", "ignore"] },
                      { field: "lastName", label: "Last Name", headers: ["last_name", "LastName", "Surname", "ignore"] },
                      { field: "phone", label: "Phone Connection", headers: ["mobile_phone", "Phone", "tel", "ignore"] }
                    ].map((row) => (
                      <div key={row.field} className="flex items-center justify-between py-2 border-b border-[#1C202C]/40 text-xs gap-3">
                        <span className="text-[#B0B8C8] font-semibold">{row.label}</span>
                        <div className="relative bg-[#08090C] border border-[#1E2230] rounded-lg px-2.5 py-1">
                          <select
                            value={mappings[row.field as keyof typeof mappings]}
                            onChange={(e) => handleMappingChange(row.field as any, e.target.value)}
                            className="bg-transparent text-xs text-white font-mono focus:outline-none cursor-pointer pr-4 appearance-none"
                          >
                            {row.headers.map((h) => (
                              <option key={h} value={h} className="bg-[#090A0E]">{h}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === "loading" && (
                /* STEP 3: LOADING LOADER */
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Importing Contacts...</h4>
                    <p className="text-[9px] text-[#7A8499] font-mono mt-1">Executing validations & mapping triggers</p>
                  </div>
                </div>
              )}

              {step === "result" && (
                /* STEP 4: RESULT SCREEN */
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="p-3 bg-[#3CD3AD]/10 border border-[#3CD3AD]/25 text-[#3CD3AD] rounded-2xl">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">Import Successful</h4>
                    <p className="text-xs text-[#B0B8C8] mt-1.5 leading-relaxed max-w-[320px]">
                      Successfully mapped columns. Imported <span className="text-[#3CD3AD] font-bold font-mono">{importResult.imported}</span> profiles, skipped <span className="text-[#FE5C5C] font-bold font-mono">{importResult.skipped}</span> duplicates or unqualified rows.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="p-5 border-t border-[#1C202C] bg-[#0B0C10]/40 flex gap-3">
              {step === "mapping" && (
                <>
                  <button
                    onClick={() => setStep("upload")}
                    className="flex-1 py-2 bg-transparent border border-[#232737] hover:border-[#3E4562] text-xs font-semibold text-[#B0B8C8] hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStartImport}
                    className="flex-1 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] text-xs font-semibold text-white rounded-xl shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Import Mapped Rows</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              {step === "result" && (
                <button
                  onClick={handleFinish}
                  className="w-full py-2.5 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] text-xs font-semibold text-white rounded-xl transition-colors cursor-pointer"
                >
                  Close & View Database
                </button>
              )}
              {step === "upload" && (
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-transparent border border-[#232737] hover:border-[#3E4562] text-xs font-semibold text-[#B0B8C8] hover:text-white rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
