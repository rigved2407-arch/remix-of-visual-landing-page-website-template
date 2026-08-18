import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export default function Cart() {
  const { detailed, subtotal, setQty, remove, count } = useCart()
  const shipping = subtotal > 0 ? 0 : 0
  const total = subtotal + shipping

  return (
    <div className="pt-12 pb-24 container">
      <h1 className="font-serif text-5xl lg:text-7xl mb-2">Your Bag</h1>
      <p className="text-foreground/60 mb-12">{count} {count === 1 ? 'piece' : 'pieces'}</p>

      {detailed.length === 0 ? (
        <div className="py-20 text-center border-y border-border">
          <p className="font-serif text-3xl mb-4">Nothing here yet.</p>
          <Link to="/shop" className="inline-block bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.3em]">Browse Shop</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          <ul className="lg:col-span-2 divide-y divide-border border-y border-border">
            {detailed.map(({ product, qty, lineTotal }) => (
              <li key={product.id} className="py-6 flex gap-4 sm:gap-6">
                <Link to={`/product/${product.slug}`} className="w-20 h-20 sm:w-32 sm:h-32 bg-secondary shrink-0 overflow-hidden">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 flex flex-col">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/50">{product.categoryLabel}</div>
                  <Link to={`/product/${product.slug}`} className="font-serif text-2xl hover:underline underline-offset-4">{product.name}</Link>
                  <div className="text-sm text-foreground/60 mt-1">{product.materials}</div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="inline-flex items-center border border-border">
                      <button onClick={() => setQty(product.id, qty - 1)} className="p-2 hover:bg-secondary"><Minus className="w-3 h-3" /></button>
                      <span className="px-4 text-sm tabular-nums">{qty}</span>
                      <button onClick={() => setQty(product.id, qty + 1)} className="p-2 hover:bg-secondary"><Plus className="w-3 h-3" /></button>
                    </div>
                    <button onClick={() => remove(product.id)} className="text-foreground/50 hover:text-foreground inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em]">
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
                <div className="font-serif text-2xl whitespace-nowrap">{formatPrice(lineTotal, product.currency)}</div>
              </li>
            ))}
          </ul>

          <aside className="border border-border p-8 self-start sticky top-28">
            <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-foreground/60">Subtotal</span><span className="tabular-nums">{formatPrice(subtotal, detailed[0]?.product.currency)}</span></div>
              <div className="flex justify-between"><span className="text-foreground/60">Shipping</span><span className="tabular-nums">Calculated at checkout</span></div>
              <div className="border-t border-border pt-3 flex justify-between font-serif text-2xl items-baseline">
                <span>Total</span><span className="tabular-nums">{formatPrice(total, detailed[0]?.product.currency)}</span>
              </div>
            </div>
            <Link to="/checkout" className="block text-center mt-6 bg-foreground text-background py-4 text-xs uppercase tracking-[0.3em] hover:bg-foreground/80">Checkout</Link>
            <Link to="/shop" className="block text-center mt-3 text-xs uppercase tracking-[0.3em] underline underline-offset-4">Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  )
}
