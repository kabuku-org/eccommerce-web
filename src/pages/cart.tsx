import { useState } from 'react'
import { useCart } from '../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { CheckoutSheet } from '../components/CheckoutSheet'
import type { order } from '../types/order.types'
import { Plus, Minus, Trash2, ShoppingCart, X } from 'lucide-react'

export function Cart() {
  const { cart, itemCount, loading, error, removeItem, addItem, clearCart, removeLoading, clearLoading, addLoading } = useCart()
  const navigate = useNavigate()
  const { createOrder, createError, createLoading, checkoutOrder, checkoutLoading } = useOrders()
  const [checkoutOrderData, setCheckoutOrderData] = useState<order | null>(null)

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

  if (loading) {
    return (
      <div className="min-h-screen">
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-xl font-semibold text-stone-900 mb-2">
            Loading your cart...
          </h1>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-xl font-semibold text-stone-900 mb-2">
            Error loading your cart.
          </h1>
        </main>
      </div>
    )
  }

  if (!cart || itemCount === 0) {
    return (
      <div className="min-h-screen">
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-xl font-semibold text-stone-900 mb-2">
            Your cart is empty.
          </h1>
          <p className="text-stone-700 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <ShoppingCart className="size-4" />
            Continue Shopping
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-900">Your Cart</h1>
          <span className="text-sm text-stone-500">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        <ul className="space-y-4">
          {cart.items.map((item) => (
            <li
              key={item.productId}
              className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <h2 className="text-lg font-semibold text-stone-900">{item.name}</h2>
                <p className="text-stone-700">Price: KES {item.price.toFixed(2)}</p>
                <p className="text-stone-500 text-sm">Subtotal: KES {(item.price * item.quantity).toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Quantity controls */}
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => removeItem(item.productId, 1)}
                    disabled={removeLoading}
                    className="p-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors border-r border-stone-300"
                    title="Decrease quantity"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-stone-900 min-w-[3rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => addItem(item.productId)}
                    disabled={addLoading}
                    className="p-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors border-l border-stone-300"
                    title="Increase quantity"
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.productId, item.quantity)}
                  disabled={removeLoading}
                  className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 text-sm font-medium disabled:opacity-50 transition-colors"
                  aria-label="Remove item"
                >
                  {removeLoading ? (
                    <span className="size-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-lg font-bold text-stone-900">Total: KES {cart.total.toFixed(2)}</p>
          <button
            onClick={clearCart}
            disabled={clearLoading}
            className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-200 font-medium disabled:opacity-50 transition-colors"
          >
            {clearLoading ? (
              <span className="size-4 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
            ) : (
              <X className="size-4" />
            )}
            {clearLoading ? 'Clearing...' : 'Clear Cart'}
          </button>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-6 mt-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-bold text-stone-900">Total</span>
            <span className="text-2xl font-extrabold text-stone-900">
              KES {cart.total.toLocaleString()}
            </span>
          </div>

          {createError && (
            <p className="text-red-600 text-sm mb-4">{createError.message}</p>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={createLoading}
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {createLoading ? (
              <>
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Placing order...
              </>
            ) : (
              <>
                <ShoppingCart className="size-4" />
                Place Order & Checkout
              </>
            )}
          </button>
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