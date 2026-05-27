import { SegmentStatus, SegmentType } from "@/lib/segments-data"
import { Loader2 } from "lucide-react"

const STATUS_STYLES: Record<SegmentStatus, string> = {
  pending: "bg-amber-500/10 border-amber-500/25 text-amber-400",
  computing: "bg-blue-500/10 border-blue-500/25 text-blue-400",
  ready: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
  failed: "bg-red-500/10 border-red-500/25 text-red-400",
}

const STATUS_LABELS: Record<SegmentStatus, string> = {
  pending: "Pending",
  computing: "Computing",
  ready: "Ready",
  failed: "Failed",
}

const TYPE_STYLES: Record<SegmentType, string> = {
  static: "bg-zinc-500/10 border-zinc-500/25 text-zinc-400",
  dynamic: "bg-[#6B7280]/10 border-[#6B7280]/25 text-[#9CA3AF]",
}

export function SegmentStatusBadge({ status }: { status: SegmentStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase ${STATUS_STYLES[status]}`}>
      {status === "computing" && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
      {STATUS_LABELS[status]}
    </span>
  )
}

export function SegmentTypeBadge({ type }: { type: SegmentType }) {
  return (
    <span className={`inline-flex items-center text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase ${TYPE_STYLES[type]}`}>
      {type}
    </span>
  )
}
