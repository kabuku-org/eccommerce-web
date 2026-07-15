import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const icons = {
  dashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="10" rx="1" />
      <rect width="7" height="5" x="3" y="15" rx="1" />
    </svg>
  ),
  products: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-8-5a2 2 0 0 0-2 0l-8 5A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l8 5a2 2 0 0 0 2 0l8-5A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" x2="12" y1="22.08" y2="12" />
    </svg>
  ),
  orders: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.45a2 2 0 0 0 2 1.55h9.78a2 2 0 0 0 2-1.55L21.95 2.05H5.09" />
      <path d="M17.27 6H6.73" />
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.78.78l-.08.15a2 2 0 0 0 .78 2.78l.25.43a2 2 0 0 1 0 2 2 2 0 0 0-.78 2.78l.08.15a2 2 0 0 0 2.78.78l.15-.08a2 2 0 0 1 2 0l.25.43a2 2 0 0 0 0 2 2 2 0 0 1 1.73 1H22a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2h-.18a2 2 0 0 1-1.73-1 2 2 0 0 1 0-2 2 2 0 0 0 .78-2.78l-.08-.15a2 2 0 0 0-2.78-.78l-.15.08a2 2 0 0 1-2 0l-.25-.43a2 2 0 0 0 0-2 2 2 0 0 1-1.73-1V4a2 2 0 0 0-2-2z" />
      <circle cx="7" cy="7" r="1" />
    </svg>
  ),
  chevronLeft: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  chevronRight: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  chart: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  ),
}

type SideBarProps = {
  onToggle?: (collapsed: boolean) => void
}

export function SideBar({ onToggle }: SideBarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: icons.dashboard },
    { path: '/home', label: 'Products', icon: icons.products },
    { path: '/orders', label: 'Orders', icon: icons.orders },
    { path: '/settings', label: 'Settings', icon: icons.settings },
  ]

  const handleToggle = () => {
    const newState = !collapsed
    setCollapsed(newState)
    onToggle?.(newState)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <aside
      className={`bg-stone-900 text-white h-screen transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } flex flex-col`}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-4 border-b border-stone-700">
        {!collapsed && (
          <span className="font-semibold text-lg tracking-tight">Admin</span>
        )}
        <button
          onClick={handleToggle}
          className="p-1.5 rounded-md hover:bg-stone-800 transition-colors"
        >
          {collapsed ? icons.chevronRight : icons.chevronLeft}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-stone-700 text-white'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer with metrics preview */}
      {!collapsed && (
        <div className="p-4 border-t border-stone-700">
          <div className="flex items-center gap-2 text-stone-400">
            {icons.chart}
            <span className="text-sm">Admin Panel</span>
          </div>
        </div>
      )}
    </aside>
  )
}