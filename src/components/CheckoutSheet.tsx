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
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      {/* Slide panel */}
      <div className="relative w-full max-w-md bg-white shadow-xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-black flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-wide text-black">Checkout</h2>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="text-stone-400 hover:text-black transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-1 flex-1">
                <div
                  className={`flex items-center justify-center size-7 text-xs font-bold ${
                    i < currentStepIndex
                      ? "bg-green-600 text-white"
                      : i === currentStepIndex
                      ? "bg-black text-white"
                      : "bg-stone-200 text-stone-400"
                  }`}
                >
                  {i < currentStepIndex ? <Check className="size-3.5" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      i < currentStepIndex ? "bg-green-600" : "bg-stone-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500 text-center mt-2 font-bold uppercase tracking-wider">
            {steps[currentStepIndex]?.label}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Step 1: User Details */}
          {step === "details" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 p-4 border-2 border-black bg-stone-50">
                <User className="size-8 text-black bg-yellow-300 p-1.5" />
                <div>
                  <p className="text-sm font-bold text-black">{user?.name ?? "User"}</p>
                  <p className="text-xs text-stone-500">{user?.email ?? ""}</p>
                </div>
              </div>

              <div>
                <label htmlFor="checkout-email" className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                  Email for receipt <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
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
                  className={`flex-1 flex flex-col items-center gap-2 p-4 border-2 transition-all ${
                    deliveryMode === "delivery"
                      ? "border-black bg-yellow-300 shadow-[3px_3px_0px_0px_#000]"
                      : "border-stone-200 hover:border-black"
                  }`}
                >
                  <MapPin className={`size-8 ${deliveryMode === "delivery" ? "text-black" : "text-stone-400"}`} />
                  <span className={`text-sm font-bold uppercase tracking-wider ${deliveryMode === "delivery" ? "text-black" : "text-stone-600"}`}>
                    Delivery
                  </span>
                </button>
                <button
                  onClick={() => setDeliveryMode("pickup")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 border-2 transition-all ${
                    deliveryMode === "pickup"
                      ? "border-black bg-yellow-300 shadow-[3px_3px_0px_0px_#000]"
                      : "border-stone-200 hover:border-black"
                  }`}
                >
                  <Store className={`size-8 ${deliveryMode === "pickup" ? "text-black" : "text-stone-400"}`} />
                  <span className={`text-sm font-bold uppercase tracking-wider ${deliveryMode === "pickup" ? "text-black" : "text-stone-600"}`}>
                    Pickup
                  </span>
                </button>
              </div>

              {deliveryMode === "delivery" && (
                <div>
                  <label htmlFor="delivery-address" className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="delivery-address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full delivery address..."
                    rows={3}
                    className="w-full px-3 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 resize-none"
                  />
                </div>
              )}

              {deliveryMode === "pickup" && (
                <div>
                  <label htmlFor="pickup-location" className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                    Pickup Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="pickup-location"
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Nairobi Store, Mombasa Road..."
                    className="w-full px-3 py-2 border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review Order */}
          {step === "review" && (
            <div className="space-y-4">
              <div className="border-2 border-black p-3 bg-stone-50">
                <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Receipt email</p>
                <p className="text-sm font-bold text-black mt-1">{email}</p>
              </div>

              <div className="border-2 border-black p-3 bg-stone-50">
                <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">
                  {deliveryMode === "delivery" ? "Delivery Address" : "Pickup Location"}
                </p>
                <p className="text-sm font-bold text-black mt-1">
                  {deliveryMode === "delivery" ? deliveryAddress : pickupLocation}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">Order Items</p>
                <div className="space-y-2">
                  {order.cart.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm border-b border-stone-100 pb-2">
                      <span className="text-stone-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-bold text-black">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-black pt-3 flex justify-between">
                <span className="font-black text-black uppercase tracking-wider text-sm">Total</span>
                <span className="font-black text-black text-lg">
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
                  <div className="size-16 border-4 border-stone-200 border-t-black rounded-full animate-spin mx-auto" />
                  <p className="text-stone-600 text-sm font-medium">Processing your payment...</p>
                </>
              ) : (
                <>
                  <div className="size-16 bg-green-100 border-2 border-green-600 flex items-center justify-center mx-auto">
                    <Check className="size-8 text-green-600" />
                  </div>
                  <p className="text-lg font-black uppercase tracking-wide text-black">Payment Successful!</p>
                  <p className="text-sm text-stone-500">
                    Your order has been placed. You'll receive a confirmation at {email}.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-black text-white text-sm font-bold uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all"
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
          <div className="px-6 py-4 border-t-2 border-black flex items-center justify-between">
            <button
              onClick={() => {
                if (currentStepIndex > 0) {
                  setStep(steps[currentStepIndex - 1].key as CheckoutStep)
                }
              }}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-stone-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="size-4" />
              Back
            </button>

            {step === "review" ? (
              <button
                onClick={handlePay}
                className="flex items-center gap-1 px-5 py-2 bg-black text-white text-sm font-bold uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all"
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
                className="flex items-center gap-1 px-5 py-2 bg-black text-white text-sm font-bold uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] disabled:hover:translate-y-0 transition-all"
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
