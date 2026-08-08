import { useState } from "react"
import type { order } from "../types/order.types"
import { useAuthStore } from "../store/auth.store"
import { CreditCard, MapPin, Store, User, ChevronLeft, ChevronRight, Check, X } from "lucide-react"

type CheckoutStep = "details" | "fulfillment" | "review" | "pay"

export function CheckoutSheet({
  order,
  onClose,
  onCheckout,
  checkoutLoading,
}: {
  order: order
  onClose: () => void
  onCheckout: (deliveryAddress?: string, pickupLocation?: string) => void
  checkoutLoading: boolean
}) {
  const user = useAuthStore((state) => state.user)
  const [step, setStep] = useState<CheckoutStep>("details")
  const [email, setEmail] = useState(user?.email ?? "")
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "pickup" | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [pickupLocation, setPickupLocation] = useState("")
  const [paid, setPaid] = useState(false)

  const canProceedFromDetails = email.trim().length > 0
  const canProceedFromFulfillment =
    deliveryMode === "delivery" ? deliveryAddress.trim().length > 0 : pickupLocation.trim().length > 0

  const handlePay = () => {
    setPaid(true)
    setStep("pay")
    // trigger checkout with the collected info
    const addr = deliveryMode === "delivery" ? deliveryAddress : undefined
    const pickup = deliveryMode === "pickup" ? pickupLocation : undefined
    onCheckout(addr, pickup)
  }

  const steps = [
    { key: "details", label: "Your Details" },
    { key: "fulfillment", label: "Delivery / Pickup" },
    { key: "review", label: "Review Order" },
    { key: "pay", label: "Pay" },
  ]

  const currentStepIndex = steps.findIndex((s) => s.key === step)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      {/* Slide panel */}
      <div className="relative w-full max-w-md bg-white shadow-xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">Checkout</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-1 flex-1">
                <div
                  className={`flex items-center justify-center size-7 rounded-full text-xs font-bold ${
                    i < currentStepIndex
                      ? "bg-green-500 text-white"
                      : i === currentStepIndex
                      ? "bg-indigo-600 text-white"
                      : "bg-stone-200 text-stone-400"
                  }`}
                >
                  {i < currentStepIndex ? <Check className="size-3.5" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      i < currentStepIndex ? "bg-green-500" : "bg-stone-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500 text-center mt-2">
            {steps[currentStepIndex]?.label}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Step 1: User Details */}
          {step === "details" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg">
                <User className="size-10 text-indigo-500 bg-indigo-100 p-2 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-stone-900">{user?.name ?? "User"}</p>
                  <p className="text-xs text-stone-500">{user?.email ?? ""}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1.5">
                  Email for receipt <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Delivery / Pickup */}
          {step === "fulfillment" && (
            <div className="space-y-5">
              <div className="flex gap-3">
                <button
                  onClick={() => setDeliveryMode("delivery")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    deliveryMode === "delivery"
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <MapPin className={`size-8 ${deliveryMode === "delivery" ? "text-indigo-600" : "text-stone-400"}`} />
                  <span className={`text-sm font-medium ${deliveryMode === "delivery" ? "text-indigo-700" : "text-stone-600"}`}>
                    Delivery
                  </span>
                </button>
                <button
                  onClick={() => setDeliveryMode("pickup")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    deliveryMode === "pickup"
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <Store className={`size-8 ${deliveryMode === "pickup" ? "text-indigo-600" : "text-stone-400"}`} />
                  <span className={`text-sm font-medium ${deliveryMode === "pickup" ? "text-indigo-700" : "text-stone-600"}`}>
                    Pickup
                  </span>
                </button>
              </div>

              {deliveryMode === "delivery" && (
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1.5">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full delivery address..."
                    rows={3}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  />
                </div>
              )}

              {deliveryMode === "pickup" && (
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1.5">
                    Pickup Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Nairobi Store, Mombasa Road..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review Order */}
          {step === "review" && (
            <div className="space-y-4">
              {/* User info summary */}
              <div className="bg-stone-50 rounded-lg p-3 space-y-1">
                <p className="text-xs text-stone-500">Receipt email:</p>
                <p className="text-sm font-medium text-stone-800">{email}</p>
              </div>

              {/* Fulfillment summary */}
              <div className="bg-stone-50 rounded-lg p-3 space-y-1">
                <p className="text-xs text-stone-500">
                  {deliveryMode === "delivery" ? "Delivery Address" : "Pickup Location"}
                </p>
                <p className="text-sm font-medium text-stone-800">
                  {deliveryMode === "delivery" ? deliveryAddress : pickupLocation}
                </p>
              </div>

              {/* Order items */}
              <div>
                <p className="text-sm font-semibold text-stone-900 mb-2">Order Items</p>
                <div className="space-y-2">
                  {order.cart.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-stone-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-stone-500">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-stone-200 pt-3 flex justify-between">
                <span className="font-bold text-stone-900">Total</span>
                <span className="font-bold text-stone-900">
                  KES {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Step 4: Pay / Done */}
          {step === "pay" && (
            <div className="text-center py-8 space-y-4">
              {checkoutLoading ? (
                <>
                  <div className="size-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                  <p className="text-stone-600 text-sm">Processing your payment...</p>
                </>
              ) : paid ? (
                <>
                  <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="size-8 text-green-600" />
                  </div>
                  <p className="text-lg font-bold text-stone-900">Payment Successful!</p>
                  <p className="text-sm text-stone-500">
                    Your order has been placed. You'll receive a confirmation at {email}.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <CreditCard className="size-12 text-indigo-500 mx-auto" />
                  <div>
                    <p className="text-lg font-bold text-stone-900">
                      KES {order.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-stone-500">Pay to complete your order</p>
                  </div>
                  <button
                    onClick={handlePay}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard className="size-5" />
                    Pay Now
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer navigation */}
        {step !== "pay" && (
          <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between">
            <button
              onClick={() => {
                if (currentStepIndex > 0) {
                  setStep(steps[currentStepIndex - 1].key as CheckoutStep)
                }
              }}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="size-4" />
              Back
            </button>

            <button
              onClick={() => {
                if (currentStepIndex < steps.length - 1) {
                  setStep(steps[currentStepIndex + 1].key as CheckoutStep)
                }
              }}
              disabled={
                (step === "details" && !canProceedFromDetails) ||
                (step === "fulfillment" && !canProceedFromFulfillment)
              }
              className="flex items-center gap-1 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continue
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}