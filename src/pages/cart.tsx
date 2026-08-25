import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useOrders } from '../hooks/useOrders'
import { useProducts } from '../hooks/useProducts'
import { CheckoutSheet } from '../components/CheckoutSheet'
import { StoreNavbar } from '../components/StoreNavbar'
import { QuantityControl } from '../components/QuantityControl'
import { StockBadge } from '../components/StockBadge'
import type { order } from '../types/order.types'
import { ShoppingCart, Trash2, ArrowRight, AlertTriangle } from 'lucide-react'

export function Cart() {
  const {
    cart,
    itemCount,
    loading,
    error,
    removeItem,
    addItem,
    removeLoading,
    addLoading,
  } = useCart()

  const { products: allProducts } = useProducts()
  const navigate = useNavigate()
  const {
    createOrder,
    createError,
    createLoading,
    checkoutOrder,
    checkoutLoading,
  } = useOrders()
  const [checkoutOrderData, setCheckoutOrderData] = useState<order | null>(null)

  // Build a stock lookup from products
  const stockMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const p of allProducts) {
      map[p.id] = p.stock
    }
    return map
  }, [allProducts])

  async function handlePlaceOrder() {
    try {
      if (!cart || itemCount === 0) {
        console.error('Cart is empty. Cannot place order.')
        return
      }
      const createdOrder = await createOrder()
      if (createdOrder) {
        setCheckoutOrderData(createdOrder)
      }
    } catch (error) {
      console.error('Error placing order:', error)
    }
  }

  // Check if any cart item exceeds known stock
  const hasStockIssues = cart?.items.some((item) => {
    const stock = stockMap[item.productId]
    return stock !== undefined && item.quantity > stock
  }) ?? false

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <StoreNavbar />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="border-2 border-stone-200 bg-white p-10">
            <ShoppingCart className="size-12 text-stone-300 mx-auto mb-4 animate-pulse" />
            <h1 className="text-xl font-black uppercase tracking-wide text-stone-900">
              Loading your cart...
            </h1>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <StoreNavbar />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="border-2 border-red-300 bg-red-50 p-10">
            <AlertTriangle className="size-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-black uppercase tracking-wide text-red-800">
              Error loading your cart
            </h1>
            <p className="text-red-600 text-sm mt-2">{error.message}</p>
          </div>
        </main>
      </div>
    )
  }

  if (!cart || itemCount === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <StoreNavbar />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="border-2 border-black bg-white p-10 shadow-[6px_6px_0px_0px_#000]">
            <ShoppingCart className="size-12 text-stone-300 mx-auto mb-4" />
            <h1 className="text-xl font-black uppercase tracking-wide text-black mb-2">
              Your cart is empty
            </h1>
            <p className="text-stone-500 text-sm mb-6">
              Looks like you haven't added any items yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all"
            >
              <ShoppingCart className="size-4" />
              Browse Products
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <StoreNavbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">
            Your Cart
          </h1>
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500 border-2 border-stone-300 px-3 py-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Stock issues warning */}
        {hasStockIssues && (
          <div className="border-2 border-amber-300 bg-amber-50 p-4 mb-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800 uppercase tracking-wide">
                Stock has changed
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Some items in your cart exceed currently available stock. Please adjust quantities before checkout.
              </p>
            </div>
          </div>
        )}

        <ul className="space-y-3">
          {cart.items.map((item) => {
            const stock = stockMap[item.productId]
            const isOverStock = stock !== undefined && item.quantity > stock

            return (
              <li
                key={item.productId}
                className={`border-2 border-black bg-white p-4 flex flex-col sm:flex-row justify-between gap-4 shadow-[4px_4px_0px_0px_#000] ${
                  isOverStock ? 'border-red-400 bg-red-50' : ''
                }`}
              >
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-black">{item.name}</h2>
                  <p className="text-stone-700 text-sm">
                    KES {item.price.toLocaleString()} each
                  </p>
                  <p className="text-stone-500 text-xs">
                    Subtotal: KES {(item.price * item.quantity).toLocaleString()}
                  </p>

                  {stock !== undefined && (
                    <div className="mt-2">
                      <StockBadge stock={stock} />
                    </div>
                  )}

                  {isOverStock && (
                    <p className="text-red-600 text-xs font-bold mt-1 uppercase tracking-wide">
                      Quantity ({item.quantity}) exceeds stock ({stock})
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <QuantityControl
                    quantity={item.quantity}
                    stock={stock ?? item.quantity + 100}
                    onIncrease={() => addItem(item.productId)}
                    onDecrease={() => removeItem(item.productId, 1)}
                    increaseLoading={addLoading}
                    decreaseLoading={removeLoading}
                  />

                  <button
                    onClick={() => removeItem(item.productId, item.quantity)}
                    disabled={removeLoading}
                    aria-label={`Remove ${item.name} from cart`}
                    className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-2 border-2 border-red-300 text-xs font-bold uppercase tracking-wider hover:bg-red-100 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="size-3" />
                    Remove
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Total + Checkout */}
        <div className="mt-6 border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Total</span>
            <span className="text-2xl font-black text-black">
              KES {cart.total.toLocaleString()}
            </span>
          </div>

          {createError && (
            <div className="border-2 border-red-300 bg-red-50 p-3 mb-4">
              <p className="text-red-700 text-sm font-medium">{createError.message}</p>
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={createLoading || hasStockIssues}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 text-sm font-bold uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] disabled:hover:translate-y-0 transition-all"
          >
            {createLoading ? (
              <>
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Placing order...
              </>
            ) : (
              <>
                <ArrowRight className="size-4" />
                Place Order & Checkout
              </>
            )}
          </button>

          {hasStockIssues && (
            <p className="text-red-600 text-xs font-medium mt-2 text-center">
              Fix stock issues above before placing your order
            </p>
          )}
        </div>
      </main>

      {/* Checkout slide panel */}
      {checkoutOrderData && (
        <CheckoutSheet
          order={checkoutOrderData}
          onClose={() => setCheckoutOrderData(null)}
          onCheckout={(deliveryAddress, pickupLocation) => {
            checkoutOrder(checkoutOrderData.id, deliveryAddress, pickupLocation)
          }}
          checkoutLoading={checkoutLoading}
        />
      )}
    </div>
  )
}
