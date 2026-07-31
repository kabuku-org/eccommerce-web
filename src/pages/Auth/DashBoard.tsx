import { useNavigate } from "react-router-dom"
import { useProducts } from "../../hooks/useProducts"
import { useAllOrders } from "../../hooks/useOrders"
import type { order } from "../../types/order.types"
import { useCustomers } from "../../hooks/useCustomers"
import {
  Package,
  ShoppingBag,
  UsersRound,
  DollarSign,
  TrendingUp,
  XCircle,
  Truck,
  CheckCircle,
  Clock,
} from "lucide-react"

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  onClick,
  color = "from-indigo-50 to-purple-50 text-indigo-600",
}: {
  icon: any
  label: string
  value: string | number
  trend?: string
  onClick?: () => void
  color?: string
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border border-stone-200/70 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-200/50 ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-stone-900">{value}</p>
          {trend && (
            <p className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
              <TrendingUp className="size-3" />
              {trend}
            </p>
          )}
        </div>
        <div
          className={`rounded-lg bg-gradient-to-br ${color} p-2.5 transition-transform duration-200 group-hover:scale-110`}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  )
}

function SimpleBarChart({ data, label }: { data: { label: string; value: number }[]; label: string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="rounded-xl border border-stone-200/70 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-stone-900 mb-4">{label}</h3>
      <div className="flex items-end gap-3 h-40">
        {data.map((item) => (
          <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-stone-500">{item.value}</span>
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-300 hover:from-indigo-400 hover:to-purple-400"
              style={{ height: `${Math.max((item.value / max) * 100, 4)}%` }}
            />
            <span className="text-[10px] text-stone-400 truncate w-full text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const { products } = useProducts()
  const { orders } = useAllOrders()
  const { customers } = useCustomers()

  const totalRevenue = products.reduce((sum, p) => sum + p.price * p.stock, 0)
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)

  const pendingOrders = orders.filter((o: order) => o.status === "pending").length
  const completedOrders = orders.filter((o: order) => o.status === "completed").length
  const shippedOrders = orders.filter((o: order) => o.status === "shipped").length
  const deliveredOrders = orders.filter((o: order) => o.status === "delivered").length
  const cancelledOrders = orders.filter((o: order) => o.status === "cancelled").length

  const chartData = [
    { label: "Pending", value: pendingOrders },
    { label: "Shipped", value: shippedOrders },
    { label: "Delivered", value: deliveredOrders },
    { label: "Completed", value: completedOrders },
    { label: "Cancelled", value: cancelledOrders },
  ]

  const orderStats = [
    { icon: Clock, label: "Pending Orders", value: pendingOrders, trend: "Awaiting processing", color: "from-yellow-50 to-amber-50 text-amber-600", onClick: () => navigate("/admin/orders?status=pending") },
    { icon: Truck, label: "Shipped Orders", value: shippedOrders, trend: "In transit", color: "from-blue-50 to-cyan-50 text-blue-600", onClick: () => navigate("/admin/orders?status=shipped") },
    { icon: CheckCircle, label: "Delivered Orders", value: deliveredOrders, trend: "Completed deliveries", color: "from-emerald-50 to-green-50 text-emerald-600", onClick: () => navigate("/admin/orders?status=delivered") },
    { icon: ShoppingBag, label: "Completed Orders", value: completedOrders, trend: "Last 30 days", color: "from-green-50 to-emerald-50 text-green-600", onClick: () => navigate("/admin/orders?status=completed") },
    { icon: XCircle, label: "Cancelled Orders", value: cancelledOrders, trend: "Last 30 days", color: "from-red-50 to-rose-50 text-red-600", onClick: () => navigate("/admin/orders?status=cancelled") },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
          <p className="text-sm text-stone-500 mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={products.length}
          trend="Active inventory"
          onClick={() => navigate("/admin/products")}
          color="from-indigo-50 to-purple-50 text-indigo-600"
        />
        {orderStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
        <StatCard
          icon={UsersRound}
          label="Total Customers"
          value={customers.length}
          trend="Active customers"
          onClick={() => navigate("/admin/customers")}
          color="from-sky-50 to-blue-50 text-sky-600"
        />
        <StatCard
          icon={DollarSign}
          label="Inventory Value"
          value={`KES ${totalRevenue.toLocaleString()}`}
          trend={`${totalStock} units in stock`}
          color="from-emerald-50 to-green-50 text-emerald-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Revenue"
          value="—"
          trend="Pending integration"
          color="from-violet-50 to-purple-50 text-violet-600"
        />
      </div>

      {/* Chart section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart data={chartData} label="Orders by Status" />
        <div className="rounded-xl border border-stone-200/70 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-stone-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/admin/products")}
              className="flex flex-col items-center gap-2 rounded-lg border border-stone-200 p-4 text-sm text-stone-700 hover:bg-stone-50 hover:border-indigo-200 transition-all"
            >
              <Package className="size-6 text-indigo-500" />
              <span>Manage Products</span>
            </button>
            <button
              onClick={() => navigate("/admin/orders")}
              className="flex flex-col items-center gap-2 rounded-lg border border-stone-200 p-4 text-sm text-stone-700 hover:bg-stone-50 hover:border-indigo-200 transition-all"
            >
              <ShoppingBag className="size-6 text-purple-500" />
              <span>View All Orders</span>
            </button>
            <button
              onClick={() => navigate("/admin/customers")}
              className="flex flex-col items-center gap-2 rounded-lg border border-stone-200 p-4 text-sm text-stone-700 hover:bg-stone-50 hover:border-indigo-200 transition-all"
            >
              <UsersRound className="size-6 text-sky-500" />
              <span>View Customers</span>
            </button>
            <button
              onClick={() => navigate("/admin/cancelled-orders")}
              className="flex flex-col items-center gap-2 rounded-lg border border-stone-200 p-4 text-sm text-stone-700 hover:bg-stone-50 hover:border-indigo-200 transition-all"
            >
              <XCircle className="size-6 text-rose-500" />
              <span>Cancelled Orders</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}