import { Invoice, INVOICE_STATUS_META } from "@/lib/billing-data"
import { ExternalLink, Download } from "lucide-react"

export default function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="p-6 rounded-3xl bg-[#0F1016]/95 border border-[#1C202C]">
      <h3 className="text-xs font-semibold text-white/80 tracking-tight border-b border-[#1C202C]/60 pb-4 mb-4">
        Invoices
      </h3>
      {invoices.length === 0 ? (
        <p className="text-xs text-[#7A8499] font-mono">No invoices yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#1C202C]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1C202C]">
                {["Date", "Amount", "Status", "Actions"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-white/80 tracking-tight whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C202C]/60">
              {invoices.map((inv) => {
                const m = INVOICE_STATUS_META[inv.status]
                return (
                  <tr key={inv.id} className="hover:bg-[#111319] transition-colors">
                    <td className="px-4 py-3 text-[#B0B8C8] font-mono whitespace-nowrap">
                      {new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-white/90">${inv.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 border rounded-full uppercase ${m.cls}`}>{m.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <a href={inv.hostedInvoiceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-[9px] font-mono text-[#B0B8C8] hover:text-white transition-all">
                          <ExternalLink className="w-3 h-3" /> View
                        </a>
                        <a href={inv.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#12141A] hover:bg-[#1C1F2D] border border-[#1E2230] hover:border-[#383E58] text-[9px] font-mono text-[#B0B8C8] hover:text-white transition-all">
                          <Download className="w-3 h-3" /> PDF
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
