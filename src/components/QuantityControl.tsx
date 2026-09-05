import { Plus, Minus } from 'lucide-react'
import { cn } from '../lib/utils'

type Props = {
  quantity: number
  stock: number
  onIncrease: () => void
  onDecrease: () => void
  increaseLoading?: boolean
  decreaseLoading?: boolean
}

export function QuantityControl({
  quantity,
  stock,
  onIncrease,
  onDecrease,
  increaseLoading,
  decreaseLoading,
}: Props) {
  const canIncrease = quantity < stock
  const canDecrease = quantity > 1

  return (
    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={onDecrease}
        disabled={!canDecrease || decreaseLoading}
        aria-label="Decrease quantity"
        className={cn(
          'p-2 transition-colors',
          canDecrease && !decreaseLoading
            ? 'bg-white hover:bg-slate-50 text-slate-700 cursor-pointer'
            : 'bg-slate-50 text-slate-300 cursor-not-allowed'
        )}
      >
        {decreaseLoading ? (
          <span className="size-4 block border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
        ) : (
          <Minus className="size-4" />
        )}
      </button>

      <span className="px-4 py-2 text-sm font-medium text-slate-900 min-w-[3rem] text-center select-none">
        {quantity}
      </span>

      <button
        onClick={onIncrease}
        disabled={!canIncrease || increaseLoading}
        aria-label="Increase quantity"
        className={cn(
          'p-2 transition-colors',
          canIncrease && !increaseLoading
            ? 'bg-white hover:bg-slate-50 text-slate-700 cursor-pointer'
            : 'bg-slate-50 text-slate-300 cursor-not-allowed'
        )}
      >
        {increaseLoading ? (
          <span className="size-4 block border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
        ) : (
          <Plus className="size-4" />
        )}
      </button>
    </div>
  )
}
