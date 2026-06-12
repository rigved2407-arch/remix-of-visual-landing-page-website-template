import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, ArrowRight, Sparkles, Check } from 'lucide-react'
import { useConfigurator } from '@/context/ConfiguratorContext'

type PieceType = 'ring' | 'pendant' | 'necklace' | 'earrings' | 'bracelet' | 'grillz'
type Metal = '925-silver' | '10k-yellow' | '10k-white' | '10k-rose' | '14k-yellow' | '14k-white' | '18k-yellow' | 'platinum'
type DiamondShape = 'round' | 'oval' | 'pear' | 'emerald' | 'cushion' | 'marquise' | 'princess'

interface ConfiguratorState {
  pieceType: PieceType | null
  metal: Metal | null
  diamondShape: DiamondShape | null
  engraving: string
  notes: string
  referenceImage: string | null
}

const PIECE_TYPES: { id: PieceType; label: string }[] = [
  { id: 'ring',     label: 'Ring'     },
  { id: 'pendant',  label: 'Pendant'  },
  { id: 'necklace', label: 'Necklace' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'bracelet', label: 'Bracelet' },
  { id: 'grillz',   label: 'Grillz'   },
]

const METALS: { id: Metal; label: string; swatch: string }[] = [
  { id: '925-silver', label: '925 Sterling Silver', swatch: 'linear-gradient(135deg,#f0f0f0,#a8a8a8)' },
  { id: '10k-yellow', label: '10KT Yellow Gold',    swatch: 'linear-gradient(135deg,#d4a843,#8a6018)' },
  { id: '10k-white',  label: '10KT White Gold',     swatch: 'linear-gradient(135deg,#e8e8e8,#9aa0a6)' },
  { id: '10k-rose',   label: '10KT Rose Gold',      swatch: 'linear-gradient(135deg,#e8a898,#c47060)' },
  { id: '14k-yellow', label: '14K Yellow Gold',     swatch: 'linear-gradient(135deg,#e8c068,#a87b2a)' },
  { id: '14k-white',  label: '14K White Gold',      swatch: 'linear-gradient(135deg,#f1f1f1,#8090a0)' },
  { id: '18k-yellow', label: '18K Yellow Gold',     swatch: 'linear-gradient(135deg,#f6d27a,#b07a18)' },
  { id: 'platinum',   label: 'Platinum',             swatch: 'linear-gradient(135deg,#e7e7ea,#7a7e85)' },
]

const DIAMOND_SHAPES: { id: DiamondShape; label: string }[] = [
  { id: 'round',    label: 'Round'    },
  { id: 'oval',     label: 'Oval'     },
  { id: 'pear',     label: 'Pear'     },
  { id: 'emerald',  label: 'Emerald'  },
  { id: 'cushion',  label: 'Cushion'  },
  { id: 'marquise', label: 'Marquise' },
  { id: 'princess', label: 'Princess' },
]

// ── Gold accent colour reused everywhere ──────────────────────────────────────
const GOLD = '#C9A84C'
const GOLD_DIM = 'rgba(201,168,76,0.18)'
const GOLD_BORDER = 'rgba(201,168,76,0.55)'

function SelectButton({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={active ? { borderColor: GOLD, background: GOLD_DIM, color: '#fff' } : {}}
      className={`border text-sm font-semibold uppercase tracking-[0.14em] transition-all duration-200 rounded-sm px-4 py-2.5 ${
        active
          ? ''
          : 'border-white/15 bg-transparent text-white/55 hover:border-white/35 hover:text-white/80'
      }`}
    >
      {children}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.4em] mb-3 font-semibold" style={{ color: GOLD }}>
      {children}
    </div>
  )
}

