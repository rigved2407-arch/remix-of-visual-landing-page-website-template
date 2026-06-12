import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useCart } from '@/context/CartContext'
import { Lock, CheckCircle2 } from 'lucide-react'

const schema = z.object({
  email: z.string().trim().email('Invalid email').max(255),
  firstName: z.string().trim().min(1, 'Required').max(50),
  lastName: z.string().trim().min(1, 'Required').max(50),
  address: z.string().trim().min(3, 'Required').max(200),
  city: z.string().trim().min(1, 'Required').max(80),
  zip: z.string().trim().min(3, 'Required').max(15),
  country: z.string().trim().min(2).max(60),
  card: z.string().trim().regex(/^[0-9 ]{12,23}$/, 'Card number looks invalid'),
  exp: z.string().trim().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'MM/YY'),
  cvc: z.string().trim().regex(/^\d{3,4}$/, 'CVC invalid'),
})

type Form = z.infer<typeof schema>

export default function Checkout() {
  const { detailed, subtotal, clear, count } = useCart()
  const nav = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [data, setData] = useState<Form>({
    email: '', firstName: '', lastName: '', address: '', city: '', zip: '', country: 'United States',
    card: '', exp: '', cvc: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  if (count === 0) {
    return (
      <div className="pt-16 pb-24 container text-center">
        <h1 className="font-serif text-5xl mb-4">Your bag is empty.</h1>
        <Link to="/shop" className="inline-block bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.3em] mt-4">Browse Shop</Link>
      </div>
    )
  }

  const update = (k: keyof Form, v: string) => setData(d => ({ ...d, [k]: v }))

  const validateStep = (s: 1 | 2): boolean => {
    const keys: (keyof Form)[] = s === 1
      ? ['email', 'firstName', 'lastName', 'address', 'city', 'zip', 'country']
      : ['card', 'exp', 'cvc']
    const partial = Object.fromEntries(keys.map(k => [k, data[k]]))
    const res = schema.partial().safeParse({ ...data, ...partial })
    if (res.success) { setErrors({}); return true }
    const fieldErrors: typeof errors = {}
    res.error.issues.forEach(i => {
      const k = i.path[0] as keyof Form
      if (keys.includes(k)) fieldErrors[k] = i.message
    })
    setErrors(fieldErrors)
    return Object.keys(fieldErrors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(2)) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1400))
    const orderId = 'TB-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    clear()
    nav(`/order-confirmed?id=${orderId}`)
  }

  const inputCls = (k: keyof Form) =>
    `w-full bg-background border ${errors[k] ? 'border-destructive' : 'border-border'} px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors`

  return (
    <div className="pt-12 pb-24 container">
      <h1 className="font-serif text-5xl lg:text-6xl mb-2">Checkout</h1>
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-foreground/60 mb-10">
        <Lock className="w-3 h-3" /> Secure checkout
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <form className="lg:col-span-2 space-y-10" onSubmit={onSubmit}>
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className={`w-7 h-7 grid place-items-center rounded-full text-xs font-bold ${step >= 1 ? 'bg-foreground text-background' : 'border border-border'}`}>1</span>
              <h2 className="font-serif text-2xl">Shipping</h2>
              {step === 2 && <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs uppercase tracking-[0.3em] underline underline-offset-4">Edit</button>}
            </div>
            {step === 1 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <input placeholder="Email" value={data.email} onChange={e => update('email', e.target.value)} className={inputCls('email')} />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div><input placeholder="First name" value={data.firstName} onChange={e => update('firstName', e.target.value)} className={inputCls('firstName')} />{errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}</div>
                <div><input placeholder="Last name" value={data.lastName} onChange={e => update('lastName', e.target.value)} className={inputCls('lastName')} />{errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}</div>
                <div className="sm:col-span-2"><input placeholder="Address" value={data.address} onChange={e => update('address', e.target.value)} className={inputCls('address')} />{errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}</div>
                <div><input placeholder="City" value={data.city} onChange={e => update('city', e.target.value)} className={inputCls('city')} />{errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}</div>
                <div><input placeholder="ZIP / Postcode" value={data.zip} onChange={e => update('zip', e.target.value)} className={inputCls('zip')} />{errors.zip && <p className="text-xs text-destructive mt-1">{errors.zip}</p>}</div>
                <div className="sm:col-span-2"><input placeholder="Country" value={data.country} onChange={e => update('country', e.target.value)} className={inputCls('country')} /></div>
                <button type="button" onClick={() => { if (validateStep(1)) setStep(2) }} className="sm:col-span-2 bg-foreground text-background py-4 text-xs uppercase tracking-[0.3em] mt-2 hover:bg-foreground/80">Continue to Payment</button>
              </div>
            ) : (
              <div className="text-sm text-foreground/70 space-y-1">
                <div>{data.firstName} {data.lastName} · {data.email}</div>
                <div>{data.address}, {data.city} {data.zip}, {data.country}</div>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className={`w-7 h-7 grid place-items-center rounded-full text-xs font-bold ${step >= 2 ? 'bg-foreground text-background' : 'border border-border'}`}>2</span>
              <h2 className="font-serif text-2xl">Payment</h2>
            </div>
            {step === 2 ? (
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <input placeholder="Card number" inputMode="numeric" value={data.card} onChange={e => update('card', e.target.value.replace(/[^0-9 ]/g, ''))} className={inputCls('card')} />
                  {errors.card && <p className="text-xs text-destructive mt-1">{errors.card}</p>}
                </div>
                <div className="sm:col-span-2"><input placeholder="MM/YY" value={data.exp} onChange={e => update('exp', e.target.value)} className={inputCls('exp')} />{errors.exp && <p className="text-xs text-destructive mt-1">{errors.exp}</p>}</div>
                <div><input placeholder="CVC" inputMode="numeric" value={data.cvc} onChange={e => update('cvc', e.target.value.replace(/\D/g, ''))} className={inputCls('cvc')} />{errors.cvc && <p className="text-xs text-destructive mt-1">{errors.cvc}</p>}</div>
                <button type="submit" disabled={submitting} className="sm:col-span-3 bg-foreground text-background py-4 text-xs uppercase tracking-[0.3em] mt-2 hover:bg-foreground/80 disabled:opacity-60">
                  {submitting ? 'Processing…' : `Pay $${subtotal.toLocaleString()}`}
                </button>
                <p className="sm:col-span-3 text-[11px] text-foreground/50 flex items-center gap-1"><Lock className="w-3 h-3" /> Test mode — no real charges. Try 4242 4242 4242 4242</p>
              </div>
            ) : (
              <p className="text-sm text-foreground/50">Complete shipping to continue.</p>
            )}
          </section>
        </form>

        <aside className="border border-border p-8 self-start lg:sticky lg:top-28">
          <h2 className="font-serif text-xl mb-5">In your bag</h2>
          <ul className="divide-y divide-border mb-5">
            {detailed.map(({ product, qty, lineTotal }) => (
              <li key={product.id} className="py-3 flex gap-3 items-center">
                <div className="relative w-14 h-14 bg-secondary overflow-hidden">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground text-background text-[10px] grid place-items-center">{qty}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{product.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">{product.categoryLabel}</div>
                </div>
                <div className="text-sm tabular-nums">${lineTotal.toLocaleString()}</div>
              </li>
            ))}
          </ul>
          <div className="space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between"><span className="text-foreground/60">Subtotal</span><span className="tabular-nums">${subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-foreground/60">Shipping</span><span>Free</span></div>
            <div className="flex justify-between font-serif text-2xl pt-3 border-t border-border"><span>Total</span><span className="tabular-nums">${subtotal.toLocaleString()}</span></div>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-foreground/50 mt-5">
            <CheckCircle2 className="w-3 h-3" /> Lifetime warranty included
          </div>
        </aside>
      </div>
    </div>
  )
}
