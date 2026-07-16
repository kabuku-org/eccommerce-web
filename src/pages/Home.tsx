import { useState } from 'react'
import { ProductCard } from '../components/ProductsCard'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../types/product.types'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuthStore } from '../store/auth.store'

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
    createProduct,
    updateProduct,
    deleteProduct,
    createLoading,
    updateLoading,
    deleteLoading,
  } = useProducts()

  const [search, setSearch] = useState('')
  const { addItem } = useCart()
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'ADMIN'
  const navigate = useNavigate()

  // ── Admin-only state ────────────────────────────────
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editing, setEditing] = useState<Product | null>(null)
  const [message, setMessage] = useState('')
  const [adminSearch, setAdminSearch] = useState('')

  // filter client-side by name or description
  const filtered = products.filter(
    (p: Product) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  // admin filtered list (for the CRUD list below the grid)
  const adminFiltered = products.filter((p: Product) =>
    p.name.toLowerCase().includes(adminSearch.toLowerCase())
  )

  function handleAddToCart(product: Product) {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      addItem(product.id)
    } catch (error) {
      console.error('Failed to add item to cart:', error)
    }
  }

  // ── Admin form handlers ─────────────────────────────
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
    } catch (err: any) {
      setMessage(err.message)
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
        isDiscounted: form.discountPrice ? true : false,
      })
      setEditing(null)
      setForm(emptyForm)
      setMessage('Product updated successfully.')
    } catch (err: any) {
      setMessage(err.message)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await deleteProduct(id)
      setMessage(`"${name}" deleted.`)
    } catch (err: any) {
      setMessage(err.message)
    }
  }

  // ── Product grid (shared by both views) ─────────────
  function ProductGrid({ list }: { list: Product[] }) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {list.map((product: Product) => (
          <div key={product.id} className="relative">
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
            />

            {/* Admin overlay buttons on each card */}
            {isAdmin && (
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => startEdit(product)}
                  className="bg-white border border-stone-300 text-stone-700 px-2 py-1 rounded text-xs hover:bg-stone-50 shadow-sm transition-colors"
                  title="Edit product"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  disabled={deleteLoading}
                  className="bg-white border border-red-200 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-50 shadow-sm disabled:opacity-50 transition-colors"
                  title="Delete product"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // ── Admin Dashboard View ────────────────────────────
  function AdminDashboard() {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-stone-900 mb-8">
          Admin Dashboard
        </h1>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Products', value: products.length },
            { label: 'Total Orders', value: '—' },
            { label: 'Revenue', value: '—' },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-white border border-stone-200 rounded-lg p-5"
            >
              <p className="text-stone-500 text-sm">{m.label}</p>
              <p className="text-2xl font-semibold text-stone-900 mt-1">
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* Feedback message */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-md flex justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="font-bold">
              ×
            </button>
          </div>
        )}

        {/* Create / Edit form */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 mb-10">
          <h2 className="text-base font-semibold text-stone-900 mb-4">
            {editing ? `Editing: ${editing.name}` : 'Add New Product'}
          </h2>

          <form
            onSubmit={editing ? handleUpdate : handleCreate}
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm text-stone-600 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm text-stone-600 mb-1">
                Description
              </label>
              <input
                name="description"
                value={form.description}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block text-sm text-stone-600 mb-1">
                Price (KES)
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block text-sm text-stone-600 mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm text-stone-600 mb-1">
                Image URL
              </label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm text-stone-600 mb-1">
                Discount Price (KES)
              </label>
              <input
                name="discountPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.discountPrice}
                onChange={handleFormChange}
                placeholder="Only for updating products"
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-stone-600 mb-1">
                Discount Tag
              </label>
              <input
                name="discountTag"
                value={form.discountTag}
                onChange={handleFormChange}
                placeholder="e.g., Holiday Special, Black Friday (optional)"
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={createLoading || updateLoading}
                className="bg-stone-900 text-white px-6 py-2 rounded-md text-sm hover:bg-stone-800 disabled:opacity-50"
              >
                {editing
                  ? updateLoading
                    ? 'Saving...'
                    : 'Save Changes'
                  : createLoading
                  ? 'Creating...'
                  : 'Create Product'}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null)
                    setForm(emptyForm)
                  }}
                  className="border border-stone-300 text-stone-700 px-6 py-2 rounded-md text-sm hover:bg-stone-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product grid with search — admin can shop + edit/delete */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-stone-900">
              All Products
            </h2>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 w-64"
            />
          </div>

          {loading && (
            <p className="text-stone-500 text-center py-20">
              Loading products...
            </p>
          )}

          {error && (
            <p className="text-red-600 text-center py-20">
              Failed to load products. Is the backend running? {error.message}
            </p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-stone-400 text-center py-20">
              {search ? 'No products match your search.' : 'No products yet.'}
            </p>
          )}

          {!loading && !error && filtered.length > 0 && (
            <ProductGrid list={filtered} />
          )}
        </div>

        {/* CRUD list with separate search for update/delete */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-stone-900">
              Manage Products
            </h2>
            <input
              type="text"
              placeholder="Search to update or delete..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 w-64"
            />
          </div>

          <div className="flex flex-col gap-3">
            {adminFiltered.map((product: Product) => (
              <div
                key={product.id}
                className="bg-white border border-stone-200 rounded-lg px-5 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-stone-900">{product.name}</p>
                  <p className="text-stone-500 text-sm">
                    KES {product.price.toLocaleString()} · {product.stock} in
                    stock
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="border border-stone-300 text-stone-700 px-4 py-1.5 rounded text-sm hover:bg-stone-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deleteLoading}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-1.5 rounded text-sm hover:bg-red-100 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  // ── Customer Product Grid View ──────────────────────
  function CustomerView() {
    return (
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
            Failed to load products. Is the backend running? {error.message}
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-stone-400 text-center py-20">
            {search ? 'No products match your search.' : 'No products yet.'}
          </p>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <ProductGrid list={filtered} />
        )}
      </main>
    )
  }

  return (
    <div className="min-h-screen">
      {isAdmin ? <AdminDashboard /> : <CustomerView />}
    </div>
  )
}