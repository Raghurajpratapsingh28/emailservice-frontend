import { CampaignStatus, STATUS_META } from "@/lib/campaigns-data"
import { Loader2 } from "lucide-react"

export default function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const m = STATUS_META[status] ?? { label: status, color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/25" }
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase ${m.bg} ${m.border} ${m.color}`}>
      {status === "sending" && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
      {m.label}
    </span>
  )
}
