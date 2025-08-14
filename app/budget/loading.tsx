import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
      </div>

      <Skeleton className="h-[400px]" />
    </div>
  )
}
