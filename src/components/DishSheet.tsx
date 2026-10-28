import { Link } from 'react-router-dom'
import { CalendarCheck } from 'lucide-react'
import { Sheet, Img } from './ui'
import { Flag, SemCarne, COUNTRIES } from './DishCard'
import { brl } from '../lib/whatsapp'
import { useRef } from 'react'

export default function DishSheet({ dish, onClose }: any) {
  const last = useRef<any>(null)
  if (dish) last.current = dish
  const d = last.current
  return (
    <Sheet open={!!dish} onOpenChange={(o: boolean) => !o && onClose()} title={d?.name ?? 'Prato'}>
      {d && (
        <div>
          <Img src={d.img} alt={d.name} className="aspect-[4/3] w-full rounded-t-3xl" />
          <div className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="h2">{d.name}</h2>
              <span className="shrink-0 rounded-full bg-terra px-3 py-1.5 font-serif text-lg font-semibold leading-none text-white">{brl(d.price)}</span>
            </div>
            {(d.tags.includes('semcarne') || d.country || d.tags.includes('semgluten')) && (
              <div className="flex flex-wrap items-center gap-2">
                {d.tags.includes('semcarne') && <SemCarne />}
                {d.tags.includes('semgluten') && <span className="inline-flex h-8 items-center rounded-full border border-terra/40 px-3 text-xs font-semibold text-terra">Sem glúten</span>}
                {d.country && <span className="inline-flex h-8 items-center gap-2 rounded-full bg-muted/70 pr-3 text-xs font-semibold"><Flag code={d.country} size={32} />{COUNTRIES[d.country]}</span>}
              </div>
            )}
            {d.desc && <p className="text-[15px] leading-relaxed text-ink">{d.desc}</p>}
            <Link to="/reservas" className="btn btn-primary tap w-full"><CalendarCheck size={20} strokeWidth={1.5} />Reservar mesa</Link>
          </div>
        </div>
      )}
    </Sheet>
  )
}
