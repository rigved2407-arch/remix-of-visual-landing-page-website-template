export function FinancingStrip() {
  const partners = ['Afterpay', 'Progressive', 'Affirm', 'Acima', 'Snap Finance']
  return (
    <div className="bg-secondary border-b border-border">
      <div className="container flex items-center justify-center gap-6 md:gap-10 py-3 flex-wrap">
        {partners.map((p, i) => (
          <div key={p} className="flex items-center">
            <span className="text-xs font-semibold tracking-wide text-foreground/70 uppercase">{p}</span>
            {i === 2 && (
              <a href="/contact" className="hidden md:inline-flex ml-6 md:ml-8 bg-foreground text-background px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-primary transition-colors">
                Buy Now Pay Later · Apply Now
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
