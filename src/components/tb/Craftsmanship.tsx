import { motion } from 'framer-motion'
import craft from '@/assets/craft.jpg'

const stats = [
  { v: '40+', l: 'Master jewellers' },
  { v: '120hrs', l: 'Per statement piece' },
  { v: '100%', l: 'Conflict-free stones' },
]

export function Craftsmanship() {
  return (
    <section id="craft" className="py-24 lg:py-32 bg-black border-y border-white/10">
      <div className="container grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] overflow-hidden"
        >
          <img src={craft} alt="Master jeweller setting a diamond by hand" loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/20" />
          <div className="absolute -bottom-6 -right-6 hidden md:block w-40 h-40 border border-white/20 -z-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-xs uppercase tracking-[0.4em] text-white">The Atelier</span>
          <h2 className="font-serif text-4xl lg:text-6xl mt-4 mb-6 leading-[1.05]">
            Hand set. <span className="italic text-gold">Heart sworn.</span>
          </h2>
          <div className="gold-divider mb-8 max-w-xs" />
          <p className="text-white/75 text-lg leading-relaxed mb-6">
            Every Treasure Box piece is forged in our New York atelier by jewellers
            with three generations of experience. Each diamond is set under the loupe,
            each link weighed in solid gold. Nothing is plated. Nothing is rushed.
          </p>
          <p className="text-white/75 text-lg leading-relaxed mb-10">
            We believe a chain should outlive a trend — and a trend should never
            outshine the craft behind it.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
            {stats.map((s) => (
              <div key={s.l}>
                <div className="font-serif text-3xl lg:text-4xl text-gold mb-1">{s.v}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/60">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
