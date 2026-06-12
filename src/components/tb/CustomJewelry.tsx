import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import {
  PencilRuler,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Crown,
  Watch,
  Diamond,
  Quote,
  Phone,
} from 'lucide-react'
import craft from '@/assets/craft.jpg'
import p1 from '@/assets/p1.jpg'
import p2 from '@/assets/p2.jpg'
import p3 from '@/assets/p3.jpg'
import p4 from '@/assets/p4.jpg'
import p6 from '@/assets/p6.jpg'
import iced from '@/assets/cat-iced.jpg'

type StyleKey = 'pendant' | 'ring' | 'chain' | 'grillz'
type Metal = 'gold' | 'silver' | 'platinum'
type GoldColor = 'rose-gold' | 'white-gold' | 'gold' | 'rose-white' | 'yellow-white' | 'rose-yellow'

const styles: { id: StyleKey; label: string; icon: typeof Crown; img: string; base: number }[] = [
  { id: 'pendant', label: 'Pendant', icon: Crown,    img: p1,   base: 1800 },
  { id: 'ring',    label: 'Ring',    icon: Diamond,  img: p4,   base: 2400 },
  { id: 'chain',   label: 'Chain',   icon: Watch,    img: p2,   base: 3200 },
  { id: 'grillz',  label: 'Grillz',  icon: Sparkles, img: iced, base: 1200 },
]

const metals: { id: Metal; label: string; swatch: string }[] = [
  { id: 'gold',     label: 'Gold',     swatch: 'linear-gradient(135deg,#d4a843,#8a6018)' },
  { id: 'silver',   label: 'Silver',   swatch: 'linear-gradient(135deg,#f0f0f0,#a8a8a8)' },
  { id: 'platinum', label: 'Platinum', swatch: 'linear-gradient(135deg,#e7e7ea,#7a7e85)' },
]

const goldColors: { id: GoldColor; label: string; swatch: string }[] = [
  { id: 'rose-gold',    label: 'Rose Gold',    swatch: 'linear-gradient(135deg,#e8a898,#c47060)' },
  { id: 'white-gold',   label: 'White Gold',   swatch: 'linear-gradient(135deg,#f1f1f1,#9aa0a6)' },
  { id: 'gold',         label: 'Gold',         swatch: 'linear-gradient(135deg,#f6d27a,#b07a18)' },
  { id: 'rose-white',   label: 'Rose-White',   swatch: 'linear-gradient(135deg,#e8a898,#f1f1f1)' },
  { id: 'yellow-white', label: 'Yellow-White', swatch: 'linear-gradient(135deg,#f6d27a,#f1f1f1)' },
  { id: 'rose-yellow',  label: 'Rose-Yellow',  swatch: 'linear-gradient(135deg,#e8a898,#f6d27a)' },
]

