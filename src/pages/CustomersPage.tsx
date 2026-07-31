import { useState, useMemo } from "react"
import { useCustomers } from "../hooks/useCustomers"
import { useAllOrders } from "../hooks/useOrders"
import { useAuthStore } from "../store/auth.store"
import type { order, OrderStatus } from "../types/order.types"
import { STATUS_STYLES, ORDER_STATUSES } from "../types/order.types"
import { UsersRound,  ChevronDown, ChevronUp } from "lucide-react"

type CustomerType = {
  id: string
  name: string
  email: string
  role: string
}

export function CustomersPage() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === "ADMIN"

  const { customers, loading, error } = useCustomers()
  const { orders } = useAllOrders()

  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null)

  // Build a map: userId → orders[]
  const ordersByUser = useMemo(() => {
    const map = new Map<string, order[]>()
    for (const order of orders) {
      const existing = map.get(order.userId) ?? []
      existing.push(order)
      map.set(order.userId, existing)
    }
    return map
  }, [orders])

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold text-stone-900 mb-4">
            Access Denied
          </h1>
          <p className="text-stone-600">
            Only admin users can view customers.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UsersRound className="size-6 text-indigo-500" />
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Customers</h1>
          <p className="text-sm text-stone-500">
            {customers.length} total customers · {orders.length} total orders
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-stone-500 text-center py-12">Loading customers...</p>
      )}

      {error && (
        <p className="text-red-600 text-center py-12">
          Failed to load customers. {error.message}
        </p>
      )}

      {!loading && !error && customers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">👥</p>
          <p className="text-stone-500">No customers yet.</p>
        </div>
      )}

      {!loading && !error && customers.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-medium text-stone-600">Name</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-stone-600">Email</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-stone-600">Role</th>
                <th className="text-center px-5 py-3 text-sm font-medium text-stone-600">Orders</th>
                <th className="text-right px-5 py-3 text-sm font-medium text-stone-600" />
              </tr>
            </thead>
            <tbody>
              {customers.map((customer: CustomerType) => {
                const customerOrders = ordersByUser.get(customer.id) ?? []
                const isExpanded = expandedCustomer === customer.id

                // Filter orders by status if a filter is active
                const filteredCustomerOrders =
                  statusFilter === "all"
                    ? customerOrders
                    : customerOrders.filter((o) => o.status === statusFilter)

                return (
                  <tr key={customer.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-5 py-4 text-sm font-medium text-stone-900">
                      {customer.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-stone-600">
                      {customer.email}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-center text-stone-600">
                      {customerOrders.length}
                    </td>
                    <td className="px-5 py-4 text-sm text-right">
                      {customerOrders.length > 0 && (
                        <button
                          onClick={() =>
                            setExpandedCustomer(isExpanded ? null : customer.id)
                          }
                          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                        >
                          {isExpanded ? (
                            <>Hide Orders <ChevronUp className="size-3" /></>
                          ) : (
                            <>View Orders <ChevronDown className="size-3" /></>
                          )}
                        </button>
                      )}
                    </td>

                    {/* Expanded orders row */}
                    {isExpanded && (
                      <tr key={`${customer.id}-orders`}>
                        <td colSpan={5} className="px-5 pb-4">
                          <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs font-semibold text-stone-700">
                                Orders ({filteredCustomerOrders.length})
                              </p>
                              {/* Quick status filter for this customer's orders */}
                              <div className="flex gap-1.5">
                                {(["all", ...ORDER_STATUSES] as const).map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`px-2 py-0.5 text-[10px] rounded-full transition-all ${
                                      statusFilter === s
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white text-stone-500 hover:bg-stone-100 border border-stone-200"
                                    }`}
                                  >
                                    {s === "all" ? "All" : s}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {filteredCustomerOrders.length === 0 && (
                              <p className="text-xs text-stone-400 text-center py-4">
                                No {statusFilter === "all" ? "" : `${statusFilter} `}orders found.
                              </p>
                            )}

                            <div className="space-y-2 max-h-80 overflow-y-auto">
                              {filteredCustomerOrders.map((order) => (
                                <div
                                  key={order.id}
                                  className="bg-white rounded-lg border border-stone-200 p-3"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-mono text-stone-400">
                                      #{order.id.slice(-8).toUpperCase()}
                                    </span>
                                    <span
                                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                        STATUS_STYLES[order.status] ?? "bg-stone-100 text-stone-500"
                                      }`}
                                    >
                                      {order.status}
                                    </span>
                                  </div>
                                  <div className="text-xs text-stone-500 space-y-0.5">
                                    {order.cart.map((item, i) => (
                                      <div key={i} className="flex justify-between">
                                        <span>
                                          {item.name} × {item.quantity}
                                        </span>
                                        <span>
                                          KES {(item.price * item.quantity).toLocaleString()}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                                    <span className="text-xs font-semibold text-stone-800">
                                      KES {order.totalAmount.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-stone-400">
                                      {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {(order.deliveryAddress || order.pickupLocation) && (
                                    <div className="text-[10px] text-stone-400 mt-1">
                                      {order.deliveryAddress
                                        ? `📍 ${order.deliveryAddress}`
                                        : `📍 Pickup: ${order.pickupLocation}`}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}