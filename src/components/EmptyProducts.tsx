import { Package } from 'lucide-react'

type Props = {
  isSearch: boolean
  searchTerm: string
}

export function EmptyProducts({ isSearch, searchTerm }: Props) {
  return (
    <div className="text-center py-20">
      <Package className="size-12 text-slate-200 mx-auto mb-4" />
      <p className="text-slate-400 font-medium text-sm">
        {isSearch
          ? `No products match "${searchTerm}".`
          : 'No products available yet.'}
      </p>
    </div>
  )
}
