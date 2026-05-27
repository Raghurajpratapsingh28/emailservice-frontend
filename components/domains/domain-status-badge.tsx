import { DomainStatus } from "@/lib/domains-data"
import { Loader2, CheckCircle2, XCircle, Circle } from "lucide-react"

const META: Record<DomainStatus, { cls: string; label: string; Icon: React.ElementType }> = {
  pending:   { cls: "bg-zinc-500/10 border-zinc-500/25 text-zinc-400",    label: "Pending",   Icon: Circle },
  verifying: { cls: "bg-blue-500/10 border-blue-500/25 text-blue-400",    label: "Verifying", Icon: Loader2 },
  verified:  { cls: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400", label: "Verified", Icon: CheckCircle2 },
  failed:    { cls: "bg-red-500/10 border-red-500/25 text-red-400",       label: "Failed",    Icon: XCircle },
}

export default function DomainStatusBadge({ status }: { status: DomainStatus }) {
  const { cls, label, Icon } = META[status]
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase ${cls}`}>
      <Icon className={`w-2.5 h-2.5 ${status === "verifying" ? "animate-spin" : ""}`} />
      {label}
    </span>
  )
}
