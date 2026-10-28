import { useRef, useState, useEffect, createContext, useContext } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { X } from 'lucide-react'

export const FrameCtx = createContext<HTMLElement | null>(null)

export function Img({ src, alt, className = '', pos = 'center' }: any) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [prev, setPrev] = useState(src)
  if (prev !== src) { setPrev(src); setFailed(false); setLoaded(false) }
  const show = src && !failed
  return (
    <span className={`relative block overflow-hidden bg-muted ${className}`}>
      {show ? (
        <img src={src} alt={alt} loading="lazy" onLoad={() => setLoaded(true)} onError={() => setFailed(true)}
          style={{ objectPosition: pos }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`} />
      ) : (
        <img src="/img/logo.png" alt="" className="absolute inset-0 m-auto h-1/2 w-1/2 object-contain opacity-40" />
      )}
    </span>
  )
}

export function Sheet({ open, onOpenChange, title, children }: any) {
  const container = useContext(FrameCtx)
  const controls = useDragControls()
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount container={container}>
            <Dialog.Overlay asChild forceMount>
              <motion.div className="absolute inset-0 z-[60] bg-basalt/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className="absolute inset-x-0 bottom-0 z-[70] flex max-h-[92%] flex-col rounded-t-3xl bg-ivory"
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'tween', duration: 0.24, ease: 'easeOut' }}
                drag="y" dragControls={controls} dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
                onDragEnd={(_, i) => { if (i.offset.y > 110 || i.velocity.y > 600) onOpenChange(false) }}>
                <div className="flex shrink-0 touch-none justify-center pb-1 pt-3" onPointerDown={(e) => controls.start(e)}>
                  <div className="h-1.5 w-12 rounded-full bg-line" />
                </div>
                <Dialog.Title className="sr-only">{title}</Dialog.Title>
                <Dialog.Description className="sr-only">Detalhes de {title}</Dialog.Description>
                <Dialog.Close className="tap absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-ivory/90 text-ink" aria-label="Fechar">
                  <X size={22} strokeWidth={1.5} />
                </Dialog.Close>
                <div className="overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]">{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

export function Carousel({ children, onIndex, className = '' }: any) {
  const ref = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const n = Array.isArray(children) ? children.length : 1
  useEffect(() => { onIndex?.(i) }, [i])
  return (
    <div>
      <div ref={ref} className={`no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-3 pt-1 ${className}`}
        onScroll={(e) => {
          const el = e.currentTarget, c = el.firstElementChild as HTMLElement
          if (c) setI(Math.min(n - 1, Math.round(el.scrollLeft / (c.offsetWidth + 12))))
        }}>
        {children}
      </div>
      <div className="flex justify-center gap-2" aria-hidden>
        {Array.from({ length: n }).map((_, k) => (
          <span key={k} className={`h-2 rounded-full transition-all duration-200 ${k === i ? 'w-6 bg-terra' : 'w-2 bg-line'}`} />
        ))}
      </div>
    </div>
  )
}
