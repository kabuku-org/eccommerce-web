import { Package, AlertTriangle, PackageX } from 'lucide-react'

type Props = {
  stock: number
}

export function StockBadge({ stock }: Props) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-red-700 bg-red-100 border border-red-300 px-2 py-1">
        <PackageX className="size-3" />
        Out of stock
      </span>
    )
  }

  if (stock <= 5) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-amber-700 bg-amber-100 border border-amber-300 px-2 py-1">
        <AlertTriangle className="size-3" />
        Only {stock} left
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-green-700 bg-green-100 border border-green-300 px-2 py-1">
      <Package className="size-3" />
      In stock
    </span>
  )
}
