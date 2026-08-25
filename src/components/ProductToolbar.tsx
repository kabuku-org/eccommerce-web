import { Search } from 'lucide-react'

type Props = {
  search: string
  onSearchChange: (value: string) => void
  resultCount: number
  totalCount: number
}

export function ProductToolbar({ search, onSearchChange, resultCount, totalCount }: Props) {
  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 px-6 py-4 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-stone-500">
            Collection
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            {resultCount} of {totalCount} products
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search products"
            className="w-full pl-10 pr-4 py-2.5 border-2 border-black bg-white text-sm font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-shadow"
          />
        </div>
      </div>
    </div>
  )
}
