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
    <div className="flex items-center border-2 border-black">
      <button
        onClick={onDecrease}
        disabled={!canDecrease || decreaseLoading}
        aria-label="Decrease quantity"
        className={cn(
          'p-2 transition-colors border-r-2 border-black',
          canDecrease && !decreaseLoading
            ? 'bg-white hover:bg-stone-100 text-black cursor-pointer'
            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
        )}
      >
        {decreaseLoading ? (
          <span className="size-4 block border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
        ) : (
          <Minus className="size-4" />
        )}
      </button>

      <span className="px-4 py-2 text-sm font-bold text-black min-w-[3rem] text-center select-none">
        {quantity}
      </span>

      <button
        onClick={onIncrease}
        disabled={!canIncrease || increaseLoading}
        aria-label="Increase quantity"
        className={cn(
          'p-2 transition-colors border-l-2 border-black',
          canIncrease && !increaseLoading
            ? 'bg-white hover:bg-stone-100 text-black cursor-pointer'
            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
        )}
      >
        {increaseLoading ? (
          <span className="size-4 block border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
        ) : (
          <Plus className="size-4" />
        )}
      </button>
    </div>
  )
}