const steps = [
  { icon: PencilRuler, title: 'Consult',  text: 'Free 1:1 with our master jeweler. Share sketches, references, or just a vibe.' },
  { icon: Gem,         title: 'Design',   text: '3D render + stone selection sent for your approval before we touch metal.'     },
  { icon: Sparkles,    title: 'Craft',    text: 'Hand-set in solid gold or platinum at our NYC atelier — every detail signed off.' },
  { icon: ShieldCheck, title: 'Deliver',  text: '4–6 weeks. Insured shipping, appraisal certificate, lifetime warranty.'         },
]

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export function CustomJewelry() {
  const [style, setStyle] = useState<StyleKey>('pendant')
  const [metal, setMetal] = useState<Metal | null>(null)
  const [goldColor, setGoldColor] = useState<GoldColor | null>(null)
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const active = styles.find((s) => s.id === style)!
  const metalLabel = metal ? metals.find((m) => m.id === metal)?.label ?? '' : ''
  const goldLabel = goldColor ? goldColors.find((c) => c.id === goldColor)?.label ?? '' : ''

  const estimate = useMemo(() => {
    let m = 0
    if (metal === 'gold') m = 1.0
    else if (metal === 'silver') m = 0.6
    else if (metal === 'platinum') m = 1.4
    return m > 0 ? Math.round((active.base * m) / 50) * 50 : 0
  }, [active, metal])

  const handleStyleChange = (id: StyleKey) => {
    setStyle(id)
  }

  const handleMetalChange = (id: Metal) => {
    setMetal(id)
    if (id !== 'gold') setGoldColor(null)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3500)
  }

  return (
    <section id="custom" className="relative py-24 lg:py-32 bg-black text-white overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-accent/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[140px]" />

      <div className="container relative">

        {/* header */}
        <div className="max-w-3xl mb-14">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-accent font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Bespoke Atelier
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-7xl mt-4 leading-[1.02]">
            Build your <span className="italic text-gold">one-of-one.</span>
          </h2>
          <p className="text-white/70 mt-5 text-lg max-w-2xl leading-relaxed">
            Pick a silhouette, choose your metal, select your finish. Get an instant ballpark —
            then book a free design call with our master jeweler.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

          {/* live preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative rounded-3xl overflow-hidden aspect-[4/5] border border-white/10 shadow-gold"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={active.id}
                src={active.img}
                alt={active.label}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/70 backdrop-blur-md border border-white/15 rounded-full pl-1 pr-4 py-1">
              <span className="w-6 h-6 rounded-full ring-1 ring-white/30" style={{ background: metal ? metals.find((x) => x.id === metal)?.swatch : 'none' }} />
              <span className="text-[11px] uppercase tracking-[0.25em]">{metalLabel}{goldLabel ? ` · ${goldLabel}` : ''}</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-accent">Live Estimate</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={estimate || 'empty'}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="font-serif text-4xl lg:text-5xl text-gold leading-none mt-2"
                  >
                    {metal ? fmt.format(estimate) : '—'}
                  </motion.div>
                </AnimatePresence>
                <div className="text-[11px] text-white/55 mt-2">
                  {metal ? `Or 4 × ${fmt.format(estimate / 4)} interest-free` : 'Select metal to see estimate'}
                </div>
              </div>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.3em] text-white/55 border border-white/15 rounded-full px-3 py-1">
                {active.label}{metalLabel ? ` · ${metalLabel}` : ''}
              </span>
            </div>
          </motion.div>

          {/* configurator */}
          <div className="lg:col-span-7 space-y-7">

            {/* 01 · Silhouette */}
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <div className="text-[11px] uppercase tracking-[0.35em] text-white/55">01 · Silhouette</div>
                <div className="text-xs text-white/45">Choose a starting point</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {styles.map((opt) => {
                  const Icon = opt.icon
                  const isActive = style === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleStyleChange(opt.id)}
                      className={`group relative rounded-xl border p-4 text-left transition-all ${
                        isActive
                          ? 'border-accent bg-accent/10 shadow-gold'
                          : 'border-white/10 hover:border-white/30 bg-white/[0.02]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-3 transition-colors ${isActive ? 'text-accent' : 'text-white/70 group-hover:text-white'}`} />
                      <div className="font-serif text-lg">{opt.label}</div>
                      <div className="text-[11px] text-white/45 mt-0.5">from {fmt.format(opt.base)}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 02 · Metal */}
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <div className="text-[11px] uppercase tracking-[0.35em] text-white/55">02 · Metal</div>
                <div className="text-xs text-white/45">Solid, never plated</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {metals.map((opt) => {
                  const isActive = metal === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleMetalChange(opt.id)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                        isActive
                          ? 'border-accent bg-accent/10'
                          : 'border-white/10 hover:border-white/30 bg-white/[0.02]'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full ring-1 ring-white/20 shrink-0"
                        style={{ background: opt.swatch }}
                      />
                      <span className="text-sm text-left leading-tight">{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 03 · Colour of the Metal (only when gold is selected) */}
            {metal === 'gold' && (
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <div className="text-[11px] uppercase tracking-[0.35em] text-white/55">03 · Colour of the Metal</div>
                  <div className="text-xs text-white/45">Choose your gold colour</div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {goldColors.map((opt) => {
                    const isActive = goldColor === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setGoldColor(opt.id)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                          isActive
                            ? 'border-accent bg-accent/10'
                            : 'border-white/10 hover:border-white/30 bg-white/[0.02]'
                        }`}
                      >
                        <span
                          className="w-7 h-7 rounded-full ring-1 ring-white/20 shrink-0"
                          style={{ background: opt.swatch }}
                        />
                        <span className="text-sm text-left leading-tight">{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 04 · Personal Notes */}
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <div className="text-[11px] uppercase tracking-[0.35em] text-white/55">04 · Personal Notes</div>
                <div className="text-xs text-white/45">Tell us about your custom piece</div>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="PLEASE EXPLAIN THE SIZE REQUIRED, STONES SHAPES AND GIVE US MORE DETAILS ABOUT THE CUSTOM JEWELRY"
                rows={5}
                className="w-full resize-none rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Your Selection */}
            <div className="rounded-xl border border-white/15 bg-white/[0.04] p-5">
              <div className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4">Your Selection</div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-white/50">Piece</span>
                  <span className="text-white font-medium text-right">{active.label}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between gap-2">
                  <span className="text-white/50">Metal</span>
                  <span className="text-white font-medium text-right">{metalLabel || '—'}</span>
                </div>
                {goldColor && (
                  <>
                    <div className="h-px bg-white/10" />
                    <div className="flex justify-between gap-2">
                      <span className="text-white/50">Colour</span>
                      <span className="text-white font-medium text-right">{goldLabel}</span>
                    </div>
                  </>
                )}
                <div className="h-px bg-white/10" />
                <div className="flex justify-between gap-2">
                  <span className="text-white/50">Estimate</span>
                  <span className="text-gold font-semibold font-serif text-base">
                    {metal ? fmt.format(estimate) : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-1">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-accent/20 border border-accent text-accent px-7 py-4 rounded-lg text-sm uppercase tracking-[0.2em] font-semibold"
                  >
                    <Sparkles className="w-4 h-4" /> Request Received!
                  </motion.div>
                ) : (
                  <motion.button
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleSubmit}
                    className="group inline-flex items-center gap-3 bg-accent text-accent-foreground px-7 py-4 rounded-lg text-sm uppercase tracking-[0.2em] font-semibold hover:opacity-90 transition-all shadow-gold"
                  >
                    Submit Request
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                )}
              </AnimatePresence>

              <a
  href="https://wa.me/14049090670"
  target="_blank"
  rel="noreferrer"
  className="inline-flex items-center gap-3 border border-white/25 hover:border-accent hover:text-accent text-white px-7 py-4 rounded-lg text-sm uppercase tracking-[0.2em] font-semibold transition-all"
>
  <Phone className="w-4 h-4" />
  Book Consultation
</a>
            </div>
          </div>
        </div>

        {/* process strip */}
        <div className="mt-20 lg:mt-28">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <h3 className="font-serif text-3xl lg:text-4xl">
              From sketch to <span className="italic text-gold">heirloom</span>.
            </h3>
            <span className="text-[11px] uppercase tracking-[0.35em] text-white/55">4–6 weeks · NYC atelier</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((st, i) => (
              <motion.div
                key={st.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative border border-white/10 rounded-2xl p-6 hover:border-accent/60 transition-colors group bg-white/[0.02]"
              >
                <span className="absolute top-4 right-5 font-serif text-3xl text-white/10 group-hover:text-accent/60 transition-colors">
                  0{i + 1}
                </span>
                <st.icon className="w-6 h-6 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <div className="font-serif text-xl mb-1.5">{st.title}</div>
                <p className="text-sm text-white/65 leading-relaxed">{st.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* testimonial + recent commissions */}
        <div className="mt-20 grid lg:grid-cols-5 gap-8 items-stretch">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-8 lg:p-10 flex flex-col">
            <Quote className="w-8 h-8 text-accent mb-6" />
            <p className="font-serif text-2xl lg:text-3xl leading-snug mb-6">
              "They turned a napkin sketch into the chain I'll be buried in. Unreal craftsmanship."
            </p>
            <div className="mt-auto flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-gradient grid place-items-center font-display text-primary">
                M
              </div>
              <div>
                <div className="text-sm font-medium">Marcus J.</div>
                <div className="text-xs text-white/55 uppercase tracking-[0.2em]">Custom Cuban · 18K</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-[11px] uppercase tracking-[0.35em] text-white/55">Recent Commissions</span>
              <Link
                to="/shop/custom"
                className="text-xs uppercase tracking-[0.25em] text-accent border-b border-accent/60 hover:text-white pb-0.5"
              >
                See more
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[p1, p3, p4, p2, p6, craft].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="relative aspect-square overflow-hidden rounded-xl group"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-accent/60 transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
