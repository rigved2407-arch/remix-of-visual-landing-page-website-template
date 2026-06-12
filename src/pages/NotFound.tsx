import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="pt-16 pb-24 container max-w-xl text-center">
      <h1 className="font-serif text-7xl lg:text-9xl">404</h1>
      <p className="font-serif text-2xl mt-4 mb-8">This piece doesn&apos;t exist.</p>
      <Link to="/" className="inline-block bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.3em]">Back home</Link>
    </div>
  )
}
