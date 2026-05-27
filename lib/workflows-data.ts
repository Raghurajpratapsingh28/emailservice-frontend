export type WorkflowStatus = "draft" | "published" | "paused" | "archived"

export type TriggerType = "event" | "segment_enter" | "manual"

export type NodeType = "trigger" | "email" | "delay" | "end"

export type TriggerConfig = {
  triggerType: TriggerType
  eventName: string
}

export type EmailConfig = {
  subject: string
  fromEmail: string
  fromName: string
  htmlBody: string
}

export type DelayConfig = {
  duration: number
  unit: "minutes" | "hours" | "days" | "weeks"
}

export type WorkflowNode = {
  id: string
  type: NodeType
  config: TriggerConfig | EmailConfig | DelayConfig | Record<string, never>
}

export type ExecutionStatus = "running" | "completed" | "failed"

export type WorkflowExecution = {
  id: string
  contactEmail: string
  contactName: string
  status: ExecutionStatus
  currentNode: string
  startedAt: string
  completedAt: string | null
}

export type Workflow = {
  id: string
  name: string
  status: WorkflowStatus
  nodes: WorkflowNode[]
  executions: {
    total: number
    completed: number
    failed: number
    running: number
  }
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export const VERIFIED_DOMAINS = ["hello@engageiq.com", "noreply@engageiq.com", "outreach@engageiq.com"]

export const UNIT_TO_SECONDS: Record<string, number> = {
  minutes: 60, hours: 3600, days: 86400, weeks: 604800,
}

function makeId() { return Math.random().toString(36).slice(2, 9) }

export function makeNode(type: NodeType): WorkflowNode {
  const configs: Record<NodeType, WorkflowNode["config"]> = {
    trigger: { triggerType: "event", eventName: "" },
    email: { subject: "", fromEmail: VERIFIED_DOMAINS[0], fromName: "", htmlBody: "" },
    delay: { duration: 1, unit: "days" },
    end: {},
  }
  return { id: makeId(), type, config: configs[type] }
}

export function defaultNodes(): WorkflowNode[] {
  return [makeNode("trigger"), makeNode("email"), makeNode("delay"), makeNode("end")]
}

export function validateNodes(nodes: WorkflowNode[]): string[] {
  const errors: string[] = []
  if (nodes[0]?.type !== "trigger") errors.push("First node must be a Trigger.")
  if (nodes[nodes.length - 1]?.type !== "end") errors.push("Last node must be an End node.")
  nodes.forEach((n, i) => {
    if (n.type === "trigger") {
      const c = n.config as TriggerConfig
      if (c.triggerType === "event" && !c.eventName.trim()) errors.push(`Node ${i + 1}: Event name required.`)
    }
    if (n.type === "email") {
      const c = n.config as EmailConfig
      if (!c.subject.trim()) errors.push(`Node ${i + 1}: Email subject required.`)
      if (!c.fromEmail) errors.push(`Node ${i + 1}: From email required.`)
    }
    if (n.type === "delay") {
      const c = n.config as DelayConfig
      if (!c.duration || c.duration < 1) errors.push(`Node ${i + 1}: Delay duration must be ≥ 1.`)
    }
  })
  return errors
}

export function nodeLabel(n: WorkflowNode): string {
  if (n.type === "trigger") {
    const c = n.config as TriggerConfig
    return c.eventName ? `Event: "${c.eventName}"` : c.triggerType.replace("_", " ")
  }
  if (n.type === "email") {
    const c = n.config as EmailConfig
    return c.subject || "Untitled Email"
  }
  if (n.type === "delay") {
    const c = n.config as DelayConfig
    return `Wait ${c.duration} ${c.unit}`
  }
  return "End"
}

export function triggerLabel(nodes: WorkflowNode[]): string {
  const t = nodes.find((n) => n.type === "trigger")
  if (!t) return "—"
  const c = t.config as TriggerConfig
  const typeMap: Record<TriggerType, string> = { event: "Event", segment_enter: "Segment Enter", manual: "Manual" }
  return `${typeMap[c.triggerType]}${c.eventName ? `: ${c.eventName}` : ""}`
}

const MOCK_EXECUTIONS: WorkflowExecution[] = [
  { id: "ex1", contactEmail: "alice@acme.com", contactName: "Alice Johnson", status: "completed", currentNode: "End", startedAt: "2026-05-20T10:00:00Z", completedAt: "2026-05-22T10:00:00Z" },
  { id: "ex2", contactEmail: "bob@techcorp.io", contactName: "Bob Smith", status: "running", currentNode: "Wait 1 days", startedAt: "2026-05-25T09:00:00Z", completedAt: null },
  { id: "ex3", contactEmail: "carol@startup.co", contactName: "Carol Williams", status: "failed", currentNode: "Email", startedAt: "2026-05-24T08:00:00Z", completedAt: null },
  { id: "ex4", contactEmail: "dave@enterprise.com", contactName: "Dave Brown", status: "completed", currentNode: "End", startedAt: "2026-05-21T11:00:00Z", completedAt: "2026-05-23T11:00:00Z" },
  { id: "ex5", contactEmail: "eve@agency.net", contactName: "Eve Davis", status: "running", currentNode: "Email", startedAt: "2026-05-26T07:00:00Z", completedAt: null },
]

export const mockExecutions: Record<string, WorkflowExecution[]> = {
  "wf-001": MOCK_EXECUTIONS,
  "wf-002": MOCK_EXECUTIONS.slice(0, 2),
}

export const initialWorkflows: Workflow[] = [
  {
    id: "wf-001",
    name: "Trial Onboarding",
    status: "published",
    nodes: [
      { id: "n1", type: "trigger", config: { triggerType: "event", eventName: "Trial Started" } },
      { id: "n2", type: "email", config: { subject: "Welcome to your trial!", fromEmail: "hello@engageiq.com", fromName: "EngageIQ Team", htmlBody: "<h1>Welcome!</h1><p>Your trial has started.</p>" } },
      { id: "n3", type: "delay", config: { duration: 1, unit: "days" } },
      { id: "n4", type: "email", config: { subject: "How's your trial going?", fromEmail: "hello@engageiq.com", fromName: "EngageIQ Team", htmlBody: "<h1>Check-in</h1><p>How are things going?</p>" } },
      { id: "n5", type: "end", config: {} },
    ],
    executions: { total: 8450, completed: 8200, failed: 48, running: 202 },
    publishedAt: "2026-04-01T10:00:00Z",
    createdAt: "2026-03-28T09:00:00Z",
    updatedAt: "2026-05-20T10:00:00Z",
  },
  {
    id: "wf-002",
    name: "Post-Purchase Review Request",
    status: "paused",
    nodes: [
      { id: "n1", type: "trigger", config: { triggerType: "event", eventName: "Purchase Completed" } },
      { id: "n2", type: "delay", config: { duration: 3, unit: "days" } },
      { id: "n3", type: "email", config: { subject: "Leave us a review!", fromEmail: "noreply@engageiq.com", fromName: "EngageIQ", htmlBody: "<h1>Review Request</h1><p>Please leave a review.</p>" } },
      { id: "n4", type: "end", config: {} },
    ],
    executions: { total: 1200, completed: 1100, failed: 48, running: 52 },
    publishedAt: "2026-04-15T10:00:00Z",
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "wf-003",
    name: "Re-engagement Sequence",
    status: "draft",
    nodes: [
      { id: "n1", type: "trigger", config: { triggerType: "segment_enter", eventName: "" } },
      { id: "n2", type: "email", config: { subject: "We miss you!", fromEmail: "hello@engageiq.com", fromName: "EngageIQ Team", htmlBody: "<h1>We Miss You</h1>" } },
      { id: "n3", type: "end", config: {} },
    ],
    executions: { total: 0, completed: 0, failed: 0, running: 0 },
    publishedAt: null,
    createdAt: "2026-05-20T09:00:00Z",
    updatedAt: "2026-05-20T09:00:00Z",
  },
  {
    id: "wf-004",
    name: "Churn Prevention",
    status: "archived",
    nodes: [
      { id: "n1", type: "trigger", config: { triggerType: "event", eventName: "Subscription Cancelled" } },
      { id: "n2", type: "end", config: {} },
    ],
    executions: { total: 320, completed: 310, failed: 10, running: 0 },
    publishedAt: "2026-02-01T10:00:00Z",
    createdAt: "2026-01-28T09:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
  },
]
