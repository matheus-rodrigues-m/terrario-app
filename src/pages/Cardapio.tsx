import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck } from 'lucide-react'
import { CATEGORIES, FILTERS, MENU } from '../data/menu'
import DishCard from '../components/DishCard'
import DishSheet from '../components/DishSheet'

export default function Cardapio() {
  const [filter, setFilter] = useState('todos')
  const [active, setActive] = useState(CATEGORIES[0].id)
  const [dish, setDish] = useState<any>(null)
  const bar = useRef<HTMLDivElement>(null)
  const topOf = (el: HTMLElement) => { const sc = document.getElementById('scroller')!; return el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop }
  const barH = () => (bar.current?.offsetHeight ?? 120) + 8
  const groups = useMemo(() => CATEGORIES.map((c) => ({
    ...c, items: MENU.filter((m) => m.cat === c.id && (filter === 'todos' || m.tags.includes(filter))),
  })).filter((g) => g.items.length), [filter])

  useEffect(() => {
    const sc = document.getElementById('scroller')!
    const onScroll = () => {
      let cur = groups[0]?.id
      groups.forEach((g) => { const el = document.getElementById('sec-' + g.id); if (el && topOf(el) - barH() <= sc.scrollTop) cur = g.id })
      if (cur) setActive(cur)
    }
    sc.addEventListener('scroll', onScroll, { passive: true }); onScroll()
    return () => sc.removeEventListener('scroll', onScroll)
  }, [groups])

  useEffect(() => {
    document.getElementById('pill-' + active)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [active])

  const go = (id: string) => {
    const sc = document.getElementById('scroller')!, el = document.getElementById('sec-' + id)
    if (el) sc.scrollTo({ top: topOf(el) - barH() + 1, behavior: 'smooth' })
  }

  return (
    <div>
      <div className="px-4 pb-2 pt-5">
        <h1 className="h1">Cardápio</h1>
        <p className="mt-1 text-[15px] text-moss">Toque em um item para ver a descrição completa.</p>
      </div>

      <div ref={bar} className="sticky top-0 z-20 border-b border-line/70 bg-sand/95 backdrop-blur-md">
        <div role="tablist" aria-label="Categorias" className="no-scrollbar flex snap-x gap-2 overflow-x-auto px-4 py-2">
          {groups.map((g) => (
            <button key={g.id} id={'pill-' + g.id} role="tab" aria-selected={active === g.id} aria-pressed={active === g.id}
              onClick={() => go(g.id)} className="chip tap shrink-0 snap-start">{g.label}</button>
          ))}
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
          {FILTERS.map((f) => (
            <button key={f.id} aria-pressed={filter === f.id} onClick={() => { setFilter(f.id); document.getElementById('scroller')!.scrollTo({ top: 0 }) }}
              className={`tap min-h-[48px] shrink-0 rounded-full border px-4 text-sm font-medium ${filter === f.id ? 'border-terra bg-terra text-white' : 'border-line bg-ivory text-ink'}`}>{f.label}</button>
          ))}
        </div>
      </div>

      <div className="space-y-8 px-4 pb-6 pt-5">
        {groups.map((g) => (
          <section key={g.id} id={'sec-' + g.id} aria-labelledby={'h-' + g.id}>
            <h2 id={'h-' + g.id} className="h2 mb-3">{g.label}</h2>
            <ul className="space-y-4">
              {g.items.map((d: any) => (
                <li key={d.id}><DishCard dish={d} onOpen={setDish} /></li>
              ))}
            </ul>
          </section>
        ))}
        {!groups.length && <p className="py-10 text-center text-moss">Nenhum prato nesse filtro. Escolha “Todos” para ver o cardápio completo.</p>}
      </div>

      <div className="sticky bottom-0 z-20 border-t border-line/70 bg-sand/90 p-3 backdrop-blur-md">
        <Link to="/reservas" className="btn btn-primary tap w-full"><CalendarCheck size={20} strokeWidth={1.5} />Reservar mesa</Link>
      </div>
      <DishSheet dish={dish} onClose={() => setDish(null)} />
    </div>
  )
}
