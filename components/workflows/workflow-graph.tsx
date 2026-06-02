"use client"

import { useState } from "react"
import {
  WorkflowNode, NodeType, TriggerConfig, EmailConfig, DelayConfig,
  makeNode, nodeLabel, validateNodes,
} from "@/lib/workflows-data"
import { Zap, Mail, Clock, Square, Plus, Trash2, X, ChevronDown, AlertCircle, CheckCircle2 } from "lucide-react"

const NODE_META: Record<NodeType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  trigger: { icon: Zap,    color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/30",   label: "Trigger" },
  email:   { icon: Mail,   color: "text-[#9CA3AF]",   bg: "bg-[#6B7280]/10 border-[#6B7280]/30",  label: "Email" },
  delay:   { icon: Clock,  color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/30",     label: "Delay" },
  end:     { icon: Square, color: "text-zinc-500",    bg: "bg-zinc-800/20 border-zinc-700/30",     label: "End" },
}

const ADD_OPTIONS: { type: NodeType; label: string }[] = [
  { type: "email", label: "Email" },
  { type: "delay", label: "Delay" },
]

interface Props {
  nodes: WorkflowNode[]
  onChange: (nodes: WorkflowNode[]) => void
  readOnly?: boolean
}

export default function WorkflowGraph({ nodes, onChange, readOnly = false }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addingAt, setAddingAt] = useState<number | null>(null)

  const errors = validateNodes(nodes)
  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null

  const updateNode = (id: string, config: WorkflowNode["config"]) =>
    onChange(nodes.map((n) => n.id === id ? { ...n, config } : n))

  const removeNode = (id: string) => {
    onChange(nodes.filter((n) => n.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const insertAt = (idx: number, type: NodeType) => {
    const newNode = makeNode(type)
    const next = [...nodes]
    next.splice(idx, 0, newNode)
    onChange(next)
    setAddingAt(null)
    setSelectedId(newNode.id)
  }

  const nodeHasError = (n: WorkflowNode): boolean => {
    if (n.type === "trigger") {
      const c = n.config as TriggerConfig
      return c.triggerType === "event" && !c.eventName.trim()
    }
    if (n.type === "email") {
      const c = n.config as EmailConfig
      return !c.subject.trim() || !c.fromEmail
    }
    if (n.type === "delay") {
      const c = n.config as DelayConfig
      return !c.duration || c.duration < 1
    }
    return false
  }

  return (
    <div className="flex gap-4 min-h-[400px]">
      {/* Canvas */}
      <div className="flex-1 flex flex-col items-center py-4 space-y-0 overflow-y-auto">
        {/* Validation summary */}
        {!readOnly && errors.length > 0 && (
          <div className="w-full max-w-xs mb-4 p-3 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-1">
            {errors.map((e) => (
              <div key={e} className="flex items-start gap-1.5 text-[10px] text-red-400 font-mono">
                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" /> {e}
              </div>
            ))}
          </div>
        )}

        {nodes.map((node, idx) => {
          const meta = NODE_META[node.type]
          const Icon = meta.icon
          const hasErr = nodeHasError(node)
          const isSelected = selectedId === node.id
          const canDelete = !readOnly && node.type !== "trigger" && node.type !== "end"

          return (
            <div key={node.id} className="flex flex-col items-center w-full max-w-xs">
              {/* Add step button above (not before trigger) */}
              {!readOnly && idx > 0 && idx < nodes.length && (
                <div className="relative flex flex-col items-center">
                  <div className="w-px h-4 bg-[#1C202C]" />
                  {addingAt === idx ? (
                    <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#0F1016] border border-[#1C202C] shadow-lg">
                      {ADD_OPTIONS.map((opt) => (
                        <button
                          key={opt.type}
                          onClick={() => insertAt(idx, opt.type)}
                          className="px-2.5 py-1 rounded-lg bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] text-[10px] font-mono text-[#B0B8C8] hover:text-white transition-all cursor-pointer"
                        >
                          {opt.label}
                        </button>
                      ))}
                      <button onClick={() => setAddingAt(null)} className="p-1 text-[#7A8499] hover:text-white cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingAt(idx)}
                      className="w-6 h-6 rounded-full bg-[#12141A] border border-[#1E2230] hover:border-[#6B7280]/50 flex items-center justify-center text-[#7A8499] hover:text-[#9CA3AF] transition-all cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                  <div className="w-px h-4 bg-[#1C202C]" />
                </div>
              )}
              {idx === 0 && <div className="w-px h-4 bg-transparent" />}

              {/* Node card */}
              <button
                onClick={() => !readOnly && setSelectedId(isSelected ? null : node.id)}
                className={`w-full p-3.5 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? "border-[#6B7280]/60 bg-[#6B7280]/5 shadow-lg shadow-[#6B7280]/10"
                    : `${meta.bg} hover:border-opacity-60`
                } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg bg-[#08090C] border border-[#1E2230]`}>
                      <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                    </div>
                    <div>
                      <p className={`text-[9px] font-mono font-semibold uppercase tracking-wider ${meta.color}`}>{meta.label}</p>
                      <p className="text-xs font-semibold text-white/90 mt-0.5 truncate max-w-[160px]">{nodeLabel(node)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasErr ? (
                      <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/50" />
                    )}
                    {canDelete && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeNode(node.id) }}
                        className="p-1 rounded-lg hover:bg-red-500/10 text-[#7A8499] hover:text-red-400 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </button>

              {/* Connector line after node (not after last) */}
              {idx < nodes.length - 1 && !(!readOnly && idx > 0) && (
                <div className="w-px h-4 bg-[#1C202C]" />
              )}
            </div>
          )
        })}

        {/* Add step at end (before end node) */}
        {!readOnly && (
          <div className="mt-4">
            <button
              onClick={() => setAddingAt(nodes.length - 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-[10px] font-mono text-[#B0B8C8] hover:text-white transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Add Step
            </button>
          </div>
        )}
      </div>

      {/* Config panel */}
      {!readOnly && selectedNode && (
        <div className="w-72 shrink-0 p-4 rounded-2xl bg-[#08090C] border border-[#1C202C] space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${NODE_META[selectedNode.type].color}`}>
              Configure {NODE_META[selectedNode.type].label}
            </span>
            <button onClick={() => setSelectedId(null)} className="p-1 text-[#7A8499] hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {selectedNode.type === "trigger" && (
            <TriggerPanel node={selectedNode} onChange={(c) => updateNode(selectedNode.id, c)} />
          )}
          {selectedNode.type === "email" && (
            <EmailPanel node={selectedNode} onChange={(c) => updateNode(selectedNode.id, c)} />
          )}
          {selectedNode.type === "delay" && (
            <DelayPanel node={selectedNode} onChange={(c) => updateNode(selectedNode.id, c)} />
          )}
          {selectedNode.type === "end" && (
            <p className="text-xs text-[#7A8499] font-mono">No configuration needed. This marks the end of the workflow.</p>
          )}
        </div>
      )}
    </div>
  )
}

function TriggerPanel({ node, onChange }: { node: WorkflowNode; onChange: (c: TriggerConfig) => void }) {
  const c = node.config as TriggerConfig
  return (
    <div className="space-y-3">
      <PanelField label="Trigger Type">
        <SelectWrap value={c.triggerType} onChange={(v) => onChange({ ...c, triggerType: v as TriggerType })}>
          <option value="event">Event</option>
          <option value="segment_enter">Segment Enter</option>
          <option value="manual">Manual</option>
        </SelectWrap>
      </PanelField>
      {c.triggerType === "event" && (
        <PanelField label="Event Name *">
          <input value={c.eventName} onChange={(e) => onChange({ ...c, eventName: e.target.value })} placeholder="e.g. Trial Started" className={inputCls} />
        </PanelField>
      )}
    </div>
  )
}

function EmailPanel({ node, onChange }: { node: WorkflowNode; onChange: (c: EmailConfig) => void }) {
  const c = node.config as EmailConfig
  return (
    <div className="space-y-3">
      <PanelField label="Subject *">
        <input value={c.subject} onChange={(e) => onChange({ ...c, subject: e.target.value })} placeholder="Email subject..." className={inputCls} />
      </PanelField>
      <PanelField label="From Email *">
        <input type="email" value={c.fromEmail} onChange={(e) => onChange({ ...c, fromEmail: e.target.value })} placeholder="hello@yourdomain.com" className={inputCls} />
      </PanelField>
      <PanelField label="From Name">
        <input value={c.fromName} onChange={(e) => onChange({ ...c, fromName: e.target.value })} placeholder="e.g. EngageIQ Team" className={inputCls} />
      </PanelField>
      <PanelField label="HTML Body">
        <textarea value={c.htmlBody} onChange={(e) => onChange({ ...c, htmlBody: e.target.value })} placeholder="<h1>Hello {{firstName}}</h1>" rows={5} className={`${inputCls} font-mono resize-y`} />
      </PanelField>
    </div>
  )
}

function DelayPanel({ node, onChange }: { node: WorkflowNode; onChange: (c: DelayConfig) => void }) {
  const c = node.config as DelayConfig
  return (
    <div className="space-y-3">
      <PanelField label="Duration *">
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            value={c.duration}
            onChange={(e) => onChange({ ...c, duration: Math.max(1, Number(e.target.value)) })}
            className={`${inputCls} w-20`}
          />
          <SelectWrap value={c.unit} onChange={(v) => onChange({ ...c, unit: v as DelayConfig["unit"] })}>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
          </SelectWrap>
        </div>
      </PanelField>
    </div>
  )
}

function PanelField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-mono font-semibold text-[#7A8499] uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

function SelectWrap({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative flex-1">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none pl-2.5 pr-7 py-2 bg-[#0F1016] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white/90 cursor-pointer focus:outline-none transition-colors">
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#7A8499] pointer-events-none" />
    </div>
  )
}

const inputCls = "w-full px-2.5 py-2 bg-[#0F1016] border border-[#1E2230] hover:border-[#383E58] focus:border-[#6B7280] rounded-xl text-xs text-white placeholder-[#7A8499] focus:outline-none transition-colors"

// Re-export TriggerType for use in panel
type TriggerType = TriggerConfig["triggerType"]
