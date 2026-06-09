export type BillingInterval = "monthly" | "yearly"
export type InvoiceStatus = "paid" | "open" | "void" | "draft"

export type Plan = {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  contacts: number
  emails: number
  events: number
}

export type UsageMetric = {
  name: string
  used: number
  limit: number
}

export const PLANS: Plan[] = [
  { id: "free",    name: "Free",    monthlyPrice: 0,  yearlyPrice: 0,   contacts: 100,     emails: 500,       events: 1000 },
  { id: "starter", name: "Starter", monthlyPrice: 9,  yearlyPrice: 86,  contacts: 5000,    emails: 20000,     events: 50000 },
  { id: "growth",  name: "Growth",  monthlyPrice: 29, yearlyPrice: 278, contacts: 50000,   emails: 200000,    events: 500000 },
  { id: "pro",     name: "Pro",     monthlyPrice: 99, yearlyPrice: 950, contacts: 500000,  emails: 2000000,   events: 5000000 },
]

export const INVOICE_STATUS_META: Record<InvoiceStatus, { label: string; cls: string }> = {
  paid:  { label: "Paid",  cls: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" },
  open:  { label: "Open",  cls: "bg-amber-500/10 border-amber-500/25 text-amber-400" },
  void:  { label: "Void",  cls: "bg-zinc-500/10 border-zinc-500/25 text-zinc-400" },
  draft: { label: "Draft", cls: "bg-zinc-500/10 border-zinc-500/25 text-zinc-400" },
}

export function usageColor(pct: number): string {
  if (pct >= 90) return "from-red-500 to-red-400"
  if (pct >= 70) return "from-amber-500 to-yellow-400"
  return "from-emerald-500 to-teal-400"
}

export function planPrice(plan: Plan, interval: BillingInterval): number {
  return interval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice
}
