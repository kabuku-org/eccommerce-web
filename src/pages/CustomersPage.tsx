import { useCustomers } from "../hooks/useCustomers";
import { useAuthStore } from "../store/auth.store";

type Customer = {
  id: string
  name: string
  email: string
  role: string
}

export function CustomersPage() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'ADMIN'
  
  const { customers, loading, error } = useCustomers()

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
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-stone-900 mb-8">Customers</h1>

        {loading && (
          <p className="text-stone-500 text-center py-20">
            Loading customers...
          </p>
        )}

        {error && (
          <p className="text-red-600 text-center py-20">
            Failed to load customers. {error.message}
          </p>
        )}

        {!loading && !error && customers.length === 0 && (
          <div className="text-center py-20">
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
                </tr>
              </thead>
              <tbody>
                {customers.map((customer: Customer) => (
                  <tr key={customer.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}