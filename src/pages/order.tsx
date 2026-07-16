import { useOrders } from "../hooks/useOrders";
import type { order } from "../types/order.types";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

// Helper to normalize status for styling
function getOrderStatus(order: order): string {
  return order.status?.toUpperCase() ?? 'PENDING'
}

export function Order() {
  const {  loading, error , orders , cancelOrder , cancelLoading} = useOrders();
 const { checkoutLoading , checkoutError , checkoutOrder}= useOrders()
  if (loading) {
    return (
      <div className="min-h-screen">
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h1 className="text-xl font-semibold text-stone-900 mb-2">
            Loading your orders...
          </h1>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h1 className="text-xl font-semibold text-stone-900 mb-2">
            Error loading your orders.
          </h1>
        </main>
      </div>
    );
  }

    return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-stone-900 mb-8">My Orders</h1>

        {orders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-stone-500">You have no orders yet.</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order: order) => {
            const statusUpper = getOrderStatus(order)
            return (
              <div
                key={order.id}
                className="bg-white border border-stone-200 rounded-lg p-5"
              >
                {/* Order header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-stone-400 text-xs font-mono">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-stone-500 text-xs mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-KE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      statusStyles[statusUpper] ?? 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-1 mb-4">
                  {order.cart.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-stone-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-stone-500">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total + cancel */}
                <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                  <span className="font-semibold text-stone-900 text-sm">
                    KES {order.totalAmount.toLocaleString()}
                  </span>

                  {statusUpper === 'PENDING' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      disabled={cancelLoading}
                      className="text-red-500 hover:text-red-700 text-xs disabled:opacity-50 transition-colors"
                    >
                      {cancelLoading ? 'Cancelling...' : 'Cancel order'}
                    </button>
                  )}

                  {statusUpper === 'PENDING' && (
                    <button
                      onClick={() => checkoutOrder(order.id)}
                      disabled={checkoutLoading}
                      className="text-green-500 hover:text-green-700 text-xs disabled:opacity-50 transition-colors"
                    >
                      {checkoutLoading ? 'Checking out...' : 'Checkout order'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}