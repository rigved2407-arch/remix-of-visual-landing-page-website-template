import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { products as fallbackProducts, Product } from '@/data/products'
import { fetchAllProducts, shopifyConfigured } from '@/lib/shopify'

type ShopifyCtx = {
  products: Product[]
  loading: boolean
  error: string | null
  isLive: boolean
  getProduct: (slug: string) => Product | undefined
  getByCategory: (category: Product['category']) => Product[]
}

const Ctx = createContext<ShopifyCtx | null>(null)

export function ShopifyProvider({ children }: { children: ReactNode }) {
  const [liveProducts, setLiveProducts] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(shopifyConfigured)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shopifyConfigured) return
    let cancelled = false
    setLoading(true)
    fetchAllProducts()
      .then(list => {
        if (cancelled) return
        setLiveProducts(list)
        setError(null)
      })
      .catch(err => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load products from Shopify')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const value = useMemo<ShopifyCtx>(() => {
    const products = liveProducts ?? fallbackProducts
    const isLive = liveProducts !== null
    return {
      products,
      loading,
      error,
      isLive,
      getProduct: (slug) => products.find(p => p.slug === slug),
      getByCategory: (category) => products.filter(p => p.category === category),
    }
  }, [liveProducts, loading, error])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useShopify() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useShopify must be used inside ShopifyProvider')
  return ctx
}