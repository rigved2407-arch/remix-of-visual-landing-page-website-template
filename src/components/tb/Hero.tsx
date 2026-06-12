import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import hero from '@/assets/hero-treasure.jpg'
import iced from '@/assets/cat-iced.jpg'
import fine from '@/assets/cat-fine.jpg'
import p1 from '@/assets/p1.jpg'
import p4 from '@/assets/p4.jpg'
import p6 from '@/assets/p6.jpg'

const slides = [hero, iced, fine, p1, p4, p6]

export function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative min-h-[78vh] lg:min-h-[88vh] w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={i}
            src={slides[i]}
            alt="Treasure Box jewelry showcase"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </div>

      <div className="relative container min-h-[78vh] lg:min-h-[88vh] flex flex-col justify-center pb-16 pt-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }} className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-12 bg-accent" />
            <span className="text-xs uppercase tracking-[0.4em] text-accent font-semibold">Holiday Drop · Vol. 07</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl leading-[0.95] mb-7">
            Become <span className="text-gold italic">Elite.</span>
          </h1>
          <p className="text-lg text-white/85 max-w-xl mb-10 leading-relaxed">
            Hand-iced statement pieces, GIA-certified diamonds and presidential watches.
            Free shipping. Lifetime warranty. Buy now, pay later.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/shop" className="group inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 rounded-lg text-sm uppercase tracking-[0.2em] font-semibold hover:opacity-90 transition-all shadow-gold">
              Shop now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/shop/watches" className="inline-flex items-center gap-3 border border-accent/60 hover:border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-4 rounded-lg text-sm uppercase tracking-[0.2em] font-semibold transition-all">
              View Watches
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-8 bg-accent' : 'w-3 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
