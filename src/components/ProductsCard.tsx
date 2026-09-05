import { ShoppingCart, Plus, Pencil, Trash2 } from 'lucide-react'
import type { Product } from '../types/product.types'
import { StockBadge } from './StockBadge'

type Props = {
  product: Product
  onAddToCart?: (product: Product) => void
  inCartCount?: number
  isAdmin?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (id: string, name: string) => void
  deleteLoading?: boolean
}

export function ProductCard({
  product,
  onAddToCart,
  inCartCount = 0,
  isAdmin,
  onEdit,
  onDelete,
  deleteLoading,
}: Props) {
  const inStock = product.stock > 0
  const hasDiscount = product.isDiscounted && product.discountPrice !== undefined

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-md relative">
      {/* Product Image */}
      {product.imageUrl && (
        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5 flex flex-col gap-2 flex-1">
        {/* Discount Badge */}
        {hasDiscount && product.discountTag && (
          <div className="inline-flex self-start bg-red-50 text-red-600 text-[11px] px-2.5 py-0.5 rounded-full font-medium">
            {product.discountTag}
          </div>
        )}

        {/* Admin overlay buttons */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-1.5">
            <button
              onClick={() => onEdit?.(product)}
              aria-label={`Edit ${product.name}`}
              className="bg-white/90 backdrop-blur-sm border border-slate-200 p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm transition-colors"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              onClick={() => onDelete?.(product.id, product.name)}
              disabled={deleteLoading}
              aria-label={`Delete ${product.name}`}
              className="bg-white/90 backdrop-blur-sm border border-slate-200 p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-40 shadow-sm transition-colors"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        )}

        {/* In cart badge */}
        {inCartCount > 0 && !isAdmin && (
          <div className="absolute top-3 right-3 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-full font-medium">
            {inCartCount} in cart
          </div>
        )}

        {/* Name + description */}
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-base leading-snug">
            {product.name}
          </h3>
          <p className="text-slate-400 text-sm mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price + stock */}
        <div className="flex items-end justify-between mt-2">
          <div>
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400 text-sm line-through">
                  KES {product.price.toLocaleString()}
                </span>
                <span className="text-slate-900 font-semibold text-lg">
                  KES {product.discountPrice?.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-slate-900 font-semibold text-lg">
                KES {product.price.toLocaleString()}
              </span>
            )}
          </div>
          <StockBadge stock={product.stock} />
        </div>

        {/* Add to cart */}
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            disabled={!inStock}
            aria-label={inStock ? `Add ${product.name} to cart` : `${product.name} is out of stock`}
            className="w-full flex items-center justify-center gap-2 bg-slate-950 text-white py-2.5 text-sm font-medium rounded-xl hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {inCartCount > 0 ? (
              <>
                <Plus className="size-3.5" />
                Add another ({inCartCount} in cart)
              </>
            ) : inStock ? (
              <>
                <ShoppingCart className="size-3.5" />
                Add to cart
              </>
            ) : (
              'Out of stock'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
