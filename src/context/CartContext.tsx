import { createContext, useContext, useEffect, useMemo, useReducer, useState, ReactNode } from 'react'
import { Product } from '@/data/products'
import { useShopify } from '@/context/ShopifyContext'
import { createShopifyCheckoutUrl } from '@/lib/shopify'

export type CartItem = { productId: string; qty: number }
type State = { items: CartItem[] }
type Action =
  | { type: 'ADD'; productId: string; qty?: number }
  | { type: 'REMOVE'; productId: string }
  | { type: 'SET_QTY'; productId: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; state: State }

const KEY = 'tb_cart_v2'
const initial: State = { items: [] }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'ADD': {
      const existing = s.items.find(i => i.productId === a.productId)
      const qty = a.qty ?? 1
      if (existing) {
        return { items: s.items.map(i => i.productId === a.productId ? { ...i, qty: i.qty + qty } : i) }
      }
      return { items: [...s.items, { productId: a.productId, qty }] }
    }
    case 'REMOVE':
      return { items: s.items.filter(i => i.productId !== a.productId) }
    case 'SET_QTY':
      return { items: s.items.map(i => i.productId === a.productId ? { ...i, qty: Math.max(1, a.qty) } : i) }
    case 'CLEAR':
      return initial
    case 'HYDRATE':
      return a.state
  }
}

type Ctx = {
  items: CartItem[]
  detailed: { product: Product; qty: number; lineTotal: number }[]
  count: number
  subtotal: number
  add: (productId: string, qty?: number) => void
  remove: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
  checkout: () => Promise<string | null>
  isOpen: boolean
  open: () => void
  close: () => void
}

const CartCtx = createContext<Ctx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { products, isLive } = useShopify()
  const [state, dispatch] = useReducer(reducer, initial)
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.items)) dispatch({ type: 'HYDRATE', state: parsed as State })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<Ctx>(() => {
    const detailed = state.items
      .map(i => {
        const product = products.find(p => p.id === i.productId)
        if (!product) return null
        return { product, qty: i.qty, lineTotal: product.price * i.qty }
      })
      .filter(Boolean) as Ctx['detailed']
    const count = detailed.reduce((s, i) => s + i.qty, 0)
    const subtotal = detailed.reduce((s, i) => s + i.lineTotal, 0)

    const checkout = async (): Promise<string | null> => {
      if (!isLive) return null
      const lines = state.items
        .map(i => {
          const product = products.find(p => p.id === i.productId)
          if (!product) return null
          return { merchandiseId: product.variantId, quantity: i.qty }
        })
        .filter(Boolean) as { merchandiseId: string; quantity: number }[]
      if (lines.length === 0) return null
      return createShopifyCheckoutUrl(lines)
    }

    return {
      items: state.items,
      detailed, count, subtotal,
      add: (productId, qty) => { dispatch({ type: 'ADD', productId, qty }); setOpen(true) },
      remove: (productId) => dispatch({ type: 'REMOVE', productId }),
      setQty: (productId, qty) => dispatch({ type: 'SET_QTY', productId, qty }),
      clear: () => dispatch({ type: 'CLEAR' }),
      checkout,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
    }
  }, [state, isOpen, products, isLive])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}