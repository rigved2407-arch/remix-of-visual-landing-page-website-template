import p1 from '@/assets/p1.jpg'
import p2 from '@/assets/p2.jpg'
import p3 from '@/assets/p3.jpg'
import p4 from '@/assets/p4.jpg'
import p5 from '@/assets/p5.jpg'
import p6 from '@/assets/p6.jpg'

export type Category = 'for-him' | 'for-her' | 'watches' | 'custom'

export type Product = {
  id: string
  slug: string
  name: string
  category: Category
  categoryLabel: 'For Him' | 'For Her' | 'Watches' | 'Custom'
  price: number
  compareAtPrice?: number
  badge?: 'SALE' | 'NEW' | 'NATURAL'
  img: string
  gallery: string[]
  description: string
  details: string[]
  materials: string
  weight: string
  stock: number
}

export const products: Product[] = [
  {
    id: '1', slug: 'royal-crown-pendant', name: 'Royal Crown Pendant',
    category: 'for-him', categoryLabel: 'For Him',
    price: 1850, compareAtPrice: 2400, badge: 'SALE',
    img: p1, gallery: [p1, p4, p6],
    description: 'A regal pendant fully paved in VVS lab diamonds, set in solid 14K white gold. Engineered for maximum light return.',
    details: ['VVS clarity lab diamonds', '14K solid white gold', 'Pavé setting', '24" rope chain included'],
    materials: '14K White Gold · 4.2ct VVS Diamonds',
    weight: '38g',
    stock: 8,
  },
  {
    id: '2', slug: '18k-cuban-bracelet', name: '18K Cuban Bracelet',
    category: 'for-him', categoryLabel: 'For Him',
    price: 4200, compareAtPrice: 5400, badge: 'SALE',
    img: p2, gallery: [p2, p3, p5],
    description: 'A heritage Cuban link bracelet, hand polished from solid 18K gold. Heirloom-grade weight, lifetime warranty.',
    details: ['Solid 18K yellow gold', 'Box clasp with safety latch', '8mm link width', 'Hand polished finish'],
    materials: '18K Yellow Gold',
    weight: '62g',
    stock: 4,
  },
  {
    id: '3', slug: 'solitaire-studs-1ct', name: 'Solitaire Diamond Studs 1.0ct',
    category: 'for-her', categoryLabel: 'For Her',
    price: 899, compareAtPrice: 1290, badge: 'SALE',
    img: p3, gallery: [p3, p5, p2],
    description: 'Brilliant round-cut solitaire studs, GIA certified, set in platinum four-prong baskets.',
    details: ['1.0ct total (0.5ct each)', 'F colour · VS1 clarity', 'Platinum 4-prong', 'GIA certified'],
    materials: 'Platinum · GIA Diamonds',
    weight: '3.4g',
    stock: 12,
  },
  {
    id: '4', slug: 'vvs-diamond-cluster', name: 'VVS Diamond Cluster Pendant',
    category: 'for-him', categoryLabel: 'For Him',
    price: 6800, compareAtPrice: 8900, badge: 'SALE',
    img: p4, gallery: [p4, p1, p6],
    description: 'A cathedral of light. 6.8ct of VVS stones in flawless invisible setting, finished in white rhodium.',
    details: ['6.8ct VVS diamonds', '14K white gold setting', 'Invisible setting', 'Includes 22" chain'],
    materials: '14K White Gold · 6.8ct VVS',
    weight: '54g',
    stock: 3,
  },
  {
    id: '5', slug: 'eternity-solitaire-ring', name: 'Eternity Solitaire Ring',
    category: 'for-her', categoryLabel: 'For Her',
    price: 950, compareAtPrice: 1400, badge: 'NATURAL',
    img: p5, gallery: [p5, p3, p2],
    description: 'Timeless solitaire with a hidden halo and full eternity band. A piece intended for forever.',
    details: ['1.5ct centre stone', 'Hidden halo accents', 'Full eternity band', 'Platinum'],
    materials: 'Platinum · 1.5ct Centre Stone',
    weight: '5.8g',
    stock: 6,
  },
  {
    id: '6', slug: 'iced-presidential-watch', name: 'Iced Presidential Watch',
    category: 'watches', categoryLabel: 'Watches',
    price: 12900, compareAtPrice: 16500, badge: 'SALE',
    img: p6, gallery: [p6, p4, p1],
    description: 'The flagship — a 41mm presidential silhouette flooded with hand-set VVS stones across case, bezel and bracelet.',
    details: ['41mm case · automatic', 'Hand-set VVS stones', 'Solid steel bracelet', '5-year movement warranty'],
    materials: 'Steel · 18ct Diamonds',
    weight: '210g',
    stock: 2,
  },
  {
    id: '7', slug: 'heart-pendant-rose', name: 'Heart Pavé Pendant',
    category: 'for-her', categoryLabel: 'For Her',
    price: 449, compareAtPrice: 699, badge: 'SALE',
    img: p3, gallery: [p3, p5],
    description: 'A romantic heart paved in natural diamonds, set in 14K rose gold with an 18" rope chain.',
    details: ['0.45ct natural diamonds', '14K rose gold', '18" rope chain', 'Lobster clasp'],
    materials: '14K Rose Gold · Natural Diamonds',
    weight: '4.1g',
    stock: 15,
  },
  {
    id: '8', slug: 'custom-iced-portrait', name: 'Custom Iced Portrait Pendant',
    category: 'custom', categoryLabel: 'Custom',
    price: 2950,
    badge: 'NEW',
    img: p1, gallery: [p1, p4],
    description: 'Your portrait, your story — hand-engraved and fully iced. Made-to-order in 4–6 weeks.',
    details: ['Made-to-order', '4–6 week build', 'Includes consultation', 'Choice of 10K, 14K or 18K'],
    materials: 'Solid Gold · VVS Diamonds',
    weight: 'Varies',
    stock: 99,
  },
]

export const getProduct = (slug: string) => products.find(p => p.slug === slug)
export const getByCategory = (cat: Category) => products.filter(p => p.category === cat)
