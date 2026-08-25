import { Package } from 'lucide-react'

type Props = {
  isSearch: boolean
  searchTerm: string
}

export function EmptyProducts({ isSearch, searchTerm }: Props) {
  return (
    <div className="text-center py-20 border-2 border-dashed border-stone-300">
      <Package className="size-12 text-stone-300 mx-auto mb-4" />
      <p className="text-stone-500 font-medium">
        {isSearch
          ? `No products match "${searchTerm}".`
          : 'No products available yet.'}
      </p>
    </div>
  )
}
