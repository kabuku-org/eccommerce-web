import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Star,
  XCircle,
  Settings,
  LogOut,
  ChevronUp,
  Store,
  Home,
  BadgeInfo,
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useAuthStore } from "../store/auth.store"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"
//cart number count
import { useCart } from "../hooks/useCart"
// Items visible to both CUSTOMER and ADMIN
const commonNavItems = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Cart",
    url: "/cart",
    icon: ShoppingCart,
  },
  {
    title: "My Orders",
    url: "/orders",
    icon: Package,
  },
]

// Items only visible to ADMIN
const adminNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "All Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Reviewed Orders",
    url: "/admin/reviews",
    icon: Star,
  },
  {
    title: "Cancelled Orders",
    url: "/admin/cancelled-orders",
    icon: XCircle,
  },
  {
    title: "All Customers",
    url: "/admin/customers",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === "ADMIN"

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const isActive = (url: string) => location.pathname === url
  const cartItemCount = useCart().itemCount || 0
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/40 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-sidebar-accent/50 transition-all duration-200"
            >
              <Link to={isAdmin ? "/dashboard" : "/home"}>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex aspect-square size-8 items-center justify-center rounded-lg shadow-sm">
                  <Store className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">
                    Kabuku
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    {isAdmin ? "Admin Dashboard" : "Shop"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {/* Shopping section — everyone sees this */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Shopping
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {commonNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-indigo-500/10 data-[active=true]:to-purple-500/10 data-[active=true]:border-r-2 data-[active=true]:border-indigo-500"
                  >
                    <Link to={item.url}>
                      <item.icon className="size-4 shrink-0" />
                      <span>{item.title}</span>


                      {item.title === "Cart" && cartItemCount > 0 && (
                        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin section — only ADMIN role sees this */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                      className="transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-indigo-500/10 data-[active=true]:to-purple-500/10 data-[active=true]:border-r-2 data-[active=true]:border-indigo-500"
                    >
                      <Link to={item.url}>
                        <item.icon className="size-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/40 pt-3">
        {/* User badge */}
        <SidebarMenu className="gap-0.5 mb-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={`${user?.name} (${user?.role})`}
              className="cursor-default text-sidebar-foreground/60"
            >
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-medium text-sidebar-foreground/80">
                    {user?.name || "User"}
                  </span>
                  <span className="truncate text-sidebar-foreground/40">
                    {user?.role === "ADMIN" ? "Administrator" : "Customer"}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu className="gap-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Logout"
              className="text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
            >
              <button
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="size-4 shrink-0" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}