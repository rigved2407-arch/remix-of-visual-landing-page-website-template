import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().trim().min(1, 'Required').max(80),
  email: z.string().trim().email('Invalid email').max(255),
  message: z.string().trim().min(5, 'Tell us a bit more').max(1000),
})

export default function Contact() {
  const [data, setData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const r = schema.safeParse(data)
    if (!r.success) {
      const fe: Record<string, string> = {}
      r.error.issues.forEach(i => { fe[i.path[0] as string] = i.message })
      setErrors(fe)
      return
    }
    setErrors({})
    toast.success('Message sent. We\'ll be in touch within 24 hours.')
    setData({ name: '', email: '', message: '' })
  }

  return (
    <div className="pt-12 pb-24 container">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-5xl lg:text-7xl mb-4">Get in touch.</motion.h1>
      <p className="text-foreground/60 mb-14 max-w-xl">Private viewings, custom pieces, press enquiries — our concierge replies within one business day.</p>

      <div className="grid lg:grid-cols-2 gap-16">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-2">Name</label>
            <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} className={`w-full bg-background border ${errors.name ? 'border-destructive' : 'border-border'} px-4 py-3 focus:outline-none focus:border-foreground`} />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-2">Email</label>
            <input type="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} className={`w-full bg-background border ${errors.email ? 'border-destructive' : 'border-border'} px-4 py-3 focus:outline-none focus:border-foreground`} />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-2">Message</label>
            <textarea rows={6} value={data.message} onChange={e => setData({ ...data, message: e.target.value })} className={`w-full bg-background border ${errors.message ? 'border-destructive' : 'border-border'} px-4 py-3 focus:outline-none focus:border-foreground resize-none`} />
            {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
          </div>
          <button type="submit" className="bg-foreground text-background px-10 py-4 text-xs uppercase tracking-[0.3em] hover:bg-foreground/80">Send Message</button>
        </form>

        <div className="space-y-8">
          {[
            { icon: MapPin, t: 'Atelier', l: '347 Canal Street, NYC' },
            { icon: Mail, t: 'Email', l: 'concierge@treasurebox.co' },
            { icon: Phone, t: 'Phone', l: '+1 (212) 555 0140' },
          ].map(({ icon: Icon, t, l }) => (
            <div key={t} className="flex gap-5 items-start border-b border-border pb-8">
              <Icon className="w-6 h-6 mt-1" />
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-1">{t}</div>
                <div className="font-serif text-2xl">{l}</div>
              </div>
            </div>
          ))}
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 mb-2">Hours</div>
            <p className="text-foreground/70">Mon — Sat · 11am – 8pm<br />Sunday by appointment</p>
          </div>
        </div>
      </div>
    </div>
  )
}
