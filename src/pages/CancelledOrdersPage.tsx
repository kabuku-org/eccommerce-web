import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { useAllOrders } from "../hooks/useOrders"
import type { order, OrderStatus } from "../types/order.types"
import { STATUS_STYLES, ORDER_STATUSES } from "../types/order.types"
import {  Package } from "lucide-react"

export function CancelledOrdersPage() {
  const { orders, loading } = useAllOrders()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeStatus = (searchParams.get("status") ?? "all") as OrderStatus | "all"

  const setStatus = (status: OrderStatus | "all") => {
    if (status === "all") {
      setSearchParams({})
    } else {
      setSearchParams({ status })
    }
  }

  const statusCounts = useMemo(
    () =>
      ORDER_STATUSES.reduce(
        (acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }),
        {} as Record<string, number>
      ),
    [orders]
  )

  const filteredOrders = useMemo(
    () =>
      activeStatus === "all"
        ? orders
        : orders.filter((o: order) => o.status === activeStatus),
    [orders, activeStatus]
  )

  const tabs: { label: string; value: OrderStatus | "all"; count: number }[] = [
    { label: "All", value: "all", count: orders.length },
    ...ORDER_STATUSES.map((s) => ({
      label: s.charAt(0).toUpperCase() + s.slice(1),
      value: s as OrderStatus | "all",
      count: statusCounts[s],
    })),
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="size-6 text-indigo-500" />
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">
            All Orders
          </h1>
          <p className="text-sm text-stone-500">
            {orders.length} total orders in the system
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
              activeStatus === tab.value
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12 text-stone-500 text-sm">
          Loading orders...
        </div>
      )}

      {!loading && filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <Package className="size-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 text-sm">
            {activeStatus === "all"
              ? "No orders found."
              : `No ${activeStatus} orders found.`}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {filteredOrders.map((order: order) => (
          <div
            key={order.id}
            className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-stone-400 text-xs font-mono">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <span className="text-[10px] text-stone-400">
                    User: {order.userId.slice(-6)}
                  </span>
                </div>
                <p className="text-stone-500 text-xs mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
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
            <div className="space-y-1 mb-3">
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

            <div className="flex items-center justify-between border-t border-stone-100 pt-3">
              <span className="font-semibold text-stone-900 text-sm">
                KES {order.totalAmount.toLocaleString()}
              </span>
              <div className="flex gap-2 text-xs text-stone-400">
                {order.deliveryAddress && (
                  <span className="truncate max-w-[180px]">
                    📍 {order.deliveryAddress}
                  </span>
                )}
                {order.pickupLocation && !order.deliveryAddress && (
                  <span className="truncate max-w-[180px]">
                    📍 Pickup: {order.pickupLocation}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}