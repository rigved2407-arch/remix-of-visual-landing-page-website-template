import { motion } from 'framer-motion'
import hero from '@/assets/hero-treasure.jpg'
import iced from '@/assets/cat-iced.jpg'
import fine from '@/assets/cat-fine.jpg'
import p4 from '@/assets/p4.jpg'

const shots = [
  { img: hero, h: 'lg:row-span-2', label: 'The Drop · Vol 07' },
  { img: iced, h: '', label: 'Cuban Heritage' },
  { img: fine, h: '', label: 'Soft Power' },
  { img: p4, h: '', label: 'Cluster Series' },
]

export function Lookbook() {
  return (
    <section id="lookbook" className="py-24 lg:py-32 bg-black"><div className="container">
      <div className="text-center mb-14">
        <span className="text-xs uppercase tracking-[0.4em] text-white">Lookbook</span>
        <h2 className="font-serif text-4xl lg:text-6xl mt-3">
          Worn by the <span className="italic text-gold">bold.</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-3 lg:gap-5 lg:h-[700px]">
        {shots.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
            className={`relative overflow-hidden group ${s.h}`}
          >
            <img src={s.img} alt={s.label} loading="lazy" className="w-full h-full object-cover min-h-[200px] group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.3em] text-white">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  )
}
