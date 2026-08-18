import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductGrid } from '@/components/tb/ProductCard'
import { useShopify } from '@/context/ShopifyContext'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom(list: ReturnType<typeof useShopify>['products'], count: number) {
  // Pull at least one from each category when possible
  const cats = Array.from(new Set(list.map((p) => p.category)))
  const picked: typeof list = []
  cats.forEach((c) => {
    const pool = list.filter((p) => p.category === c)
    if (pool.length) picked.push(pool[Math.floor(Math.random() * pool.length)])
  })
  const rest = shuffle(list.filter((p) => !picked.includes(p)))
  return [...picked, ...rest].slice(0, count)
}

export function RotatingProducts() {
  const { products } = useShopify()
  const [seed, setSeed] = useState(0)
  const list = useMemo(() => pickRandom(products, 8), [products, seed])

  useEffect(() => {
    const t = setInterval(() => setSeed((s) => s + 1), 7000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="py-16 lg:py-24 bg-black">
      <div className="container">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <span className="inline-block bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.25em] font-bold px-3 py-1 rounded mb-3">
              Live Picks
            </span>
            <h2 className="font-serif text-3xl lg:text-5xl text-white">
              Curated for <span className="italic text-gold">you</span>
            </h2>
            <p className="text-white/60 text-sm mt-2 uppercase tracking-[0.25em]">Refreshing across every category</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="text-xs uppercase tracking-[0.25em] text-accent border-b-2 border-accent hover:text-white hover:border-white transition-colors pb-1"
            >
              Shuffle
            </button>
            <Link to="/shop" className="text-xs uppercase tracking-[0.25em] text-white border-b-2 border-accent hover:text-accent transition-colors pb-1">
              View all
            </Link>
          </div>
        </div>
        <ProductGrid items={list} />
      </div>
    </section>
  )
}
