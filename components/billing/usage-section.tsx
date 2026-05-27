import { UsageMetric, usageColor } from "@/lib/billing-data"

export default function UsageSection({ metrics, period }: { metrics: UsageMetric[]; period: string }) {
  return (
    <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
      <div className="flex items-center justify-between border-b border-[#1C202C]/60 pb-4 mb-5">
        <div>
          <h3 className="text-xs font-semibold text-white/80 tracking-tight">Usage</h3>
          <p className="text-[11px] text-[#B0B8C8] mt-0.5">{period}</p>
        </div>
      </div>
      <div className="space-y-5">
        {metrics.map((m) => {
          const pct = Math.min((m.used / m.limit) * 100, 100)
          const color = usageColor(pct)
          return (
            <div key={m.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white/90">{m.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#7A8499]">{pct.toFixed(1)}%</span>
                  <span className="text-xs font-mono font-semibold text-white/80">
                    {m.used.toLocaleString()}
                    <span className="text-[#7A8499] font-normal"> / {m.limit.toLocaleString()}</span>
                  </span>
                </div>
              </div>
              <div className="h-2 bg-[#12141C] rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
