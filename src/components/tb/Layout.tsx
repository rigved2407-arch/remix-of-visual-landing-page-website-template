import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { CartDrawer } from './CartDrawer'
import { Toaster } from 'sonner'

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toaster position="bottom-right" theme="light" richColors />
      <ScrollRestoration />
    </div>
  )
}
