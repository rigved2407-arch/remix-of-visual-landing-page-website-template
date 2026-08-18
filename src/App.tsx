import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/tb/Layout'
import { ShopifyProvider } from './context/ShopifyContext'
import { CartProvider } from './context/CartContext'
import { ConfiguratorProvider } from './context/ConfiguratorContext'
import { JewelryConfiguratorModal } from './components/tb/JewelryConfiguratorModal'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmed from './pages/OrderConfirmed'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <Shop /> },
      { path: '/shop/:category', element: <Shop /> },
      { path: '/product/:slug', element: <ProductDetail /> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/order-confirmed', element: <OrderConfirmed /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return (
    <ShopifyProvider>
      <CartProvider>
        <ConfiguratorProvider>
          <RouterProvider router={router} />
          <JewelryConfiguratorModal />
        </ConfiguratorProvider>
      </CartProvider>
    </ShopifyProvider>
  )
}
