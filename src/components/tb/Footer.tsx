import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '@/assets/logo-tb.jpg'
import wordmark from '@/assets/logo-wordmark.jpg'

const cols = [
  { title: 'Shop', links: [
    { label: 'For Him', to: '/shop/for-him' },
    { label: 'For Her', to: '/shop/for-her' },
    { label: 'Watches', to: '/shop/watches' },
    { label: 'Custom Jewelry', to: '/shop/custom' },
  ]},
  { title: 'Customer Care', links: [
    { label: 'Contact Us', to: '/contact' },
    { label: 'Financing', to: '/contact' },
    { label: 'Lifetime Warranty', to: '/about' },
    { label: 'Shipping & Returns', to: '/about' },
  ]},
  { title: 'House', links: [
    { label: 'Our Story', to: '/about' },
    { label: 'Custom Orders', to: '/shop/custom' },
    { label: 'Become Elite', to: '/contact' },
  ]},
]

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container">
        <div className="grid lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="Treasure Box" className="w-14 h-14 rounded-full object-cover ring-1 ring-accent/40 shadow-gold" />
              <img src={wordmark} alt="Treasure Box" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-primary-foreground/75 max-w-sm mb-6 leading-relaxed">
              Iced-out statement pieces and lavish fine jewellery — handcrafted in
              New York, shipped worldwide. Buy now, pay later available.
            </p>
            <div className="space-y-2 text-sm text-primary-foreground/75 mb-6">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent" /> (404) 909-0670</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent" /> concierge@treasurebox.co</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> 347 Canal Street, NYC</div>
            </div>
            <div className="flex gap-3">
              {[Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social" className="w-10 h-10 grid place-items-center border border-primary-foreground/20 rounded-full hover:border-accent hover:text-accent transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-xs uppercase tracking-[0.3em] text-accent mb-5 font-semibold">{c.title}</h4>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-primary-foreground/15 mb-6" />

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Treasure Box. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent">Privacy</a>
            <a href="#" className="hover:text-accent">Terms</a>
            <a href="#" className="hover:text-accent">Shipping</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
