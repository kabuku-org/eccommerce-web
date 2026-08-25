import { ShoppingCart, Plus } from 'lucide-react'
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
    <div className="border-2 border-black bg-white p-5 flex flex-col gap-3 shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#000] transition-all duration-200 relative">
      {/* Product Image */}
      {product.imageUrl && (
        <div className="border-2 border-black -mx-5 -mt-5 mb-1 overflow-hidden bg-stone-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Discount Badge */}
      {hasDiscount && product.discountTag && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-1 font-bold uppercase tracking-wider border border-red-700">
          {product.discountTag}
        </div>
      )}

      {/* Admin overlay buttons */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={() => onEdit?.(product)}
            aria-label={`Edit ${product.name}`}
            className="bg-white border-2 border-black p-1.5 text-black hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
          <button
            onClick={() => onDelete?.(product.id, product.name)}
            disabled={deleteLoading}
            aria-label={`Delete ${product.name}`}
            className="bg-white border-2 border-black p-1.5 text-red-600 hover:bg-red-100 disabled:opacity-40 transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      )}

      {/* In cart badge */}
      {inCartCount > 0 && (
        <div className="absolute top-2 right-2 bg-black text-white text-[10px] px-2 py-1 font-bold uppercase tracking-wider border border-black">
          {inCartCount} in cart
        </div>
      )}

      {/* Name + description */}
      <div className="flex-1">
        <h3 className="font-black text-lg text-black leading-tight uppercase tracking-tight">
          {product.name}
        </h3>
        <p className="text-stone-500 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>
      </div>

      {/* Price + stock */}
      <div className="flex items-end justify-between mt-auto">
        <div>
          {hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-stone-400 text-xs line-through">
                KES {product.price.toLocaleString()}
              </span>
              <span className="text-black font-black text-xl leading-tight">
                KES {product.discountPrice?.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-black font-black text-xl leading-tight">
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
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 text-xs font-bold uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] disabled:hover:translate-y-0 transition-all"
        >
          {inCartCount > 0 ? (
            <>
              <Plus className="size-3" />
              Add another ({inCartCount} in cart)
            </>
          ) : inStock ? (
            <>
              <ShoppingCart className="size-3" />
              Add to cart
            </>
          ) : (
            'Out of stock'
          )}
        </button>
      )}
    </div>
  )
}
