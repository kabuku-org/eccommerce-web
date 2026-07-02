import { NavBar } from '../components/NavBar'
import { useCart } from '../hooks/useCart'
import {useNavigate} from 'react-router-dom'


export function Cart() {
  const { cart, itemCount  ,loading , error , addItem, removeItem, clearCart , addLoading, removeLoading, clearLoading, addError, removeError, clearError } = useCart()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <NavBar />
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
      <div className="min-h-screen bg-stone-50">
        <NavBar />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-xl font-semibold text-stone-900 mb-2">
            Error loading your cart.
          </h1>
        </main>
      </div>
    )
  }
//empty state instance showing no item in cart

if (!cart || itemCount === 0) { 

  return (
    <div className="min-h-screen bg-stone-50">
      <NavBar />
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </main>
    </div>
  )
}

//cart with items instance showing the items in the cart and the total price
  return (
    <div className="min-h-screen bg-stone-50">
      <NavBar />
      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-2xl font-semibold text-stone-900 mb-6">Your Cart</h1>
        <ul className="space-y-4">
          {cart.items.map((item) => (
            <li key={item.productId} className="flex justify-between items-center bg-white p-4 rounded shadow">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">{item.name}</h2>
                <p className="text-stone-700">Quantity: {item.quantity}</p>
                <p className="text-stone-700">Price: ${item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeItem(item.productId, item.price * item.quantity)}
                disabled={removeLoading}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                {removeLoading ? 'Removing...' : 'Remove'}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between items-center">
          <p className="text-lg font-semibold text-stone-900">Total: ${cart.total.toFixed(2)}</p>
          <button
            onClick={clearCart}
            disabled={clearLoading}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            {clearLoading ? 'Clearing...' : 'Clear Cart'}
          </button>
        </div>
          {/* Footer: total + checkout */}
        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-semibold text-stone-900">
              Total
            </span>
            <span className="text-2xl font-bold text-stone-900">
              KES {cart.total.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => alert('Checkout coming soon!')}
            className="w-full bg-stone-900 text-white py-3 rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </main>
    </div>
  )
}