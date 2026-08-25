import { AlertTriangle, RefreshCw } from 'lucide-react'

type Props = {
  message: string
  availableQuantity?: number
  onUpdateCart: () => void
}

export function CheckoutStockError({ message, availableQuantity, onUpdateCart }: Props) {
  return (
    <div className="border-2 border-red-300 bg-red-50 p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="size-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-red-800 uppercase tracking-wide">
            Stock changed
          </p>
          <p className="text-sm text-red-700 mt-1">
            {message}
          </p>
          {availableQuantity !== undefined && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              Currently available: {availableQuantity}
            </p>
          )}
          <button
            onClick={onUpdateCart}
            className="mt-3 inline-flex items-center gap-2 bg-red-800 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 border-red-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)] transition-all"
          >
            <RefreshCw className="size-3" />
            Update cart
          </button>
        </div>
      </div>
    </div>
  )
}
