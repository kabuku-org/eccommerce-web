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
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/50 dark:from-stone-950 dark:to-stone-900">
        <div className="flex items-center h-12 px-3 border-b border-stone-200/60 dark:border-stone-800/60 bg-white/50 dark:bg-stone-950/50 backdrop-blur-sm sticky top-0 z-20">
          <SidebarTrigger className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100" />
          <div className="ml-auto" />
        </div>
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  ) : null
}