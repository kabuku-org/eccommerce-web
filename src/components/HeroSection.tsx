import { ShoppingBag, ArrowRight } from 'lucide-react'

type Props = {
  isLoggedIn: boolean
  onShopClick: () => void
}

export function HeroSection({ isLoggedIn, onShopClick }: Props) {
  return (
    <section className="relative overflow-hidden border-b-2 border-black bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-yellow-300 px-3 py-1 mb-6">
            <ShoppingBag className="size-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Bookstore
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] text-black mb-6">
            Find your
            <br />
            next great
            <br />
            <span className="bg-yellow-300 px-2 border-2 border-black inline-block -rotate-1">
              read.
            </span>
          </h1>

          <p className="text-lg text-stone-600 max-w-md mb-8 leading-relaxed">
            Curated books at honest prices. Browse our collection and discover something worth your time.
          </p>

          <button
            onClick={onShopClick}
            className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-wider border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-200"
          >
            {isLoggedIn ? 'Browse Collection' : 'Sign in to shop'}
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Decorative brutalist element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 border-l-2 border-b-2 border-black hidden lg:block" />
      <div className="absolute bottom-0 right-20 w-32 h-32 bg-black hidden lg:block" />
    </section>
  )
}
