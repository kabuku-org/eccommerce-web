import { useAuthStore } from "../../store/auth.store"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { AppSidebar } from "../../components/AppSidebar"

export default function ProtectedRoutes() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    if (!token) {
      navigate("/")
    }
  }, [token, navigate])

  return token ? (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-h-svh overflow-hidden peer-data-[state=collapsed]:ml-[var(--sidebar-width-icon)] peer-data-[state=expanded]:ml-[var(--sidebar-width)] transition-[margin] duration-200 ease-linear">
        <header className="flex items-center h-12 px-3 border-b border-stone-200/60 dark:border-stone-800/60 bg-white/70 dark:bg-stone-950/70 backdrop-blur-sm sticky top-0 z-30 shrink-0">
          <SidebarTrigger className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100" />
          <div className="ml-auto" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  ) : null
}