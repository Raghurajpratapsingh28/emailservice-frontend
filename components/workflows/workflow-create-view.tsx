"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import WorkflowGraph from "./workflow-graph"
import { workflowsService } from "@/lib/workflows-service"
import { defaultNodes, validateNodes, nodesToGraph, graphToNodes, type WorkflowNode } from "@/lib/workflows-data"

interface Props {
  workspaceId: string
}

export default function WorkflowCreateView({ workspaceId }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")

  const [name, setName] = useState("")
  const [nodes, setNodes] = useState<WorkflowNode[]>(defaultNodes())
  const [nameError, setNameError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingEdit, setIsLoadingEdit] = useState(!!editId)

  useEffect(() => {
    if (!editId) return
    workflowsService.get(workspaceId, editId)
      .then((res) => {
        setName(res.workflow.name)
        setNodes(res.workflow.graph ? graphToNodes(res.workflow.graph) : defaultNodes())
      })
      .catch(console.error)
      .finally(() => setIsLoadingEdit(false))
  }, [workspaceId, editId])

  const graphErrors = validateNodes(nodes)

  const handleSave = async (andPublish = false) => {
    if (!name.trim()) { setNameError("Name is required."); return }
    setIsSaving(true)
    try {
      const graph = nodesToGraph(nodes)
      if (editId) {
        await workflowsService.update(workspaceId, editId, { name: name.trim(), graph })
      } else {
        const res = await workflowsService.create(workspaceId, { name: name.trim(), graph })
        if (andPublish) await workflowsService.publish(workspaceId, res.workflow.id)
      }
      router.push(`/flow-builder/${workspaceId}`)
    } catch (err) {
      console.error("Failed to save workflow:", err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingEdit) return (
    <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" /></div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-[1200px] mx-auto select-none">
      <div>
        <button onClick={() => router.push(`/flow-builder/${workspaceId}`)} className="flex items-center gap-1.5 text-[10px] font-mono text-[#7A8499] hover:text-[#B0B8C8] transition-colors mb-3 cursor-pointer">
          <ArrowLeft className="w-3 h-3" /> Back to Workflows
        </button>
        <span className="text-[10px] text-[#7A8499] font-mono uppercase tracking-wider">Visual Journeys</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white/95 mt-1">{editId ? "Edit Workflow" : "New Workflow"}</h1>
      </div>

      <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C] space-y-6">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/80 tracking-tight">Workflow Name <span className="text-red-400">*</span></label>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setNameError("") }}
            placeholder="e.g. Trial Onboarding"
            className="w-full max-w-sm px-3.5 py-2.5 bg-[#08090C] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-sm text-white placeholder-[#7A8499] focus:outline-none transition-colors"
          />
          {nameError && <p className="text-[10px] text-red-400 font-mono">{nameError}</p>}
        </div>

        {/* Graph */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-white/80 tracking-tight">Flow Graph</label>
          <div className="p-4 rounded-2xl bg-[#08090C] border border-[#1C202C]">
            <WorkflowGraph nodes={nodes} onChange={setNodes} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          {graphErrors.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
              <AlertCircle className="w-3 h-3" /> {graphErrors.length} validation issue{graphErrors.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/flow-builder/${workspaceId}`)} className="px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white transition-all cursor-pointer">
            Cancel
          </button>
          {editId ? (
            <button onClick={() => handleSave()} disabled={isSaving} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#6B7280] to-[#6B7280] hover:from-[#4B5563] hover:to-[#374151] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#6B7280]/15 transition-all cursor-pointer">
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Changes
            </button>
          ) : (
            <>
              <button onClick={() => handleSave(false)} disabled={isSaving} className="flex items-center gap-1.5 px-4 py-2 bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] rounded-xl text-xs font-semibold text-[#B0B8C8] hover:text-white disabled:opacity-50 transition-all cursor-pointer">
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save as Draft
              </button>
              <button onClick={() => handleSave(true)} disabled={isSaving || graphErrors.length > 0} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/15 transition-all cursor-pointer">
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Create & Publish
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
