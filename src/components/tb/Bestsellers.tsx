import { Link } from 'react-router-dom'
import { ProductGrid } from '@/components/tb/ProductCard'
import { useShopify } from '@/context/ShopifyContext'

export function Bestsellers() {
  const { products } = useShopify()
  const featured = products.slice(0, 8)
  return (
    <section id="bestsellers" className="py-16 lg:py-24 bg-black">
      <div className="container">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-accent font-semibold">Bestsellers</span>
            <h2 className="font-serif text-3xl lg:text-5xl mt-2 text-white">From the Vault</h2>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-[0.25em] text-white border-b-2 border-accent hover:text-accent transition-colors pb-1">View all</Link>
        </div>
        <ProductGrid items={featured} />
      </div>
    </section>
  )
}

export function UnderBudget() {
  const { products } = useShopify()
  const list = products.filter(p => p.price < 1000)
  if (list.length === 0) return null
  return (
    <section className="py-16 lg:py-24 bg-black">
      <div className="container">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <span className="inline-block bg-destructive text-destructive-foreground text-[10px] uppercase tracking-[0.25em] font-bold px-3 py-1 rounded mb-3">Deals</span>
          <h2 className="font-serif text-3xl lg:text-5xl text-white">Under $1,000</h2>
        </div>
        <Link to="/shop" className="text-xs uppercase tracking-[0.25em] text-white border-b-2 border-accent hover:text-accent transition-colors pb-1">View all</Link>
      </div>
      <ProductGrid items={list} />
      </div>
    </section>
  )
}
