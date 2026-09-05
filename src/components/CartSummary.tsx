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
    <div className="border border-slate-200 bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="size-5 text-slate-700" />
        <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
      </div>

      <div className="space-y-2 mb-4">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm border-b border-slate-100 pb-2">
            <span className="text-slate-600">
              {item.name} × {item.quantity}
            </span>
            <span className="font-medium text-slate-900">
              KES {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-slate-200 pt-3 mb-4">
        <span className="text-sm text-slate-500">
          Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
        <span className="text-xl font-semibold text-slate-900">
          KES {total.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onCheckout}
          disabled={createLoading || items.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-slate-950 text-white py-3 text-sm font-medium rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
          className="w-full flex items-center justify-center gap-2 bg-white text-slate-600 py-2 text-sm font-medium border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {clearLoading ? (
            <span className="size-3 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}
          {clearLoading ? 'Clearing...' : 'Clear Cart'}
        </button>
      </div>
    </div>
  )
}
