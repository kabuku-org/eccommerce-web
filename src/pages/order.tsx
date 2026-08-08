import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useOrders } from "../hooks/useOrders"
import type { order, OrderStatus } from "../types/order.types"
import { STATUS_STYLES, ORDER_STATUSES } from "../types/order.types"
import { useCart } from "../hooks/useCart"
import { CheckoutSheet } from "../components/CheckoutSheet"
import { CreditCard, ShoppingCart, ArrowRight } from "lucide-react"

export function Order() {
  const navigate = useNavigate()
  const { loading, error, orders, cancelOrder, cancelLoading, checkoutOrder, checkoutLoading } = useOrders()
  const { cart, itemCount } = useCart()
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [checkoutOrderId, setCheckoutOrderId] = useState<string | null>(null)

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
    )
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
    )
  }

  const statusCounts = ORDER_STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }),
    {} as Record<string, number>
  )

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o: order) => o.status === statusFilter)

  const tabs: { label: string; value: OrderStatus | "all"; count: number }[] = [
    { label: "All", value: "all", count: orders.length },
    ...ORDER_STATUSES.map((s) => ({
      label: s.charAt(0).toUpperCase() + s.slice(1),
      value: s as OrderStatus | "all",
      count: statusCounts[s],
    })),
  ]

  const activeCheckoutOrder = checkoutOrderId
    ? orders.find((o: order) => o.id === checkoutOrderId)
    : null

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-900">My Orders</h1>
          {cart && itemCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-sm text-stone-500">
              <ShoppingCart className="size-4" />
              {itemCount} {itemCount === 1 ? "item" : "items"} in cart
            </span>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Orders list */}
          <div className="flex-1 min-w-0">
            {/* Status filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                    statusFilter === tab.value
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">📦</p>
                <p className="text-stone-500">
                  {statusFilter === "all"
                    ? "You have no orders yet."
                    : `No ${statusFilter} orders found.`}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {filteredOrders.map((order: order) => {
                return (
                  <div
                    key={order.id}
                    className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Order header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-stone-400 text-xs font-mono">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-stone-500 text-xs mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-KE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          STATUS_STYLES[order.status] ?? "bg-stone-100 text-stone-500"
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

                    {/* Total + actions */}
                    <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                      <span className="font-bold text-stone-900 text-sm">
                        KES {order.totalAmount.toLocaleString()}
                      </span>

                      <div className="flex gap-2">
                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() => cancelOrder(order.id)}
                              disabled={cancelLoading}
                              className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50 transition-colors"
                            >
                              {cancelLoading ? "Cancelling..." : "Cancel"}
                            </button>
                            <button
                              onClick={() => setCheckoutOrderId(order.id)}
                              disabled={checkoutLoading}
                              className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-xs font-bold disabled:opacity-50 transition-colors"
                            >
                              <CreditCard className="size-3" />
                              {checkoutLoading ? "Checking out..." : "Checkout"}
                            </button>
                          </>
                        )}
                        {order.deliveryAddress && (
                          <span className="text-xs text-stone-400 truncate max-w-[150px]">
                            📍 {order.deliveryAddress}
                          </span>
                        )}
                        {order.pickupLocation && !order.deliveryAddress && (
                          <span className="text-xs text-stone-400 truncate max-w-[150px]">
                            📍 Pickup: {order.pickupLocation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cart summary sidebar */}
          {cart && itemCount > 0 && (
            <aside className="lg:w-80 shrink-0">
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm lg:sticky lg:top-20">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="size-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-stone-900">Your Cart</h2>
                </div>

                <div className="space-y-2 mb-4">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-stone-600 truncate">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-stone-500 font-medium">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-200 pt-3 mb-4 flex justify-between items-center">
                  <span className="font-bold text-stone-900">Total</span>
                  <span className="text-xl font-extrabold text-stone-900">
                    KES {cart.total.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/cart")}
                  className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <ShoppingCart className="size-4" />
                  Go to Cart
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* Checkout slide panel */}
      {activeCheckoutOrder && (
        <CheckoutSheet
          order={activeCheckoutOrder}
          onClose={() => setCheckoutOrderId(null)}
          onCheckout={(deliveryAddress, pickupLocation) => {
            checkoutOrder(activeCheckoutOrder.id, deliveryAddress, pickupLocation)
          }}
          checkoutLoading={checkoutLoading}
        />
      )}
    </div>
  )
}