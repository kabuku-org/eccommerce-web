import { AlertTriangle, RefreshCw } from 'lucide-react'

type Props = {
  message: string
  availableQuantity?: number
  onUpdateCart: () => void
}

export function CheckoutStockError({ message, availableQuantity, onUpdateCart }: Props) {
  return (
    <div className="border border-red-200 bg-red-50 rounded-2xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="size-5 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-800">
            Stock changed
          </p>
          <p className="text-sm text-red-600 mt-1">
            {message}
          </p>
          {availableQuantity !== undefined && (
            <p className="text-xs text-red-500 mt-1 font-medium">
              Currently available: {availableQuantity}
            </p>
          )}
          <button
            onClick={onUpdateCart}
            className="mt-3 inline-flex items-center gap-2 bg-slate-950 text-white px-4 py-2 text-xs font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="size-3" />
            Update cart
          </button>
        </div>
      </div>
    </div>
  )
}
