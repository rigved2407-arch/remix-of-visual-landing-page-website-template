import type { Category, Product } from '@/data/products'

export const SHOPIFY_STORE_DOMAIN: string =
  (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined)?.trim() ?? ''

export const SHOPIFY_STOREFRONT_TOKEN: string =
  (import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined)?.trim() ?? ''

export const shopifyConfigured = SHOPIFY_STORE_DOMAIN !== ''

const API_VERSION = '2025-01'
const API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`

export type ShopLine = { merchandiseId: string; quantity: number }

type ShopResponse<T> = { data?: T; errors?: { message: string }[] }

export async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!shopifyConfigured) throw new Error('Shopify is not configured. Set VITE_SHOPIFY_STORE_DOMAIN.')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (SHOPIFY_STOREFRONT_TOKEN !== '') {
    headers['X-Shopify-Storefront-Access-Token'] = SHOPIFY_STOREFRONT_TOKEN
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`Shopify API error (${res.status})`)
  const json = (await res.json()) as ShopResponse<T>
  if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join(', '))
  if (!json.data) throw new Error('Shopify API returned no data')
  return json.data
}

type Money = { amount: string; currencyCode: string }

export type ShopifyVariant = {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable: number | null
  price: Money
  compareAtPrice: Money | null
}

export type ShopifyProductNode = {
  id: string
  handle: string
  title: string
  description: string
  productType: string
  tags: string[]
  availableForSale: boolean
  featuredImage: { url: string } | null
  images: { edges: { node: { url: string } }[] }
  variants: { edges: { node: ShopifyVariant }[] }
}

export type ProductsData = {
  products: {
    edges: { node: ShopifyProductNode }[]
    pageInfo: { hasNextPage: boolean; endCursor: string | null }
  }
}

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $cursor: String) {
    products(first: $first, after: $cursor) {
      edges {
        node {
          id
          handle
          title
          description
          productType
          tags
          availableForSale
          featuredImage { url }
          images(first: 6) { edges { node { url } } }
          variants(first: 50) {
            edges {
              node {
                id
                title
                availableForSale
                quantityAvailable
                price { amount currencyCode }
                compareAtPrice { amount }
              }
            }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`

const CATEGORY_TAGS: Record<string, Category> = {
  'for-him': 'for-him',
  'for-her': 'for-her',
  watches: 'watches',
  custom: 'custom',
}

const CATEGORY_LABELS: Record<Category, string> = {
  'for-him': 'For Him',
  'for-her': 'For Her',
  watches: 'Watches',
  custom: 'Custom',
  other: 'Other',
}

function mapCategory(tags: string[], productType: string): Category {
  for (const t of tags) {
    const c = CATEGORY_TAGS[t.trim().toLowerCase()]
    if (c) return c
  }
  const pt = productType.trim().toLowerCase().replace(/\s+/g, '-')
  const fromType = CATEGORY_TAGS[pt]
  if (fromType) return fromType
  for (const t of tags) {
    const tl = t.trim().toLowerCase()
    if (tl.includes('him') || tl.includes('men') || tl.includes('male') || tl.includes('boy')) return 'for-him'
    if (tl.includes('her') || tl.includes('women') || tl.includes('female') || tl.includes('girl')) return 'for-her'
    if (tl.includes('watch') || tl.includes('timepiece')) return 'watches'
    if (tl.includes('custom') || tl.includes('personaliz')) return 'custom'
  }
  return 'other'
}

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="100%" height="100%" fill="#e8e3da"/><text x="50%" y="50%" fill="#8a8378" font-family="serif" font-size="28" text-anchor="middle" dominant-baseline="middle">No image</text></svg>`
  )

function pickVariant(node: ShopifyProductNode): ShopifyVariant {
  const variants = node.variants.edges.map(e => e.node)
  if (variants.length === 0) {
    throw new Error(`Product ${node.title} has no variants`)
  }
  return variants.find(v => v.availableForSale) ?? variants[0]
}

function mapBadge(node: ShopifyProductNode, compareAt: number | undefined): Product['badge'] {
  const tags = node.tags.map(t => t.trim().toLowerCase())
  if (compareAt && compareAt > 0) return 'SALE'
  if (tags.includes('new')) return 'NEW'
  if (tags.includes('natural')) return 'NATURAL'
  return undefined
}

export function mapShopifyProduct(node: ShopifyProductNode): Product {
  const variant = pickVariant(node)
  const price = Number(variant.price.amount)
  const compareAt = variant.compareAtPrice ? Number(variant.compareAtPrice.amount) : undefined
  const images = node.images.edges.map(e => e.node.url)
  const img = node.featuredImage?.url ?? images[0] ?? FALLBACK_IMAGE
  const gallery = images.length > 0 ? images : [img]
  const currency = variant.price.currencyCode
  const stock = variant.availableForSale ? Math.max(1, variant.quantityAvailable ?? 5) : 0
  const category = mapCategory(node.tags, node.productType)

  return {
    id: node.id,
    variantId: variant.id,
    slug: node.handle,
    name: node.title,
    category,
    categoryLabel: CATEGORY_LABELS[category],
    price,
    compareAtPrice: compareAt && compareAt > price ? compareAt : undefined,
    badge: mapBadge(node, compareAt),
    img,
    gallery,
    description: node.description || 'A bespoke piece from our atelier.',
    details: node.tags.length > 0 ? node.tags : ['Handcrafted in our atelier'],
    materials: node.productType || 'Fine Jewelry',
    weight: 'See product',
    stock,
    currency,
  }
}

export async function fetchAllProducts(): Promise<Product[]> {
  const all: Product[] = []
  let cursor: string | null = null
  let hasNext = true
  while (hasNext) {
    const data = await shopifyFetch<ProductsData>(PRODUCTS_QUERY, { first: 100, cursor })
    const edges = data.products.edges
    for (const e of edges) {
      try {
        all.push(mapShopifyProduct(e.node))
      } catch {
        // skip products with no variants
      }
    }
    hasNext = data.products.pageInfo.hasNextPage && edges.length > 0
    cursor = data.products.pageInfo.endCursor
  }
  return all
}

export type CartCreateData = {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null
    userErrors: { field: string[] | null; message: string }[]
  }
}

const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`

export async function createShopifyCheckoutUrl(lines: ShopLine[]): Promise<string> {
  const data = await shopifyFetch<CartCreateData>(CART_CREATE_MUTATION, {
    input: { lines },
  })
  const cart = data.cartCreate.cart
  const errors = data.cartCreate.userErrors.filter(e => e.message)
  if (!cart?.checkoutUrl) {
    throw new Error(errors.length ? errors.map(e => e.message).join(', ') : 'Could not create checkout')
  }
  return cart.checkoutUrl
}