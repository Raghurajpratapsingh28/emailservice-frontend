import { Skeleton, SkPageHeader, SkCard, SkTable } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      <SkPageHeader />
      {/* API keys */}
      <SkCard>
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#202126]">
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-64" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 rounded-xl" />
                <Skeleton className="h-8 w-16 rounded-xl" />
              </div>
            </div>
          ))}
          <Skeleton className="h-9 w-32 rounded-[12px]" />
        </div>
      </SkCard>
      <SkTable rows={4} cols={4} />
    </div>
  )
}
