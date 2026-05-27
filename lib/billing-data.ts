export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "free"
export type BillingInterval = "monthly" | "yearly"
export type InvoiceStatus = "paid" | "open" | "void" | "draft"
export type UserRole = "owner" | "admin" | "viewer"

export type Plan = {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  contacts: number
  emails: number
  events: number
}

export type Subscription = {
  status: SubscriptionStatus
  planId: string
  interval: BillingInterval
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  trialEnd: string | null
}

export type UsageMetric = {
  name: string
  used: number
  limit: number
}

export type Invoice = {
  id: string
  date: string
  amount: number
  status: InvoiceStatus
  hostedInvoiceUrl: string
  pdfUrl: string
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

// Mock current user role — in real app comes from auth context
export const CURRENT_ROLE: UserRole = "owner"

export const mockSubscription: Subscription = {
  status: "active",
  planId: "growth",
  interval: "monthly",
  currentPeriodStart: "2026-05-01T00:00:00Z",
  currentPeriodEnd: "2026-06-01T00:00:00Z",
  cancelAtPeriodEnd: false,
  trialEnd: null,
}

export const mockUsage: UsageMetric[] = [
  { name: "Contacts",       used: 1200,  limit: 50000 },
  { name: "Emails Sent",    used: 8400,  limit: 200000 },
  { name: "Events Tracked", used: 42000, limit: 500000 },
]

export const mockInvoices: Invoice[] = [
  { id: "inv-001", date: "2026-05-01T00:00:00Z", amount: 29, status: "paid",  hostedInvoiceUrl: "#", pdfUrl: "#" },
  { id: "inv-002", date: "2026-04-01T00:00:00Z", amount: 29, status: "paid",  hostedInvoiceUrl: "#", pdfUrl: "#" },
  { id: "inv-003", date: "2026-03-01T00:00:00Z", amount: 29, status: "paid",  hostedInvoiceUrl: "#", pdfUrl: "#" },
  { id: "inv-004", date: "2026-02-01T00:00:00Z", amount: 9,  status: "paid",  hostedInvoiceUrl: "#", pdfUrl: "#" },
  { id: "inv-005", date: "2026-06-01T00:00:00Z", amount: 29, status: "open",  hostedInvoiceUrl: "#", pdfUrl: "#" },
]

export function usageColor(pct: number): string {
  if (pct >= 90) return "from-red-500 to-red-400"
  if (pct >= 70) return "from-amber-500 to-yellow-400"
  return "from-emerald-500 to-teal-400"
}

export function planPrice(plan: Plan, interval: BillingInterval): number {
  return interval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice
}
