import { Phone, MapPin, Heart } from 'lucide-react'

export function AnnouncementBar() {
  return (
    <div className="bg-destructive text-destructive-foreground text-xs">
      <div className="container flex items-center justify-between gap-4 py-2.5 overflow-hidden">
        <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.15em]">
          <Phone className="w-3 h-3" /> (404) 909-0670 Today
        </div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] mx-auto md:mx-0">
          <MapPin className="w-3 h-3" /> A question? <a href="/contact" className="underline underline-offset-2 ml-1">Visit our contact page</a>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.15em]">
          <Heart className="w-3 h-3 fill-current" /> Deal USE CODE — <span className="font-bold">NEW10</span>
        </div>
      </div>
    </div>
  )
}
