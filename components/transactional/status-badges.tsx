import { SendStatus, TemplateStatus, SEND_STATUS_META, TEMPLATE_STATUS_META } from "@/lib/transactional-data"
import { Loader2 } from "lucide-react"

export function SendStatusBadge({ status }: { status: SendStatus }) {
  const m = SEND_STATUS_META[status]
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase ${m.cls}`}>
      {m.spinner && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
      {m.label}
    </span>
  )
}

export function TemplateStatusBadge({ status }: { status: TemplateStatus }) {
  const m = TEMPLATE_STATUS_META[status]
  return (
    <span className={`inline-flex items-center text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase ${m.cls}`}>
      {m.label}
    </span>
  )
}
