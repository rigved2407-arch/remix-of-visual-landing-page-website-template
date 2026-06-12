import { Hero } from '@/components/tb/Hero'
import { Marquee } from '@/components/tb/Marquee'
import { Categories } from '@/components/tb/Categories'
import { Bestsellers } from '@/components/tb/Bestsellers'
import { RotatingProducts } from '@/components/tb/RotatingProducts'
import { CustomJewelry } from '@/components/tb/CustomJewelry'
import { Craftsmanship } from '@/components/tb/Craftsmanship'
import { Lookbook } from '@/components/tb/Lookbook'
import { Newsletter } from '@/components/tb/Newsletter'

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <RotatingProducts />
      <Categories />
      <Bestsellers />
      <CustomJewelry />
      <Craftsmanship />
      <Lookbook />
      <Newsletter />
    </>
  )
}
