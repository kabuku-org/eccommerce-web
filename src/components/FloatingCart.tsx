import { ShoppingCart } from 'lucide-react'

type Props = {
  itemCount: number
  total: number
  onClick: () => void
}

export function FloatingCart({ itemCount, total, onClick }: Props) {
  if (itemCount === 0) return null

  return (
    <button
      onClick={onClick}
      aria-label={`View cart with ${itemCount} items, total KES ${total.toLocaleString()}`}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg px-5 py-3 rounded-2xl hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
    >
      <ShoppingCart className="size-5 text-slate-700" />
      <div className="flex flex-col items-start">
        <span className="text-[10px] font-medium text-slate-400">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
        <span className="text-sm font-semibold text-slate-900">
          KES {total.toLocaleString()}
        </span>
      </div>
    </button>
  )
}
