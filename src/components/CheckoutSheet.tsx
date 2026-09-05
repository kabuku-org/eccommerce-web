import { useState } from "react"
import type { order } from "../types/order.types"
import { useAuthStore } from "../store/auth.store"
import {
  CreditCard,
  MapPin,
  Store,
  User,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react"

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

  const canProceedFromDetails = email.trim().length > 0
  const canProceedFromFulfillment =
    deliveryMode === "delivery" ? deliveryAddress.trim().length > 0 : pickupLocation.trim().length > 0

  const handlePay = () => {
    setStep("pay")
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
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Checkout</h2>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-1 flex-1">
                <div
                  className={`flex items-center justify-center size-7 rounded-full text-xs font-semibold transition-colors ${
                    i < currentStepIndex
                      ? "bg-emerald-500 text-white"
                      : i === currentStepIndex
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {i < currentStepIndex ? <Check className="size-3.5" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 rounded-full transition-colors ${
                      i < currentStepIndex ? "bg-emerald-500" : "bg-slate-100"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center mt-2 font-medium">
            {steps[currentStepIndex]?.label}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Step 1: User Details */}
          {step === "details" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <div className="size-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="size-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{user?.name ?? "User"}</p>
                  <p className="text-xs text-slate-500">{user?.email ?? ""}</p>
                </div>
              </div>

              <div>
                <label htmlFor="checkout-email" className="text-sm font-medium text-slate-700 block mb-1.5">
                  Email for receipt <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-300 transition-all"
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
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    deliveryMode === "delivery"
                      ? "border-slate-950 bg-slate-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <MapPin className={`size-8 ${deliveryMode === "delivery" ? "text-slate-950" : "text-slate-400"}`} />
                  <span className={`text-sm font-medium ${deliveryMode === "delivery" ? "text-slate-950" : "text-slate-600"}`}>
                    Delivery
                  </span>
                </button>
                <button
                  onClick={() => setDeliveryMode("pickup")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    deliveryMode === "pickup"
                      ? "border-slate-950 bg-slate-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Store className={`size-8 ${deliveryMode === "pickup" ? "text-slate-950" : "text-slate-400"}`} />
                  <span className={`text-sm font-medium ${deliveryMode === "pickup" ? "text-slate-950" : "text-slate-600"}`}>
                    Pickup
                  </span>
                </button>
              </div>

              {deliveryMode === "delivery" && (
                <div>
                  <label htmlFor="delivery-address" className="text-sm font-medium text-slate-700 block mb-1.5">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="delivery-address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full delivery address..."
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-300 resize-none transition-all"
                  />
                </div>
              )}

              {deliveryMode === "pickup" && (
                <div>
                  <label htmlFor="pickup-location" className="text-sm font-medium text-slate-700 block mb-1.5">
                    Pickup Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="pickup-location"
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Nairobi Store, Mombasa Road..."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-300 transition-all"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review Order */}
          {step === "review" && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-3 space-y-1">
                <p className="text-xs text-slate-500 font-medium">Receipt email</p>
                <p className="text-sm font-medium text-slate-900">{email}</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3 space-y-1">
                <p className="text-xs text-slate-500 font-medium">
                  {deliveryMode === "delivery" ? "Delivery Address" : "Pickup Location"}
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {deliveryMode === "delivery" ? deliveryAddress : pickupLocation}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900 mb-2">Order Items</p>
                <div className="space-y-2">
                  {order.cart.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm border-b border-slate-100 pb-2">
                      <span className="text-slate-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-slate-900">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="font-medium text-slate-900">Total</span>
                <span className="font-semibold text-slate-900 text-lg">
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
                  <div className="size-16 border-4 border-slate-200 border-t-slate-950 rounded-full animate-spin mx-auto" />
                  <p className="text-slate-500 text-sm">Processing your payment...</p>
                </>
              ) : (
                <>
                  <div className="size-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                    <Check className="size-8 text-emerald-500" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Payment Successful!</p>
                  <p className="text-sm text-slate-500">
                    Your order has been placed. You'll receive a confirmation at {email}.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-slate-950 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer navigation */}
        {step !== "pay" && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => {
                if (currentStepIndex > 0) {
                  setStep(steps[currentStepIndex - 1].key as CheckoutStep)
                }
              }}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="size-4" />
              Back
            </button>

            {step === "review" ? (
              <button
                onClick={handlePay}
                className="flex items-center gap-1 px-5 py-2 bg-slate-950 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                <CreditCard className="size-4" />
                Pay Now
              </button>
            ) : (
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
                className="flex items-center gap-1 px-5 py-2 bg-slate-950 text-white text-sm font-medium rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue
                <ChevronRight className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
