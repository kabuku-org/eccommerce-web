import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { useCart } from '../hooks/useCart'
import { ShoppingCart, LogOut, LayoutDashboard, Package, Users, Star } from 'lucide-react'

export function StoreNavbar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const isAdmin = user?.role === 'ADMIN'
  const { itemCount } = useCart()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          Kabuku
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Package className="size-4" />
            Products
          </Link>

          {user && (
            <>
              <Link
                to="/cart"
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative"
              >
                <ShoppingCart className="size-4" />
                Cart
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-slate-950 text-white text-[10px] font-semibold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>

              <Link
                to="/orders"
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Package className="size-4" />
                Orders
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
              <Link
                to="/admin/customers"
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Users className="size-4" />
                Customers
              </Link>
              <Link
                to="/admin/reviews"
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Star className="size-4" />
                Reviews
              </Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <span className="text-sm text-slate-500">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 pl-2 border-l border-slate-200 px-5 py-2 bg-slate-950 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
