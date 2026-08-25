import { Skeleton } from './ui/skeleton'

export function ProductSkeleton() {
  return (
    <div className="border-2 border-stone-200 p-5 flex flex-col gap-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center mt-auto">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}
