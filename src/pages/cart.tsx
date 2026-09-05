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
    } catch (err) {
      console.error('Error placing order:', err)
    }
  }

  const hasStockIssues = cart?.items.some((item) => {
    const stock = stockMap[item.productId]
    return stock !== undefined && item.quantity > stock
  }) ?? false

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <StoreNavbar />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
            <ShoppingCart className="size-12 text-slate-200 mx-auto mb-4 animate-pulse" />
            <h1 className="text-xl font-semibold text-slate-900">
              Loading your cart...
            </h1>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <StoreNavbar />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="border border-red-200 bg-red-50 rounded-2xl p-10">
            <AlertTriangle className="size-12 text-red-300 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-red-800">
              Error loading your cart
            </h1>
            <p className="text-red-500 text-sm mt-2">{error.message}</p>
          </div>
        </main>
      </div>
    )
  }

  if (!cart || itemCount === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <StoreNavbar />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
            <ShoppingCart className="size-12 text-slate-200 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-slate-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-slate-500 text-sm mb-6">
              Looks like you haven't added any items yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-slate-950 text-white px-8 py-3 text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
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
    <div className="min-h-screen bg-slate-50">
      <StoreNavbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Your Cart
          </h1>
          <span className="text-sm text-slate-500">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Stock issues warning */}
        {hasStockIssues && (
          <div className="border border-amber-200 bg-amber-50 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Stock has changed
              </p>
              <p className="text-sm text-amber-600 mt-1">
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
                className={`bg-white border rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-4 shadow-sm ${
                  isOverStock ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
                }`}
              >
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-slate-900">{item.name}</h2>
                  <p className="text-slate-500 text-sm">
                    KES {item.price.toLocaleString()} each
                  </p>
                  <p className="text-slate-400 text-xs">
                    Subtotal: KES {(item.price * item.quantity).toLocaleString()}
                  </p>

                  {stock !== undefined && (
                    <div className="mt-2">
                      <StockBadge stock={stock} />
                    </div>
                  )}

                  {isOverStock && (
                    <p className="text-red-500 text-xs font-medium mt-1">
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
                    className="inline-flex items-center gap-1.5 text-red-500 px-3 py-2 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Total + Checkout */}
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-500">Total</span>
            <span className="text-2xl font-semibold text-slate-900">
              KES {cart.total.toLocaleString()}
            </span>
          </div>

          {createError && (
            <div className="border border-red-200 bg-red-50 rounded-xl p-3 mb-4">
              <p className="text-red-600 text-sm font-medium">{createError.message}</p>
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={createLoading || hasStockIssues}
            className="w-full flex items-center justify-center gap-2 bg-slate-950 text-white py-3 text-sm font-medium rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
            <p className="text-red-500 text-xs font-medium mt-2 text-center">
              Fix stock issues above before placing your order
            </p>
          )}
        </div>
      </main>

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
