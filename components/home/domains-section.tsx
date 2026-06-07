"use client"

import { useRouter } from "next/navigation"
import { Globe, Plus, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react"

interface Props { verified: number; pending: number; workspaceId: string }

export default function DomainsSection({ verified, pending, workspaceId }: Props) {
  const router = useRouter()

  return (
    <div className="p-5 enterprise-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[#FFFFFF]/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-[#FFFFFF]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#FFFFFF] tracking-tight">Sending Domains</h3>
          </div>
          <button onClick={() => router.push(`/domains/${workspaceId}`)} className="text-[12px] text-[#8A8D96] hover:text-[#FFFFFF] transition-colors flex items-center gap-1 cursor-pointer">
            View All <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-4 enterprise-panel">
            <div className="w-8 h-8 rounded-[8px] bg-[#696CFF]/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#696CFF]" />
            </div>
            <div>
              <p className="text-[20px] font-bold text-[#FFFFFF] leading-none">{verified}</p>
              <p className="text-[10px] font-medium text-[#8A8D96] uppercase mt-1">Verified</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 enterprise-panel">
            <div className="w-8 h-8 rounded-[8px] bg-[#FFB020]/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-[#FFB020]" />
            </div>
            <div>
              <p className="text-[20px] font-bold text-[#FFFFFF] leading-none">{pending}</p>
              <p className="text-[10px] font-medium text-[#8A8D96] uppercase mt-1">Pending</p>
            </div>
          </div>
        </div>
      </div>
      
      <button onClick={() => router.push(`/domains/${workspaceId}`)} className="mt-6 w-full py-3 enterprise-btn text-[#FFFFFF] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer border border-[#202126] hover:border-[#FFFFFF] transition-all">
        <Plus className="w-4 h-4 text-[#FFFFFF]" /> Manage Domains
      </button>
    </div>
  )
}
