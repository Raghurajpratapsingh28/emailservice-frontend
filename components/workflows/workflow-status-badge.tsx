import { WorkflowStatus } from "@/lib/workflows-data"

const META: Record<WorkflowStatus, { label: string; cls: string }> = {
  draft:     { label: "Draft",     cls: "bg-zinc-500/10 border-zinc-500/25 text-zinc-400" },
  published: { label: "Published", cls: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" },
  paused:    { label: "Paused",    cls: "bg-orange-500/10 border-orange-500/25 text-orange-400" },
  archived:  { label: "Archived",  cls: "bg-zinc-800/10 border-zinc-700/25 text-zinc-600" },
}

export default function WorkflowStatusBadge({ status }: { status: WorkflowStatus }) {
  const m = META[status]
  return (
    <span className={`inline-flex items-center text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase ${m.cls}`}>
      {m.label}
    </span>
  )
}
