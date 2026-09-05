import { Search } from 'lucide-react'

type Props = {
  search: string
  onSearchChange: (value: string) => void
  resultCount: number
  totalCount: number
}

export function ProductToolbar({ search, onSearchChange, resultCount, totalCount }: Props) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/50 px-6 py-4 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-500">
            Collection
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {resultCount} of {totalCount} products
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search products"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-300 transition-all"
          />
        </div>
      </div>
    </div>
  )
}
