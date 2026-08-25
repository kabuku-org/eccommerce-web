import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react'

type CartItem = {
  name: string
  price: number
  quantity: number
}

type Props = {
  items: CartItem[]
  total: number
  onClearCart: () => void
  onCheckout: () => void
  clearLoading?: boolean
  createLoading?: boolean
}

export function CartSummary({ items, total, onClearCart, onCheckout, clearLoading, createLoading }: Props) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_#000] p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="size-5" />
        <h2 className="text-lg font-black uppercase tracking-wide">Order Summary</h2>
      </div>

      <div className="space-y-2 mb-4">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm border-b border-stone-200 pb-2">
            <span className="text-stone-700">
              {item.name} × {item.quantity}
            </span>
            <span className="font-bold text-black">
              KES {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t-2 border-black pt-3 mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
          Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
        <span className="text-xl font-black text-black">
          KES {total.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onCheckout}
          disabled={createLoading || items.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 text-sm font-bold uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] disabled:hover:translate-y-0 transition-all"
        >
          {createLoading ? (
            <>
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Placing order...
            </>
          ) : (
            <>
              <ArrowRight className="size-4" />
              Place Order
            </>
          )}
        </button>

        <button
          onClick={onClearCart}
          disabled={clearLoading || items.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-white text-stone-700 py-2 text-xs font-bold uppercase tracking-wider border-2 border-stone-300 hover:border-black hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {clearLoading ? (
            <span className="size-3 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
          ) : (
            <Trash2 className="size-3" />
          )}
          {clearLoading ? 'Clearing...' : 'Clear Cart'}
        </button>
      </div>
    </div>
  )
}
