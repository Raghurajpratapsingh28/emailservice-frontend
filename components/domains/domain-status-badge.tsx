const META: Record<string, { label: string; cls: string }> = {
  pending:   { label: "Pending",   cls: "bg-zinc-500/10 border-zinc-500/25 text-zinc-400" },
  verifying: { label: "Verifying", cls: "bg-blue-500/10 border-blue-500/25 text-blue-400" },
  verified:  { label: "Verified",  cls: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" },
  failed:    { label: "Failed",    cls: "bg-red-500/10 border-red-500/25 text-red-400" },
  deleting:  { label: "Deleting",  cls: "bg-orange-500/10 border-orange-500/25 text-orange-400" },
  deleted:   { label: "Deleted",   cls: "bg-zinc-800/10 border-zinc-700/25 text-zinc-600" },
}

export default function DomainStatusBadge({ status }: { status: string }) {
  const m = META[status] ?? { label: status, cls: "bg-zinc-500/10 border-zinc-500/25 text-zinc-400" }
  return (
    <span className={`inline-flex items-center text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase ${m.cls}`}>
      {m.label}
    </span>
  )
}
