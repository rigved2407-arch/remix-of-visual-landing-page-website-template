import { motion } from 'framer-motion'
import { useState } from 'react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden grain bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-accent/5" />
      <div className="container relative max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.4em] text-white">Inner Circle</span>
          <h2 className="font-serif text-4xl lg:text-6xl mt-4 mb-6">
            First access to <span className="italic text-gold">the drops.</span>
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Join the Treasure Box list for early releases, private viewings and
            invite-only pieces never sold publicly.
          </p>

          {submitted ? (
            <p className="text-primary font-serif text-2xl">Welcome to the circle. ✦</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (email) setSubmitted(true)
              }}
              className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-secondary border border-border px-5 py-4 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="bg-gold-gradient text-primary-foreground px-8 py-4 text-sm uppercase tracking-[0.25em] font-semibold hover:shadow-gold transition-all"
              >
                Join
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
