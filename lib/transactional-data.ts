export type SendStatus = "queued" | "sending" | "sent" | "failed" | "bounced"
export type TemplateStatus = "draft" | "published" | "archived"

export type TemplateVariable = { name: string; type: "string" | "number" | "boolean" }

export type EmailTemplate = {
  id: string
  name: string
  subject: string
  htmlBody: string
  plainText: string
  variables: TemplateVariable[]
  status: TemplateStatus
  version: number
  createdAt: string
  updatedAt: string
}

export type TransactionalSend = {
  id: string
  recipient: string
  recipientName: string
  subject: string
  fromEmail: string
  fromName: string
  replyTo: string
  status: SendStatus
  tags: Record<string, string>
  providerMessageId: string | null
  failureReason: string | null
  idempotencyKey: string | null
  sentAt: string | null
  createdAt: string
  updatedAt: string
}

export const VERIFIED_DOMAINS = ["hello@engageiq.com", "noreply@engageiq.com", "outreach@engageiq.com"]

export const SEND_STATUS_META: Record<SendStatus, { label: string; cls: string; spinner?: boolean }> = {
  queued:  { label: "Queued",  cls: "bg-zinc-500/10 border-zinc-500/25 text-zinc-400" },
  sending: { label: "Sending", cls: "bg-blue-500/10 border-blue-500/25 text-blue-400", spinner: true },
  sent:    { label: "Sent",    cls: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" },
  failed:  { label: "Failed",  cls: "bg-red-500/10 border-red-500/25 text-red-400" },
  bounced: { label: "Bounced", cls: "bg-orange-500/10 border-orange-500/25 text-orange-400" },
}

export const TEMPLATE_STATUS_META: Record<TemplateStatus, { label: string; cls: string }> = {
  draft:     { label: "Draft",     cls: "bg-zinc-500/10 border-zinc-500/25 text-zinc-400" },
  published: { label: "Published", cls: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" },
  archived:  { label: "Archived",  cls: "bg-zinc-800/10 border-zinc-700/25 text-zinc-600" },
}

export const initialTemplates: EmailTemplate[] = [
  {
    id: "tpl-001",
    name: "Welcome Email",
    subject: "Welcome to EngageIQ, {{first_name}}!",
    htmlBody: "<h1>Welcome, {{first_name}}!</h1><p>Thanks for joining {{company}}. Get started at <a href='{{dashboard_url}}'>your dashboard</a>.</p>",
    plainText: "Welcome, {{first_name}}!\n\nThanks for joining {{company}}.",
    variables: [
      { name: "first_name", type: "string" },
      { name: "company", type: "string" },
      { name: "dashboard_url", type: "string" },
    ],
    status: "published",
    version: 2,
    createdAt: "2026-04-01T09:00:00Z",
    updatedAt: "2026-05-10T10:00:00Z",
  },
  {
    id: "tpl-002",
    name: "Password Reset",
    subject: "Reset your password",
    htmlBody: "<h1>Password Reset</h1><p>Click <a href='{{reset_url}}'>here</a> to reset your password. Expires in {{expiry_hours}} hours.</p>",
    plainText: "Reset your password: {{reset_url}}\nExpires in {{expiry_hours}} hours.",
    variables: [
      { name: "reset_url", type: "string" },
      { name: "expiry_hours", type: "number" },
    ],
    status: "published",
    version: 1,
    createdAt: "2026-04-05T09:00:00Z",
    updatedAt: "2026-04-05T09:00:00Z",
  },
  {
    id: "tpl-003",
    name: "Invoice Receipt",
    subject: "Your invoice #{{invoice_id}} is ready",
    htmlBody: "<h1>Invoice #{{invoice_id}}</h1><p>Amount: ${{amount}}</p>",
    plainText: "Invoice #{{invoice_id}}\nAmount: ${{amount}}",
    variables: [
      { name: "invoice_id", type: "string" },
      { name: "amount", type: "number" },
    ],
    status: "draft",
    version: 1,
    createdAt: "2026-05-20T09:00:00Z",
    updatedAt: "2026-05-20T09:00:00Z",
  },
]

export const initialSends: TransactionalSend[] = [
  {
    id: "snd-001",
    recipient: "alice@acme.com",
    recipientName: "Alice Johnson",
    subject: "Welcome to EngageIQ, Alice!",
    fromEmail: "hello@engageiq.com",
    fromName: "EngageIQ Team",
    replyTo: "",
    status: "sent",
    tags: { source: "signup", template: "welcome" },
    providerMessageId: "0102018f1234abcd-abc123",
    failureReason: null,
    idempotencyKey: "signup-alice-001",
    sentAt: "2026-05-25T10:05:00Z",
    createdAt: "2026-05-25T10:04:00Z",
    updatedAt: "2026-05-25T10:05:00Z",
  },
  {
    id: "snd-002",
    recipient: "bob@techcorp.io",
    recipientName: "Bob Smith",
    subject: "Reset your password",
    fromEmail: "noreply@engageiq.com",
    fromName: "EngageIQ",
    replyTo: "support@engageiq.com",
    status: "failed",
    tags: { source: "password-reset" },
    providerMessageId: null,
    failureReason: "SENDER_DOMAIN_NOT_VERIFIED: Domain verification failed",
    idempotencyKey: null,
    sentAt: null,
    createdAt: "2026-05-25T11:00:00Z",
    updatedAt: "2026-05-25T11:01:00Z",
  },
  {
    id: "snd-003",
    recipient: "carol@startup.co",
    recipientName: "Carol Williams",
    subject: "Your invoice #INV-2026-042 is ready",
    fromEmail: "hello@engageiq.com",
    fromName: "EngageIQ Team",
    replyTo: "",
    status: "bounced",
    tags: { source: "billing" },
    providerMessageId: "0102018f5678efgh",
    failureReason: "550 5.1.1 The email account does not exist",
    idempotencyKey: null,
    sentAt: "2026-05-24T09:00:00Z",
    createdAt: "2026-05-24T08:59:00Z",
    updatedAt: "2026-05-24T09:02:00Z",
  },
  {
    id: "snd-004",
    recipient: "dave@enterprise.com",
    recipientName: "Dave Brown",
    subject: "Welcome to EngageIQ, Dave!",
    fromEmail: "hello@engageiq.com",
    fromName: "EngageIQ Team",
    replyTo: "",
    status: "sending",
    tags: { source: "signup" },
    providerMessageId: null,
    failureReason: null,
    idempotencyKey: "signup-dave-004",
    sentAt: null,
    createdAt: "2026-05-26T14:00:00Z",
    updatedAt: "2026-05-26T14:00:00Z",
  },
  {
    id: "snd-005",
    recipient: "eve@agency.net",
    recipientName: "Eve Davis",
    subject: "Reset your password",
    fromEmail: "noreply@engageiq.com",
    fromName: "EngageIQ",
    replyTo: "",
    status: "queued",
    tags: { source: "password-reset" },
    providerMessageId: null,
    failureReason: null,
    idempotencyKey: null,
    sentAt: null,
    createdAt: "2026-05-26T14:30:00Z",
    updatedAt: "2026-05-26T14:30:00Z",
  },
]
