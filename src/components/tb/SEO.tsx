import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useShopify } from '@/context/ShopifyContext'
import type { Product } from '@/data/products'

const SITE_URL = 'https://treasureboxus.com'
const BRAND = 'Treasure Box'
const DEFAULT_DESCRIPTION = 'Shop iced-out chains, diamond jewelry, luxury watches, and custom pieces from Treasure Box, a New York jewelry house shipping worldwide.'

type SeoConfig = {
  title: string
  description: string
  noindex?: boolean
  type?: 'website' | 'product'
  image?: string
  product?: Product
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    document.head.appendChild(element)
  }
  element.href = href
}

export function SEO() {
  const { pathname } = useLocation()
  const { getProduct } = useShopify()
  const slug = pathname.startsWith('/product/') ? pathname.split('/').pop() : undefined
  const product = slug ? getProduct(slug) : undefined

  let config: SeoConfig = {
    title: 'Iced-Out Jewelry & Luxury Watches | Treasure Box',
    description: DEFAULT_DESCRIPTION,
  }

  if (pathname === '/shop') {
    config = { title: 'Shop Iced-Out Jewelry & Luxury Watches | Treasure Box', description: 'Explore the Treasure Box vault: diamond pendants, gold chains, fine jewelry, custom pieces, and iced-out luxury watches.' }
  } else if (pathname === '/shop/for-him') {
    config = { title: 'Men\'s Iced-Out Chains, Pendants & Bracelets | Treasure Box', description: 'Shop men\'s iced-out chains, Cuban link bracelets, diamond pendants, and statement jewelry crafted in gold and VVS diamonds.' }
  } else if (pathname === '/shop/for-her') {
    config = { title: 'Women\'s Fine Jewelry & Diamond Pieces | Treasure Box', description: 'Discover diamond studs, pendants, rings, and refined fine jewelry designed for everyday luxury and unforgettable moments.' }
  } else if (pathname === '/shop/watches') {
    config = { title: 'Iced-Out Luxury Watches | Treasure Box', description: 'Browse iced-out luxury watches with hand-set stones, presidential silhouettes, and warranty-backed craftsmanship from Treasure Box.' }
  } else if (pathname === '/shop/custom') {
    config = { title: 'Custom Iced Jewelry & Bespoke Pendants | Treasure Box', description: 'Create a one-of-one custom jewelry piece with Treasure Box. Made-to-order portraits and statement pendants built around your story.' }
  } else if (pathname === '/about') {
    config = { title: 'About Treasure Box | New York Fine Jewelry House', description: 'Meet Treasure Box, a New York jewelry house blending street-born boldness with atelier craftsmanship, lifetime service, and worldwide shipping.' }
  } else if (pathname === '/contact') {
    config = { title: 'Contact Treasure Box Jewelry Concierge | New York', description: 'Contact the Treasure Box concierge for private viewings, custom jewelry, press inquiries, shipping questions, and appointment requests.' }
  } else if (pathname.startsWith('/product/') && product) {
    config = {
      title: `${product.name} | Treasure Box`,
      description: product.description,
      type: 'product',
      image: product.img,
      product,
    }
  } else if (pathname === '/cart' || pathname === '/checkout' || pathname === '/order-confirmed' || pathname === '/404') {
    config = { title: `${BRAND} | Private Shopping`, description: DEFAULT_DESCRIPTION, noindex: true }
  } else if (pathname !== '/') {
    config = { title: `Page Not Found | ${BRAND}`, description: DEFAULT_DESCRIPTION, noindex: true }
  }

  useEffect(() => {
    const canonical = `${SITE_URL}${pathname === '/' ? '' : pathname}`
    const image = config.image ? new URL(config.image, SITE_URL).toString() : `${SITE_URL}/og-image.jpg`
    document.title = config.title
    upsertLink('canonical', canonical)
    upsertMeta('description', 'description', config.description)
    upsertMeta('robots', 'robots', config.noindex ? 'noindex, nofollow' : 'index, follow')
    upsertMeta('og:title', 'og:title', config.title)
    upsertMeta('og:description', 'og:description', config.description)
    upsertMeta('og:type', 'og:type', config.type ?? 'website')
    upsertMeta('og:url', 'og:url', canonical)
    upsertMeta('og:image', 'og:image', image)
    upsertMeta('twitter:card', 'twitter:card', 'summary_large_image')
    upsertMeta('twitter:title', 'twitter:title', config.title)
    upsertMeta('twitter:description', 'twitter:description', config.description)
    upsertMeta('twitter:image', 'twitter:image', image)

    const id = 'treasure-box-structured-data'
    document.getElementById(id)?.remove()
    const script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    const graph: Record<string, unknown>[] = [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: BRAND,
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.ico`,
        email: 'mailto:concierge@treasurebox.co',
        telephone: '+1-404-909-0670',
        address: { '@type': 'PostalAddress', streetAddress: '347 Canal Street', addressLocality: 'New York', addressRegion: 'NY', addressCountry: 'US' },
      },
      { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: BRAND, url: SITE_URL, publisher: { '@id': `${SITE_URL}/#organization` } },
    ]
    if (config.product) {
      graph.push({
        '@type': 'Product',
        name: config.product.name,
        description: config.product.description,
        image: config.product.gallery.map((item) => new URL(item, SITE_URL).toString()),
        sku: config.product.id,
        brand: { '@type': 'Brand', name: BRAND },
        offers: { '@type': 'Offer', url: canonical, priceCurrency: config.product.currency, price: config.product.price, availability: config.product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', itemCondition: 'https://schema.org/NewCondition' },
      })
    }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
    document.head.appendChild(script)

    return () => document.getElementById(id)?.remove()
  }, [config.description, config.image, config.noindex, config.product, config.title, config.type, pathname])

  return null
}
