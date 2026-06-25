import { Link , useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export function NavBar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
      {/* Left — brand */}
      <Link to="/home" className="font-semibold text-lg tracking-tight">
        Bookstore
      </Link>

      {/* Right — links */}
      <div className="flex items-center gap-6 text-sm">
        <Link to="/home" className="hover:text-stone-300 transition-colors">
          Products
        </Link>

        <Link to="/cart" className="hover:text-stone-300 transition-colors">
          Cart
        </Link>

        {/* Only admin see dashboard link */}
        {user?.role === 'ADMIN' ? (
          <Link
            to="/dashboard"
            className="hover:text-stone-300 transition-colors"
          >
            Dashboard
          </Link>
        ) : null}

        {/* User info + logout */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-stone-400">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-stone-700 hover:bg-stone-600 px-3 py-1 rounded text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="hover:text-stone-300">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}