export function JewelryConfiguratorModal() {
  const { isOpen, closeConfigurator } = useConfigurator()

  const [state, setState] = useState<ConfiguratorState>({
    pieceType:      null,
    metal:          null,
    diamondShape:   null,
    engraving:      '',
    notes:          '',
    referenceImage: null,
  })
  const [submitted, setSubmitted] = useState(false)
  const [dragOver, setDragOver]   = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const update = <K extends keyof ConfiguratorState>(key: K, value: ConfiguratorState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }))

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => update('referenceImage', e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleClose = () => {
    closeConfigurator()
    setState({ pieceType: null, metal: null, diamondShape: null, engraving: '', notes: '', referenceImage: null })
  }

  const handleSubmit = () => {
    if (!state.pieceType || !state.metal) return
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); handleClose() }, 2800)
  }

  const canSubmit = !!state.pieceType && !!state.metal

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 44, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-xl shadow-2xl"
              style={{
                background: 'linear-gradient(160deg, #0d0d0d 0%, #111111 50%, #0a0a0a 100%)',
                border: `1px solid ${GOLD_BORDER}`,
                boxShadow: `0 0 60px rgba(201,168,76,0.08), 0 32px 80px rgba(0,0,0,0.8)`,
              }}
            >
              {/* Subtle gold top line */}
              <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

              {/* Header */}
              <div
                className="sticky top-0 z-10 flex items-center justify-between px-8 py-5"
                style={{
                  background: 'linear-gradient(160deg, #0d0d0d, #111111)',
                  borderBottom: `1px solid rgba(201,168,76,0.2)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4" style={{ color: GOLD }} />
                  <span
                    className="text-xs uppercase tracking-[0.45em] font-bold"
                    style={{ color: GOLD }}
                  >
                    Custom Jewellery Configurator
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all text-white/50 hover:text-white"
                  style={{ border: `1px solid rgba(201,168,76,0.3)` }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = GOLD)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-10">

                  {/* ── Left ── */}
                  <div className="space-y-8">

                    {/* Piece type */}
                    <div>
                      <SectionLabel>What would you like to customise?</SectionLabel>
                      <div className="grid grid-cols-3 gap-2.5">
                        {PIECE_TYPES.map((p) => (
                          <SelectButton key={p.id} active={state.pieceType === p.id} onClick={() => update('pieceType', p.id)}>
                            {p.label}
                          </SelectButton>
                        ))}
                      </div>
                    </div>

                    {/* Metal */}
                    <div>
                      <SectionLabel>Metal</SectionLabel>
                      <div className="grid grid-cols-2 gap-2.5">
                        {METALS.map((m) => {
                          const isActive = state.metal === m.id
                          return (
                            <button
                              key={m.id}
                              onClick={() => update('metal', m.id)}
                              style={isActive ? { borderColor: GOLD, background: GOLD_DIM } : {}}
                              className={`flex items-center gap-2.5 border rounded-sm px-3 py-2.5 transition-all duration-200 ${
                                isActive
                                  ? 'text-white'
                                  : 'border-white/15 text-white/55 hover:border-white/30 hover:text-white/80'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full shrink-0" style={{ background: m.swatch, boxShadow: '0 0 0 1px rgba(255,255,255,0.15)' }} />
                              <span className="truncate text-xs font-semibold uppercase tracking-[0.1em]">{m.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Diamond shape */}
                    <div>
                      <SectionLabel>Diamond Shape</SectionLabel>
                      <div className="grid grid-cols-3 gap-2.5">
                        {DIAMOND_SHAPES.map((s) => (
                          <SelectButton key={s.id} active={state.diamondShape === s.id} onClick={() => update('diamondShape', s.id)}>
                            {s.label}
                          </SelectButton>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* ── Right ── */}
                  <div className="space-y-8">

                    {/* Reference image */}
                    <div>
                      <SectionLabel>Reference Image (Optional)</SectionLabel>
                      <div
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                        onClick={() => !state.referenceImage && fileInputRef.current?.click()}
                        className="relative rounded-lg transition-all duration-200"
                        style={{
                          minHeight: '180px',
                          border: `2px dashed ${dragOver ? GOLD : 'rgba(255,255,255,0.15)'}`,
                          background: dragOver ? GOLD_DIM : 'rgba(255,255,255,0.02)',
                          cursor: state.referenceImage ? 'default' : 'pointer',
                        }}
                      >
                        {state.referenceImage ? (
                          <div className="relative">
                            <img src={state.referenceImage} alt="Reference" className="w-full rounded-lg object-cover max-h-52" />
                            <button
                              onClick={(e) => { e.stopPropagation(); update('referenceImage', null) }}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/80 flex items-center justify-center text-white hover:bg-black transition-colors"
                              style={{ border: `1px solid ${GOLD_BORDER}` }}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center"
                              style={{ border: `1px solid rgba(201,168,76,0.4)`, color: GOLD }}
                            >
                              <Upload className="w-5 h-5" />
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
                                Upload a Reference Image
                              </div>
                              <div className="text-xs text-white/35 mt-1">JPG, PNG or WEBP · Max 5MB</div>
                            </div>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                        />
                      </div>
                      <p className="text-xs text-white/35 mt-2 italic">Share a photo of a piece you love — we'll use it as inspiration.</p>
                    </div>

                    {/* Engraving */}
                    <div>
                      <SectionLabel>Engraving (Optional)</SectionLabel>
                      <input
                        type="text"
                        maxLength={20}
                        value={state.engraving}
                        onChange={(e) => update('engraving', e.target.value)}
                        placeholder="A name, date, or symbol"
                        className="w-full rounded-sm px-4 py-3 text-sm text-white bg-transparent transition-colors outline-none placeholder-white/25"
                        style={{ border: `1px solid rgba(255,255,255,0.15)` }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                      />
                      <div className="text-xs text-white/30 mt-1.5">{state.engraving.length}/20 characters</div>
                    </div>

                    {/* Notes */}
                    <div>
                      <SectionLabel>Personal Notes</SectionLabel>
                      <textarea
                        value={state.notes}
                        onChange={(e) => update('notes', e.target.value)}
                        placeholder="Tell us about the piece you envision — style, occasion, any details that matter to you."
                        rows={5}
                        className="w-full resize-none rounded-sm px-4 py-3 text-sm text-white bg-transparent transition-colors outline-none placeholder-white/25"
                        style={{ border: `1px solid rgba(255,255,255,0.15)` }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                      />
                    </div>

                  </div>
                </div>

                {/* Summary strip */}
                {(state.pieceType || state.metal || state.diamondShape) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-8 rounded-lg px-6 py-4"
                    style={{ border: `1px solid ${GOLD_BORDER}`, background: GOLD_DIM }}
                  >
                    <div className="text-[10px] uppercase tracking-[0.45em] font-bold mb-3" style={{ color: GOLD }}>
                      Your Selection
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                      {state.pieceType && (
                        <div className="flex items-center gap-2">
                          <span className="text-white/45">Piece</span>
                          <span className="text-white font-semibold capitalize">{state.pieceType}</span>
                        </div>
                      )}
                      {state.metal && (
                        <div className="flex items-center gap-2">
                          <span className="text-white/45">Metal</span>
                          <span className="text-white font-semibold">{METALS.find((m) => m.id === state.metal)?.label}</span>
                        </div>
                      )}
                      {state.diamondShape && (
                        <div className="flex items-center gap-2">
                          <span className="text-white/45">Diamond</span>
                          <span className="text-white font-semibold capitalize">{state.diamondShape}</span>
                        </div>
                      )}
                      {state.engraving && (
                        <div className="flex items-center gap-2">
                          <span className="text-white/45">Engraving</span>
                          <span className="font-semibold" style={{ color: GOLD }}>"{state.engraving}"</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* CTAs */}
                <div
                  className="flex flex-wrap items-center gap-4 mt-8 pt-6"
                  style={{ borderTop: `1px solid rgba(201,168,76,0.2)` }}
                >
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2.5 px-7 py-3.5 rounded-sm text-sm uppercase tracking-[0.2em] font-bold"
                        style={{ background: GOLD_DIM, border: `1px solid ${GOLD}`, color: GOLD }}
                      >
                        <Check className="w-4 h-4" /> Request Received!
                      </motion.div>
                    ) : (
                      <motion.button
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-sm text-sm uppercase tracking-[0.2em] font-bold transition-all"
                        style={
                          canSubmit
                            ? {
                                background: `linear-gradient(135deg, ${GOLD}, #a8832a)`,
                                color: '#0a0a0a',
                                boxShadow: `0 8px 32px rgba(201,168,76,0.35)`,
                              }
                            : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)', cursor: 'not-allowed' }
                        }
                      >
                        Submit Request
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <a
                    href="https://wa.me/14049090670"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-7 py-3.5 rounded-sm text-sm uppercase tracking-[0.2em] font-bold transition-all text-white/70 hover:text-white"
                    style={{ border: `1px solid rgba(201,168,76,0.35)` }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = GOLD; (e.currentTarget as HTMLElement).style.color = GOLD }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.35)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)' }}
                  >
                    Book Consultation
                  </a>

                  {!canSubmit && (
                    <span className="text-xs text-white/25 ml-auto hidden sm:block tracking-wide">
                      Select a piece type & metal to continue
                    </span>
                  )}
                </div>

              </div>

              {/* Subtle gold bottom line */}
              <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
