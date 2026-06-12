const items = [
  'Free Worldwide Shipping',
  'Lifetime Warranty',
  'VVS Lab Diamonds',
  'Solid 14K & 18K Gold',
  'Pay in 4 — 0% Interest',
  'Custom Pieces Available',
]

export function Marquee() {
  return (
    <section className="border-y border-white/10 bg-black overflow-hidden py-5">
      <div className="flex gap-16 whitespace-nowrap animate-marquee">
        {[...items, ...items, ...items].map((t, i) => (
          <div key={i} className="flex items-center gap-16 text-xs uppercase tracking-[0.35em] text-white/70">
            <span>{t}</span>
            <span className="text-primary">✦</span>
          </div>
        ))}
      </div>
    </section>
  )
}
