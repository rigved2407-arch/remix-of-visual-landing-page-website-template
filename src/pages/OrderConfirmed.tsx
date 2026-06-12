import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export default function OrderConfirmed() {
  const [params] = useSearchParams()
  const id = params.get('id') ?? 'TB-000000'
  return (
    <div className="pt-12 pb-24 container max-w-2xl text-center">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: 'spring' }} className="inline-block mb-8">
        <CheckCircle2 className="w-20 h-20" strokeWidth={1} />
      </motion.div>
      <h1 className="font-serif text-5xl lg:text-6xl mb-4">Thank you.</h1>
      <p className="text-foreground/70 text-lg mb-8">Your treasure is on its way. A confirmation has been sent to your email.</p>
      <div className="border border-border p-6 mb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-2">Order number</div>
        <div className="font-serif text-3xl">{id}</div>
      </div>
      <Link to="/shop" className="inline-block bg-foreground text-background px-10 py-4 text-xs uppercase tracking-[0.3em]">Continue shopping</Link>
    </div>
  )
}
