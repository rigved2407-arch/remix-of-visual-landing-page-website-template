import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, RotateCcw, ArrowLeft } from 'lucide-react'
import { getProduct, products } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { ProductGrid } from '@/components/tb/ProductCard'
import { toast } from 'sonner'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getProduct(slug) : undefined
  const [qty, setQty] = useState(1)
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [zoom, setZoom] = useState(false)
  const { add } = useCart()

  if (!product) {
    return (
      <div className="pt-16 pb-24 container text-center">
        <h1 className="font-serif text-5xl mb-4">Piece not found.</h1>
        <Link to="/shop" className="inline-block mt-4 underline underline-offset-4">Back to shop</Link>
      </div>
    )
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3)

  return (
    <div className="pt-10 pb-24">
      <div className="container">
        <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-foreground/60 hover:text-foreground mb-8">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
              className="relative aspect-square bg-secondary overflow-hidden cursor-zoom-in"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
              }}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
            >
              <img
                src={product.gallery[active]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ transform: zoom ? `scale(2)` : 'scale(1)', transformOrigin: `${pos.x}% ${pos.y}%` }}
              />
            </motion.div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {product.gallery.map((g, i) => (
                <button key={i} onClick={() => setActive(i)} className={`aspect-square bg-secondary overflow-hidden border-2 transition-colors ${active === i ? 'border-foreground' : 'border-transparent hover:border-border'}`}>
                  <img src={g} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <div className="text-[10px] uppercase tracking-[0.4em] text-foreground/50 mb-3">{product.categoryLabel}</div>
            <h1 className="font-serif text-4xl lg:text-6xl leading-[1.05] mb-5">{product.name}</h1>
            <div className="font-serif text-3xl mb-8">${product.price.toLocaleString()}</div>
            <p className="text-foreground/70 leading-relaxed mb-8">{product.description}</p>

            <ul className="space-y-2 mb-10">
              {product.details.map(d => (
                <li key={d} className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="mt-1 w-1 h-1 rounded-full bg-foreground/40 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>

            <div className="flex items-stretch gap-3 mb-5">
              <div className="inline-flex items-center border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-secondary"><Minus className="w-4 h-4" /></button>
                <span className="px-5 tabular-nums">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-secondary"><Plus className="w-4 h-4" /></button>
              </div>
              <button
                onClick={() => { add(product.id, qty); toast.success(`${product.name} ×${qty} added to bag`) }}
                className="flex-1 inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.3em] hover:bg-foreground/80 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> Add to bag
              </button>
            </div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-foreground/50 mb-10">
              {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Sold Out'} · Ships in 2 business days
            </p>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              {[
                { icon: Truck, label: 'Free worldwide shipping' },
                { icon: ShieldCheck, label: 'Lifetime warranty' },
                { icon: RotateCcw, label: '30-day returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 mx-auto mb-2 text-foreground/70" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/60 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            <details className="border-t border-border pt-5 mt-8 group">
              <summary className="flex justify-between cursor-pointer text-xs uppercase tracking-[0.3em]">Materials & Weight <span className="group-open:rotate-45 transition-transform">+</span></summary>
              <div className="mt-3 text-sm text-foreground/70">{product.materials} · {product.weight}</div>
            </details>
            <details className="border-t border-border pt-5 mt-4 group">
              <summary className="flex justify-between cursor-pointer text-xs uppercase tracking-[0.3em]">Shipping & Returns <span className="group-open:rotate-45 transition-transform">+</span></summary>
              <div className="mt-3 text-sm text-foreground/70">Complimentary express shipping worldwide. 30-day return window on unworn pieces in original packaging.</div>
            </details>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-32">
            <h2 className="font-serif text-3xl lg:text-4xl mb-10">You may also love</h2>
            <ProductGrid items={related} />
          </section>
        )}
      </div>
    </div>
  )
}
