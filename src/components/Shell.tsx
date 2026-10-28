import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, UtensilsCrossed, Trees, CalendarCheck, MessageCircle } from 'lucide-react'
import { FrameCtx } from './ui'
import { waLink } from '../lib/whatsapp'

const NAV = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/cardapio', label: 'Cardápio', icon: UtensilsCrossed },
  { to: '/o-restaurante', label: 'O Espaço', icon: Trees },
]

export default function Shell() {
  const [frame, setFrame] = useState<HTMLElement | null>(null)
  const scroller = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const booking = pathname.startsWith('/reservas')
  useEffect(() => { scroller.current?.scrollTo(0, 0) }, [pathname])

  return (
    <div className="flex h-full w-full items-center justify-center bg-muted md:p-6">
      <div ref={setFrame}
        className="relative flex h-full w-full flex-col overflow-hidden bg-sand md:h-[min(860px,100%)] md:w-[410px] md:rounded-[44px] md:border-[10px] md:border-basalt md:shadow-[0_30px_80px_-20px_rgba(18,26,21,0.45)]">
        <FrameCtx.Provider value={frame}>
          {!booking && (
            <header className="z-30 flex shrink-0 items-center justify-between border-b border-line/70 bg-sand/90 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-md">
              <Link to="/" className="flex h-14 items-center" aria-label="Terrário — início">
                <img src="/img/logo.png" alt="Terrário" className="h-11 w-11 object-contain" />
                <span className="ml-1 font-serif text-xl font-semibold tracking-wide text-forest">Terrário</span>
              </Link>
              <a href={waLink('Olá, equipe do Terrário! Tenho uma dúvida.')} target="_blank" rel="noreferrer"
                aria-label="Falar com o restaurante no WhatsApp" className="tap flex h-12 w-12 items-center justify-center rounded-full text-forest">
                <MessageCircle size={24} strokeWidth={1.5} />
              </a>
            </header>
          )}
          <main id="scroller" ref={scroller} className="no-scrollbar relative flex-1 overflow-y-auto overscroll-contain">
            <AnimatePresence mode="wait">
              <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="min-h-full">
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
          {!booking && (
            <nav aria-label="Navegação principal" className="z-30 shrink-0 border-t border-line/70 bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
              <ul className="grid h-16 grid-cols-4 items-center px-2">
                {NAV.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <NavLink to={to} end={to === '/'} className={({ isActive }) =>
                      `tap mx-auto flex h-14 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${isActive ? 'text-forest' : 'text-moss'}`}>
                      {({ isActive }) => (<><Icon size={22} strokeWidth={isActive ? 2 : 1.5} /><span>{label}</span></>)}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <Link to="/reservas" className="tap mx-auto flex h-14 w-[88%] flex-col items-center justify-center gap-0.5 rounded-2xl bg-forest text-[11px] font-semibold text-ivory">
                    <CalendarCheck size={22} strokeWidth={1.5} /><span>Reservar</span>
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </FrameCtx.Provider>
      </div>
    </div>
  )
}
