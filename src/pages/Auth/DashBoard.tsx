import { useState } from "react"
import { useProducts } from "../../hooks/useProducts"
import type { Product } from "../../types/product.types"
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
} from "lucide-react"

type FormState = {
  name: string
  description: string
  price: string
  stock: string
  imageUrl: string
}

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: any
  label: string
  value: string | number
  trend?: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-stone-200/70 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-200/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-stone-900">{value}</p>
          {trend && (
            <p className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
              <TrendingUp className="size-3" />
              {trend}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 p-2.5 text-indigo-600 transition-transform duration-200 group-hover:scale-110">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    createLoading,
    updateLoading,
    deleteLoading,
  } = useProducts()

  const [form, setForm] = useState<FormState>(emptyForm)
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<Product | null>(null)
  const [message, setMessage] = useState("")
  const [showForm, setShowForm] = useState(false)

  const filtered = products.filter((p: Product) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

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
        imageUrl: form.imageUrl || "https://via.placeholder.com/150",
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      })
      setForm(emptyForm)
      setMessage("Product created successfully.")
      setShowForm(false)
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
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
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
        imageUrl: form.imageUrl || "https://via.placeholder.com/150",
      })
      setEditing(null)
      setForm(emptyForm)
      setMessage("Product updated successfully.")
      setShowForm(false)
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

  const totalRevenue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  )
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
          <p className="text-sm text-stone-500 mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditing(null)
            setForm(emptyForm)
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:from-indigo-500 hover:to-purple-500 transition-all duration-200"
        >
          <Plus className="size-4" />
          Add Product
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={products.length}
          trend="Active inventory"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value="—"
          trend="Last 30 days"
        />
        <StatCard
          icon={DollarSign}
          label="Inventory Value"
          value={`KES ${totalRevenue.toLocaleString()}`}
          trend={`${totalStock} units in stock`}
        />
        <StatCard
          icon={TrendingUp}
          label="Revenue"
          value="—"
          trend="Pending integration"
        />
      </div>

      {/* Feedback message */}
      {message && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="font-bold">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <div className="rounded-xl border border-stone-200/70 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-stone-900 mb-1">
            {editing ? `Editing: ${editing.name}` : "Add New Product"}
          </h2>
          <p className="text-sm text-stone-500 mb-5">
            {editing
              ? "Update the product details below."
              : "Fill in the details to add a new product to your store."}
          </p>

          <form
            onSubmit={editing ? handleUpdate : handleCreate}
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Description
              </label>
              <input
                name="description"
                value={form.description}
                onChange={handleFormChange}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
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
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Stock
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleFormChange}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Image URL
              </label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            <div className="col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                disabled={createLoading || updateLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50"
              >
                {editing
                  ? updateLoading
                    ? "Saving..."
                    : "Save Changes"
                  : createLoading
                  ? "Creating..."
                  : "Create Product"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditing(null)
                  setForm(emptyForm)
                  setShowForm(false)
                }}
                className="rounded-lg border border-stone-300 text-stone-700 px-5 py-2.5 text-sm font-medium hover:bg-stone-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-stone-900">
            All Products
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-lg border border-stone-300 pl-9 pr-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-8 text-stone-500 text-sm">
            Loading products...
          </div>
        )}

        <div className="flex flex-col gap-3">
          {filtered.map((product: Product) => (
            <div
              key={product.id}
              className="group rounded-xl border border-stone-200/70 bg-white px-5 py-4 flex items-center justify-between shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-200/50"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <Package className="size-5 text-stone-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-stone-900">{product.name}</p>
                  <p className="text-sm text-stone-500">
                    KES {product.price.toLocaleString()} · {product.stock} in
                    stock
                  </p>
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => startEdit(product)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 text-stone-700 px-3 py-1.5 text-sm hover:bg-stone-50 hover:border-indigo-300 transition-all"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  disabled={deleteLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 text-red-600 px-3 py-1.5 text-sm hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-stone-400">
              <Package className="size-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}