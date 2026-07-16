import { XCircle } from "lucide-react"

export function CancelledOrdersPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <XCircle className="size-6 text-red-500" />
        <h1 className="text-2xl font-semibold text-stone-900">
          Cancelled Orders
        </h1>
      </div>

      {/* TODO: Implement cancelled orders page with actual data when backend hook is ready */}
      <div className="bg-white border border-stone-200 rounded-lg p-8 text-center">
        <XCircle className="size-12 text-stone-300 mx-auto mb-4" />
        <p className="text-stone-500 text-sm">
          No cancelled orders to display yet.
        </p>
        <p className="text-stone-400 text-xs mt-1">
          This page will show orders marked as cancelled. Requires backend
          support for order cancellation status filtering.
        </p>
      </div>
    </div>
  )
}