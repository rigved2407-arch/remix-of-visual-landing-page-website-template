import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import iced from '@/assets/cat-iced.jpg'
import fine from '@/assets/cat-fine.jpg'
import p6 from '@/assets/p6.jpg'
import p1 from '@/assets/p1.jpg'

const cats = [
  { id: 'for-him', title: 'For Him', sub: 'Chains · Pendants · Rings', img: iced },
  { id: 'for-her', title: 'For Her', sub: 'Earrings · Engagement · Necklaces', img: fine },
  { id: 'watches', title: 'Watches', sub: 'Iced presidentials & classics', img: p6 },
  { id: 'custom', title: 'Custom', sub: 'Made-to-order in 4–6 weeks', img: p1 },
]

export function Categories() {
  return (
    <section className="py-16 lg:py-24 bg-black"><div className="container">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-accent font-semibold">Shop By Category</span>
          <h2 className="font-serif text-3xl lg:text-5xl mt-2 text-white">Find your flex.</h2>
        </div>
        <Link to="/shop" className="text-xs uppercase tracking-[0.25em] text-white border-b-2 border-accent hover:text-accent transition-colors pb-1">View all collections</Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {cats.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}>
            <Link to={`/shop/${c.id}`} className="group relative block aspect-[4/5] overflow-hidden rounded-xl shadow-soft">
              <img src={c.img} alt={c.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-5 lg:p-6 flex flex-col justify-end text-white">
                <h3 className="font-serif text-2xl lg:text-3xl">{c.title}</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-accent mt-1">{c.sub}</p>
                <div className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.25em] mt-3 text-white/80 group-hover:text-accent transition-colors">
                  Explore <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      </div></section>
  )
}
