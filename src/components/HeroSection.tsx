import { ArrowRight } from 'lucide-react'

type Props = {
  isLoggedIn: boolean
  onShopClick: () => void
}

export function HeroSection({ isLoggedIn, onShopClick }: Props) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.05] mb-6">
            Find your next
            <br />
            great product.
          </h1>

          <p className="text-lg text-slate-500 max-w-md mb-8 leading-relaxed">
            Curated products at honest prices. Browse our collection and discover something worth your time.
          </p>

          <button
            onClick={onShopClick}
            className="group inline-flex items-center gap-3 bg-slate-950 text-white px-8 py-4 text-sm font-medium rounded-xl hover:bg-slate-800 transition-all duration-200"
          >
            {isLoggedIn ? 'Browse Collection' : 'Sign in to shop'}
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Subtle decorative gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-slate-100 to-transparent rounded-full -translate-y-1/4 translate-x-1/4 hidden lg:block" />
    </section>
  )
}
