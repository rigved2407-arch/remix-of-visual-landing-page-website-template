import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useShopify } from '@/context/ShopifyContext'
import { formatPrice } from '@/lib/utils'
import { Lock, CheckCircle2, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

export default function Checkout() {
  const { detailed, subtotal, clear, count, checkout } = useCart()
  const { isLive } = useShopify()
  const nav = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  if (count === 0) {
    return (
      <div className="pt-16 pb-24 container text-center">
        <h1 className="font-serif text-5xl mb-4">Your bag is empty.</h1>
        <Link to="/shop" className="inline-block bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.3em] mt-4">Browse Shop</Link>
      </div>
    )
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const url = await checkout()
      if (url) {
        window.location.href = url
        return
      }
      await new Promise(r => setTimeout(r, 1200))
      const orderId = 'TB-' + Math.random().toString(36).slice(2, 8).toUpperCase()
      clear()
      nav(`/order-confirmed?id=${orderId}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not start checkout')
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-12 pb-24 container">
      <h1 className="font-serif text-5xl lg:text-6xl mb-2">Checkout</h1>
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-foreground/60 mb-10">
        <Lock className="w-3 h-3" /> Secure checkout
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="border border-border p-6 sm:p-10">
            <h2 className="font-serif text-2xl mb-3">Almost there</h2>
            <p className="text-sm text-foreground/70 leading-relaxed mb-8">
              {isLive
                ? 'You will be taken to our secure Shopify checkout to complete shipping, payment and place your order.'
                : 'Demo mode — no real charges. Connecting your Shopify store enables real checkout with cards, Shop Pay and more.'}
            </p>
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.3em] hover:bg-foreground/80 transition-colors disabled:opacity-60"
            >
              {submitting ? 'Redirecting to secure checkout…' : `Continue · ${formatPrice(subtotal, detailed[0]?.product.currency)}`}
            </button>
            <p className="text-[11px] text-foreground/50 flex items-center gap-1 mt-4"><Lock className="w-3 h-3" /> Payments processed by Shopify — your card details never touch this site.</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { icon: Truck, label: 'Free worldwide shipping' },
              { icon: ShieldCheck, label: 'Lifetime warranty' },
              { icon: RotateCcw, label: '30-day returns' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-center border border-border p-4">
                <Icon className="w-5 h-5 mx-auto mb-2 text-foreground/70" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/60 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="border border-border p-6 sm:p-8 self-start lg:sticky lg:top-28">
          <h2 className="font-serif text-xl mb-5">In your bag</h2>
          <ul className="divide-y divide-border mb-5">
            {detailed.map(({ product, qty, lineTotal }) => (
              <li key={product.id} className="py-3 flex gap-3 items-center">
                <div className="relative w-14 h-14 bg-secondary overflow-hidden">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-background text-[10px] grid place-items-center">{qty}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{product.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">{product.categoryLabel}</div>
                </div>
                <div className="text-sm tabular-nums">{formatPrice(lineTotal, product.currency)}</div>
              </li>
            ))}
          </ul>
          <div className="space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between"><span className="text-foreground/60">Subtotal</span><span className="tabular-nums">{formatPrice(subtotal, detailed[0]?.product.currency)}</span></div>
            <div className="flex justify-between"><span className="text-foreground/60">Shipping</span><span>Calculated at checkout</span></div>
            <div className="flex justify-between font-serif text-2xl pt-3 border-t border-border"><span>Total</span><span className="tabular-nums">{formatPrice(subtotal, detailed[0]?.product.currency)}</span></div>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-foreground/50 mt-5">
            <CheckCircle2 className="w-3 h-3" /> Lifetime warranty included
          </div>
        </aside>
      </div>
    </div>
  )
}