import { ProductCard } from './ProductsCard'
import type { Product } from '../types/product.types'

type Props = {
  products: Product[]
  onAddToCart?: (product: Product) => void
  cartItems?: Record<string, number>
  isAdmin?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (id: string, name: string) => void
  deleteLoading?: boolean
}

export function ProductGrid({
  products,
  onAddToCart,
  cartItems = {},
  isAdmin,
  onEdit,
  onDelete,
  deleteLoading,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          inCartCount={cartItems[product.id] ?? 0}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
          deleteLoading={deleteLoading}
        />
      ))}
    </div>
  )
}
