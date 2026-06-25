import { Navbar } from '../components/Navbar'

export function Cart() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="text-xl font-semibold text-stone-900 mb-2">
          Your cart is empty
        </h1>
        <p className="text-stone-500 text-sm">
          Cart functionality coming soon. Browse products and add them here.
        </p>
      </main>
    </div>
  )
}