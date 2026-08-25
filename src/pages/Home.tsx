import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product } from '../types/product.types'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { useAuthStore } from '../store/auth.store'
import { StoreNavbar } from '../components/StoreNavbar'
import { HeroSection } from '../components/HeroSection'
import { ProductToolbar } from '../components/ProductToolbar'
import { ProductGrid } from '../components/ProductGrid'
import { ProductGridSkeleton } from '../components/ProductSkeleton'
import { EmptyProducts } from '../components/EmptyProducts'
import { FloatingCart } from '../components/FloatingCart'
import { AlertTriangle } from 'lucide-react'

type FormState = {
  name: string
  description: string
  price: string
  stock: string
  imageUrl: string
  discountPrice: string
  discountTag: string
  isDiscounted: boolean
}

const emptyForm: FormState = {
  name: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
  discountPrice: '',
  discountTag: '',
  isDiscounted: false,
}

export function HomeUser() {
  const {
    products,
    loading,
    error,
  } = useProducts()

  const [search, setSearch] = useState('')
  const { addItem, cart } = useCart()
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'ADMIN'
  const navigate = useNavigate()
  const isGuest = !user

  const filtered = products.filter(
    (p: Product) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  const cartItems: Record<string, number> = {}
  if (cart?.items) {
    for (const item of cart.items) {
      cartItems[item.productId] = item.quantity
    }
  }

  function handleAddToCart(product: Product) {
    if (!user) {
      navigate('/login')
      return
    }
    if (product.stock <= 0) return
    try {
      addItem(product.id)
    } catch {
      console.error('Failed to add item to cart')
    }
  }

  const cartTotal = cart?.total ?? 0
  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  // ── Guest View ──────────────────────────────────────
  if (isGuest) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <StoreNavbar />
        <HeroSection isLoggedIn={false} onShopClick={() => navigate('/login')} />

        <main className="max-w-7xl mx-auto px-6 py-10">
          <ProductToolbar
            search={search}
            onSearchChange={setSearch}
            resultCount={filtered.length}
            totalCount={products.length}
          />

          {loading && <ProductGridSkeleton />}

          {error && (
            <div className="border-2 border-red-300 bg-red-50 p-6 text-center">
              <AlertTriangle className="size-8 text-red-400 mx-auto mb-3" />
              <p className="text-red-700 font-bold uppercase tracking-wide text-sm">
                Failed to load products
              </p>
              <p className="text-red-600 text-sm mt-1">{error.message}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <EmptyProducts isSearch={!!search} searchTerm={search} />
          )}

          {!loading && !error && filtered.length > 0 && (
            <ProductGrid products={filtered} />
          )}

          {/* Guest CTA */}
          <div className="mt-16 border-2 border-black bg-white shadow-[8px_8px_0px_0px_#000] p-10 text-center">
            <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-3">
              Sign in to shop
            </h2>
            <p className="text-stone-500 text-sm mb-6 max-w-md mx-auto">
              Create an account to start adding books to your cart and placing orders.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-black px-8 py-3 text-sm font-bold uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all"
              >
                Create account
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ── Customer View ───────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <StoreNavbar />
        <HeroSection isLoggedIn={true} onShopClick={() => {
          document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
        }} />

        <main className="max-w-7xl mx-auto px-6 py-10" id="collection">
          <ProductToolbar
            search={search}
            onSearchChange={setSearch}
            resultCount={filtered.length}
            totalCount={products.length}
          />

          {loading && <ProductGridSkeleton />}

          {error && (
            <div className="border-2 border-red-300 bg-red-50 p-6 text-center">
              <AlertTriangle className="size-8 text-red-400 mx-auto mb-3" />
              <p className="text-red-700 font-bold uppercase tracking-wide text-sm">
                Failed to load products
              </p>
              <p className="text-red-600 text-sm mt-1">{error.message}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <EmptyProducts isSearch={!!search} searchTerm={search} />
          )}

          {!loading && !error && filtered.length > 0 && (
            <ProductGrid
              products={filtered}
              onAddToCart={handleAddToCart}
              cartItems={cartItems}
            />
          )}
        </main>

        <FloatingCart
          itemCount={cartItemCount}
          total={cartTotal}
          onClick={() => navigate('/cart')}
        />
      </div>
    )
  }

  // ── Admin View ──────────────────────────────────────
  return <AdminDashboard />
}

