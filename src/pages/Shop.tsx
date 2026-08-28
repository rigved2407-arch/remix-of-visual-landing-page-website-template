import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Category } from '@/data/products'
import { ProductGrid } from '@/components/tb/ProductCard'
import { useShopify } from '@/context/ShopifyContext'
import { motion } from 'framer-motion'

const sortOptions = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price · Low to High' },
  { id: 'price-desc', label: 'Price · High to Low' },
  { id: 'name', label: 'Alphabetical' },
] as const
type SortId = typeof sortOptions[number]['id']

const cats: { id: '' | Category; label: string }[] = [
  { id: '', label: 'All' },
  { id: 'for-him', label: 'For Him' },
  { id: 'for-her', label: 'For Her' },
  { id: 'watches', label: 'Watches' },
  { id: 'custom', label: 'Custom' },
  { id: 'other', label: 'Other' },
]

const titles: Record<Category, { t: string; s: string }> = {
  'for-him': { t: 'For Him', s: 'Iced statement pieces, chains and Cuban links built to flood the room with light.' },
  'for-her': { t: 'For Her', s: 'Refined heirlooms — studs, pendants and engagement-grade fine jewelry.' },
  'watches': { t: 'Watches', s: 'Iced-out timepieces and presidential silhouettes, hand-set in our atelier.' },
  'custom': { t: 'Custom Jewelry', s: 'Made-to-order pieces designed around you. 4–6 week build.' },
  'other': { t: 'Other', s: 'Everything else from the vault.' },
}

export default function Shop() {
  const { category } = useParams<{ category?: Category }>()
  const { products, loading } = useShopify()
  const [sort, setSort] = useState<SortId>('featured')
  const [maxPrice, setMaxPrice] = useState<number>(15000)

  const filtered = useMemo(() => {
    let list = products
    if (category) list = list.filter(p => p.category === category)
    list = list.filter(p => p.price <= maxPrice)
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break
      case 'name': list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break
    }
    return list
  }, [products, category, sort, maxPrice])

  const meta = category ? titles[category] : { t: 'The Vault', s: 'Every piece. Every category. Every price point.' }

  return (
    <div className="pt-10 pb-24 container">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
        <nav className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
          <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/shop" className="hover:text-primary">Shop</Link>
          {category && <> / <span className="text-primary">{meta.t}</span></>}
        </nav>
        <h1 className="font-serif text-4xl lg:text-6xl text-primary">{meta.t}</h1>
        <p className="text-muted-foreground mt-3 max-w-xl">{meta.s}</p>
      </motion.header>

      <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-6 border-b border-border">
        <div className="flex gap-2 flex-wrap">
          {cats.map((c) => {
            const active = (category ?? '') === c.id
            const to = c.id ? `/shop/${c.id}` : '/shop'
            return (
              <Link key={c.label} to={to} className={`text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full border transition-colors ${active ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary text-foreground'}`}>
                {c.label}
              </Link>
            )
          })}
        </div>
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Max · ${maxPrice.toLocaleString()}</label>
            <input type="range" min={300} max={15000} step={100} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="w-full sm:w-48 accent-primary" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Sort</label>
            <select value={sort} onChange={e => setSort(e.target.value as SortId)} className="bg-background border border-border rounded px-3 py-2 text-xs uppercase tracking-[0.15em] focus:outline-none focus:border-primary">
              {sortOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">{filtered.length} pieces</p>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-secondary animate-pulse" />
          ))}
        </div>
      ) : (
        <ProductGrid items={filtered} />
      )}
    </div>
  )
}