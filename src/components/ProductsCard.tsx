import type { Product } from '../types/product.types'

type Props = {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: Props) {
  const inStock = product.stock > 0
  const hasDiscount = product.isDiscounted && product.discountPrice !== undefined

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col gap-3 hover:shadow-md transition-shadow relative">
      {/* Discount Badge */}
      {hasDiscount && product.discountTag && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          {product.discountTag}
        </div>
      )}

      {/* Name + description */}
      <div>
        <h3 className="font-semibold text-stone-900 text-base leading-tight">
          {product.name}
        </h3>
        <p className="text-stone-500 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>
      </div>

      {/* Price + stock */}
      <div className="flex items-center justify-between mt-auto">
        {hasDiscount ? (
          <div className="flex flex-col">
            <span className="text-stone-400 text-sm line-through">
              KES {product.price.toLocaleString()}
            </span>
            <span className="text-stone-900 font-semibold text-lg">
              KES {product.discountPrice?.toLocaleString()}
            </span>
          </div>
        ) : (
          <span className="text-stone-900 font-semibold text-lg">
            KES {product.price.toLocaleString()}
          </span>
        )}
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            inStock
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {inStock ? `${product.stock} in stock` : 'Out of stock'}
        </span>
      </div>

      {/* Add to cart */}
      <button
        onClick={() => onAddToCart?.(product)}
        disabled={!inStock}
        className="w-full bg-stone-900 text-white py-2 rounded-md text-sm hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {inStock ? 'Add to cart' : 'Out of stock'}
      </button>
    </div>
  )
}