import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Heart } from 'lucide-react'
import { Product } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { toast } from 'sonner'

const badgeStyles: Record<NonNullable<Product['badge']>, string> = {
  SALE: 'bg-destructive text-destructive-foreground',
  NEW: 'bg-primary text-primary-foreground',
  NATURAL: 'bg-secondary text-primary border border-primary/30',
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart()
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="product-card group flex flex-col"
    >
      <Link to={`/product/${product.slug}`} className="relative block aspect-square bg-secondary overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1 rounded ${badgeStyles[product.badge]}`}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-[11px] font-bold rounded-full w-12 h-12 grid place-items-center shadow-gold">
            -{discount}%
          </span>
        )}
        <button
          aria-label={`Wishlist ${product.name}`}
          onClick={(e) => { e.preventDefault(); toast.success(`${product.name} added to wishlist`) }}
          className="absolute bottom-3 left-3 w-9 h-9 grid place-items-center bg-background/90 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all text-foreground/70 hover:text-destructive"
        >
          <Heart className="w-4 h-4" />
        </button>
        <button
          aria-label={`Quick add ${product.name}`}
          onClick={(e) => { e.preventDefault(); add(product.id); toast.success(`${product.name} added to bag`) }}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all hover:bg-accent hover:text-accent-foreground"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </Link>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{product.categoryLabel}</div>
        <h3 className="font-medium text-sm leading-snug min-h-[2.5rem]">
          <Link to={`/product/${product.slug}`} className="hover:text-primary transition-colors">{product.name}</Link>
        </h3>
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="font-serif text-xl text-primary font-semibold">${product.price.toLocaleString()}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">${product.compareAtPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export function ProductGrid({ items }: { items: Product[] }) {
  if (items.length === 0) {
    return <p className="text-center py-20 text-muted-foreground">No pieces match these filters.</p>
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </div>
  )
}
