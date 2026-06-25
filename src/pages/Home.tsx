import { useState } from 'react'
import { NavBar } from '../components/NavBar'
import { ProductCard } from '../components/ProductsCard'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../types/product.types'

export function Home() {
  const { products, loading, error } = useProducts()
  const [search, setSearch] = useState('')

  // filter client-side by name or description
  const filtered = products.filter(
    (p: Product) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  function handleAddToCart(product: Product) {
    // placeholder — cart implementation comes next phase
    alert(`Added "${product.name}" to cart — cart coming soon!`)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-stone-900">Products</h1>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 w-64"
          />
        </div>

        {/* States */}
        {loading && (
          <p className="text-stone-500 text-center py-20">
            Loading products...
          </p>
        )}

        {error && (
          <p className="text-red-600 text-center py-20">
            Failed to load products. Is the backend running?
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-stone-400 text-center py-20">
            {search ? 'No products match your search.' : 'No products yet.'}
          </p>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}