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
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-black text-white px-5 py-3 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-200"
    >
      <ShoppingCart className="size-5" />
      <div className="flex flex-col items-start">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
        <span className="text-sm font-black">
          KES {total.toLocaleString()}
        </span>
      </div>
    </button>
  )
}
