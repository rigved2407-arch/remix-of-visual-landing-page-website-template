import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useEffect } from 'react'

export function CartDrawer() {
  const { isOpen, close, detailed, subtotal, setQty, remove, count } = useCart()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 z-[60] backdrop-blur-sm"
            onClick={close}
          />
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-background z-[70] flex flex-col border-l border-border"
          >
            <header className="flex items-center justify-between px-6 h-20 border-b border-border">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">Your Bag</div>
                <div className="font-serif text-2xl">{count} {count === 1 ? 'piece' : 'pieces'}</div>
              </div>
              <button aria-label="Close cart" onClick={close} className="p-2 hover:text-foreground text-foreground/60">
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {detailed.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <p className="font-serif text-2xl mb-2">Your treasure box is empty.</p>
                  <p className="text-sm text-foreground/60 mb-8">Discover the latest drops.</p>
                  <Link onClick={close} to="/shop" className="bg-foreground text-background px-8 py-3 text-xs uppercase tracking-[0.3em]">
                    Browse Shop
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {detailed.map(({ product, qty, lineTotal }) => (
                    <li key={product.id} className="py-5 flex gap-4">
                      <Link to={`/product/${product.slug}`} onClick={close} className="block w-24 h-24 bg-secondary overflow-hidden shrink-0">
                        <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/50">{product.categoryLabel}</div>
                        <Link to={`/product/${product.slug}`} onClick={close} className="font-serif text-lg leading-tight block truncate">{product.name}</Link>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center border border-border">
                            <button aria-label="Decrease" onClick={() => setQty(product.id, qty - 1)} className="p-1.5 hover:bg-secondary">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-sm tabular-nums">{qty}</span>
                            <button aria-label="Increase" onClick={() => setQty(product.id, qty + 1)} className="p-1.5 hover:bg-secondary">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="font-serif text-lg">${lineTotal.toLocaleString()}</div>
                        </div>
                      </div>
                      <button aria-label="Remove" onClick={() => remove(product.id)} className="text-foreground/40 hover:text-foreground self-start">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {detailed.length > 0 && (
              <footer className="border-t border-border px-6 py-5 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-foreground/60">Subtotal</span>
                  <span className="font-serif text-3xl">${subtotal.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-foreground/50">Shipping and taxes calculated at checkout.</p>
                <Link
                  onClick={close}
                  to="/checkout"
                  className="block text-center bg-foreground text-background py-4 text-xs uppercase tracking-[0.3em] hover:bg-foreground/80 transition-colors"
                >
                  Checkout
                </Link>
                <Link onClick={close} to="/cart" className="block text-center text-xs uppercase tracking-[0.3em] underline underline-offset-4 hover:opacity-70">
                  View full bag
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
