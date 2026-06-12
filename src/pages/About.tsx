import { motion } from 'framer-motion'
import { Craftsmanship } from '@/components/tb/Craftsmanship'

export default function About() {
  return (
    <div className="pt-12 pb-0">
      <div className="container max-w-4xl text-center mb-16">
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] uppercase tracking-[0.4em] text-foreground/50">Est. 2014 · New York</motion.span>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="font-serif text-5xl lg:text-8xl mt-4 leading-[1.02]">
          A house built between <span className="italic">two worlds.</span>
        </motion.h1>
        <p className="mt-8 text-foreground/70 text-lg max-w-2xl mx-auto leading-relaxed">
          Treasure Box was founded on a single belief — that the boldness of the street and the polish of the
          atelier belong on the same hand. Every piece we make answers to both.
        </p>
      </div>

      <div className="container grid md:grid-cols-3 gap-8 mb-24">
        {[
          { n: '10', l: 'Years atelier' },
          { n: '40+', l: 'Master jewellers' },
          { n: '120hr', l: 'Per statement piece' },
        ].map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="text-center border border-border py-10"
          >
            <div className="font-serif text-6xl">{s.n}</div>
            <div className="text-xs uppercase tracking-[0.3em] text-foreground/60 mt-2">{s.l}</div>
          </motion.div>
        ))}
      </div>

      <Craftsmanship />
    </div>
  )
}
