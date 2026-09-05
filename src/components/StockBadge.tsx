import { Package, AlertTriangle, PackageX } from 'lucide-react'

type Props = {
  stock: number
}

export function StockBadge({ stock }: Props) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
        <PackageX className="size-3" />
        Out of stock
      </span>
    )
  }

  if (stock <= 5) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
        <AlertTriangle className="size-3" />
        Only {stock} left
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
      <Package className="size-3" />
      In stock
    </span>
  )
}