// ── Admin Dashboard (separate component) ─────────────
function AdminDashboard() {
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    createLoading,
    updateLoading,
    deleteLoading,
  } = useProducts()

  const [search, setSearch] = useState('')
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editing, setEditing] = useState<Product | null>(null)
  const [message, setMessage] = useState('')
  const [adminSearch, setAdminSearch] = useState('')
  const { addItem, cart } = useCart()

  const filtered = products.filter(
    (p: Product) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  const adminFiltered = products.filter((p: Product) =>
    p.name.toLowerCase().includes(adminSearch.toLowerCase())
  )

  const cartItems: Record<string, number> = {}
  if (cart?.items) {
    for (const item of cart.items) {
      cartItems[item.productId] = item.quantity
    }
  }

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createProduct({
        name: form.name,
        description: form.description,
        imageUrl: form.imageUrl || 'https://via.placeholder.com/150',
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      })
      setForm(emptyForm)
      setMessage('Product created successfully.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to create product')
    }
  }

  function startEdit(product: Product) {
    setEditing(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl,
      discountPrice: product.discountPrice?.toString() ?? '',
      discountTag: product.discountTag ?? '',
      isDiscounted: product.isDiscounted ?? false,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    try {
      await updateProduct(editing.id, {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        imageUrl: form.imageUrl || 'https://via.placeholder.com/150',
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
        discountTag: form.discountTag || undefined,
        isDiscounted: !!form.discountPrice,
      })
      setEditing(null)
      setForm(emptyForm)
      setMessage('Product updated successfully.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to update product')
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await deleteProduct(id)
      setMessage(`"${name}" deleted.`)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to delete product')
    }
  }

  function handleAddToCart(product: Product) {
    if (product.stock <= 0) return
    try {
      addItem(product.id)
    } catch (err) {
      console.error('Failed to add item to cart:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <StoreNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-8">
          Admin Dashboard
        </h1>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Products', value: products.length },
            { label: 'Total Orders', value: '—' },
            { label: 'Revenue', value: '—' },
          ].map((m) => (
            <div
              key={m.label}
              className="border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000]"
            >
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">{m.label}</p>
              <p className="text-3xl font-black text-black mt-1">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Feedback message */}
        {message && (
          <div className="mb-6 border-2 border-green-300 bg-green-50 text-green-800 text-sm px-4 py-3 flex justify-between items-center">
            <span className="font-medium">{message}</span>
            <button
              onClick={() => setMessage('')}
              aria-label="Dismiss message"
              className="font-bold text-green-700 hover:text-green-900 ml-4"
            >
              ×
            </button>
          </div>
        )}

        {/* Create / Edit form */}
        <div className="border-2 border-black bg-white p-6 mb-10 shadow-[6px_6px_0px_0px_#000]">
          <h2 className="text-lg font-black uppercase tracking-wide text-black mb-4">
            {editing ? `Editing: ${editing.name}` : 'Add New Product'}
          </h2>

          <form
            onSubmit={editing ? handleUpdate : handleCreate}
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="form-name" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Name</label>
              <input
                id="form-name"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="form-desc" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Description</label>
              <input
                id="form-desc"
                name="description"
                value={form.description}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <div>
              <label htmlFor="form-price" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Price (KES)</label>
              <input
                id="form-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <div>
              <label htmlFor="form-stock" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Stock</label>
              <input
                id="form-stock"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="form-image" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Image URL</label>
              <input
                id="form-image"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="form-discount-price" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Discount Price (KES)</label>
              <input
                id="form-discount-price"
                name="discountPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.discountPrice}
                onChange={handleFormChange}
                placeholder="Optional"
                className="w-full px-3 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="form-discount-tag" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Discount Tag</label>
              <input
                id="form-discount-tag"
                name="discountTag"
                value={form.discountTag}
                onChange={handleFormChange}
                placeholder="e.g., Holiday Special (optional)"
                className="w-full px-3 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>

            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={createLoading || updateLoading}
                className="bg-black text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {editing
                  ? updateLoading ? 'Saving...' : 'Save Changes'
                  : createLoading ? 'Creating...' : 'Create Product'}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={() => { setEditing(null); setForm(emptyForm) }}
                  className="bg-white text-black px-6 py-2.5 text-sm font-bold uppercase tracking-wider border-2 border-black hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black uppercase tracking-wide text-black">All Products</h2>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
              className="px-4 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 w-64"
            />
          </div>

          {loading && <ProductGridSkeleton />}

          {error && (
            <div className="border-2 border-red-300 bg-red-50 p-6 text-center">
              <AlertTriangle className="size-8 text-red-400 mx-auto mb-3" />
              <p className="text-red-700 font-bold uppercase tracking-wide text-sm">Failed to load products</p>
              <p className="text-red-600 text-sm mt-1">{error.message}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <EmptyProducts isSearch={!!search} searchTerm={search} />
          )}

          {!loading && !error && filtered.length > 0 && (
            <ProductGrid
              products={filtered}
              onAddToCart={handleAddToCart}
              cartItems={cartItems}
              isAdmin
              onEdit={startEdit}
              onDelete={handleDelete}
              deleteLoading={deleteLoading}
            />
          )}
        </div>

        {/* CRUD list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black uppercase tracking-wide text-black">Manage Products</h2>
            <input
              type="text"
              placeholder="Search to update or delete..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              aria-label="Search products to manage"
              className="px-3 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 w-64"
            />
          </div>

          <div className="flex flex-col gap-2">
            {adminFiltered.map((product: Product) => (
              <div
                key={product.id}
                className="border-2 border-black bg-white px-5 py-4 flex items-center justify-between shadow-[3px_3px_0px_0px_#000]"
              >
                <div>
                  <p className="font-bold text-black">{product.name}</p>
                  <p className="text-stone-500 text-sm">
                    KES {product.price.toLocaleString()} · {product.stock} in stock
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    aria-label={`Edit ${product.name}`}
                    className="flex items-center gap-1 border-2 border-black px-4 py-1.5 text-sm font-bold hover:bg-yellow-300 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deleteLoading}
                    aria-label={`Delete ${product.name}`}
                    className="flex items-center gap-1 bg-red-50 border-2 border-red-300 text-red-700 px-4 py-1.5 text-sm font-bold hover:bg-red-100 disabled:opacity-40 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
