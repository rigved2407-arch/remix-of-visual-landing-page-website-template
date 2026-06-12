import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { ShoppingBag, Search, Menu, X, User, ChevronDown } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useConfigurator } from '@/context/ConfiguratorContext'
import logo from '@/assets/logo-tb.jpg'
import wordmark from '@/assets/logo-wordmark.jpg'

const links: { label: string; to: string; isCustom?: boolean; children?: { label: string; to: string }[] }[] = [
  { label: 'Home', to: '/' },
  {
    label: 'For Him', to: '/shop/for-him',
    children: [
      { label: 'Chains & Pendants', to: '/shop/for-him' },
      { label: 'Bracelets', to: '/shop/for-him' },
      { label: 'Rings', to: '/shop/for-him' },
    ],
  },
  {
    label: 'For Her', to: '/shop/for-her',
    children: [
      { label: 'Engagement', to: '/shop/for-her' },
      { label: 'Earrings', to: '/shop/for-her' },
      { label: 'Necklaces', to: '/shop/for-her' },
    ],
  },
  { label: 'Custom Jewelry', to: '#', isCustom: true },
  { label: 'Watches', to: '/shop/watches' },
  {
    label: 'Contact & map', to: '/contact',
    children: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'Find Our Store', to: '/contact' },
    ],
  },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const { count, open: openCart } = useCart()
  const { openConfigurator } = useConfigurator()

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-soft">
      <div className="container flex items-center justify-between h-20 gap-6">
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img src={logo} alt="Treasure Box" className="w-12 h-12 rounded-full object-cover ring-1 ring-accent/40 shadow-gold" />
          <img src={wordmark} alt="Treasure Box" className="hidden sm:block h-10 lg:h-11 w-auto object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <div key={l.label} className="relative group">
              {l.isCustom ? (
                <button
                  onClick={openConfigurator}
                  className="text-sm font-medium flex items-center gap-1 transition-colors text-accent hover:text-accent/80 border border-accent/40 hover:border-accent px-3 py-1.5 rounded-full"
                >
                  {l.label}
                </button>
              ) : (
                <>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `text-sm font-medium flex items-center gap-1 transition-colors ${
                        isActive ? 'text-accent' : 'text-primary-foreground/90 hover:text-accent'
                      }`
                    }
                  >
                    {l.label}
                    {l.children && <ChevronDown className="w-3 h-3 opacity-70" />}
                  </NavLink>
                  {l.children && (
                    <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="bg-background text-foreground rounded-lg shadow-soft border border-border min-w-[200px] p-2">
                        {l.children.map((c) => (
                          <Link key={c.label} to={c.to} className="block px-4 py-2 text-sm rounded hover:bg-secondary hover:text-primary transition-colors">
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button aria-label="Search" className="p-2.5 hover:text-accent text-primary-foreground/80 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <Link to="/account" aria-label="Account" className="p-2.5 hover:text-accent text-primary-foreground/80 transition-colors hidden sm:block">
            <User className="w-5 h-5" />
          </Link>
          <button onClick={openCart} aria-label="Cart" className="p-2.5 hover:text-accent text-primary-foreground/80 transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-accent text-[11px] font-bold text-accent-foreground grid place-items-center pulse-ring">
                {count}
              </span>
            )}
          </button>
          <button aria-label="Menu" className="lg:hidden p-2.5" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-primary border-t border-primary-foreground/10">
          <div className="container py-6 flex flex-col gap-1">
            {links.map((l) =>
              l.isCustom ? (
                <button
                  key={l.label}
                  onClick={() => { setOpen(false); openConfigurator() }}
                  className="py-3 border-b border-primary-foreground/10 text-sm font-medium text-accent text-left"
                >
                  {l.label}
                </button>
              ) : (
                <NavLink
                  key={l.label}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `py-3 border-b border-primary-foreground/10 text-sm font-medium ${isActive ? 'text-accent' : 'text-primary-foreground/90'}`
                  }
                >
                  {l.label}
                </NavLink>
              )
            )}
          </div>
        </div>
      )}
    </header>
  )
}
