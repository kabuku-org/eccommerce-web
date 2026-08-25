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
    <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="font-black text-xl uppercase tracking-tight text-black border-2 border-black px-3 py-1 bg-yellow-300 hover:bg-yellow-200 transition-colors"
        >
          Bookstore
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black hover:bg-stone-100 transition-colors"
          >
            <Package className="size-3.5" />
            Products
          </Link>

          {user && (
            <>
              <Link
                to="/cart"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black hover:bg-stone-100 transition-colors relative"
              >
                <ShoppingCart className="size-3.5" />
                Cart
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center border border-red-700">
                    {itemCount}
                  </span>
                )}
              </Link>

              <Link
                to="/orders"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black hover:bg-stone-100 transition-colors"
              >
                <Package className="size-3.5" />
                Orders
              </Link>
            </>
          )}

          {/* Admin links */}
          {isAdmin && (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black hover:bg-stone-100 transition-colors"
              >
                <LayoutDashboard className="size-3.5" />
                Dashboard
              </Link>
              <Link
                to="/admin/customers"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black hover:bg-stone-100 transition-colors"
              >
                <Users className="size-3.5" />
                Customers
              </Link>
              <Link
                to="/admin/reviews"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-black hover:bg-stone-100 transition-colors"
              >
                <Star className="size-3.5" />
                Reviews
              </Link>
            </>
          )}

          {/* User info + logout */}
          {user ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-stone-200">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 pl-2 border-l border-stone-200 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
