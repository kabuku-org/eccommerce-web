import { useReviews } from "../hooks/useReviews";
import { useAuthStore } from "../store/auth.store";

type Review = {
  id: string
  productId: string
  userId: string
  orderId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

export function ReviewsOrderPage() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'ADMIN'
  
  const { reviews, loading, error } = useReviews()

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold text-stone-900 mb-4">
            Access Denied
          </h1>
          <p className="text-stone-600">
            Only admin users can view reviews.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-stone-900 mb-8">Product Reviews</h1>

        {loading && (
          <p className="text-stone-500 text-center py-20">
            Loading reviews...
          </p>
        )}

        {error && (
          <p className="text-red-600 text-center py-20">
            Failed to load reviews. {error.message}
          </p>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">⭐</p>
            <p className="text-stone-500">No reviews yet.</p>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review: Review) => (
              <div
                key={review.id}
                className="bg-white border border-stone-200 rounded-lg p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-stone-900">
                      Order #{review.orderId.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-stone-500 text-xs">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < review.rating ? 'text-yellow-400' : 'text-stone-200'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-stone-600 text-sm mb-2 line-clamp-3">
                  {review.comment}
                </p>

                <div className="text-stone-400 text-xs">
                  Product ID: {review.productId}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}