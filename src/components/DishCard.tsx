import { Leaf } from 'lucide-react'
import { Img } from './ui'
import { brl } from '../lib/whatsapp'

export const COUNTRIES: any = { es: 'Espanha', fr: 'França', cl: 'Chile', ar: 'Argentina', pt: 'Portugal', it: 'Itália', br: 'Brasil' }
export const flagSrc = (c: string) => `/img/flags/${c}.${c === 'br' ? 'svg' : 'png'}`

export function Flag({ code, size = 28 }: any) {
  return <img src={flagSrc(code)} alt={`Origem: ${COUNTRIES[code]}`} title={COUNTRIES[code]} style={{ width: size, height: size }}
    className="rounded-full object-cover ring-2 ring-ivory" />
}
export const SemCarne = () => (
  <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-forest px-3 text-xs font-semibold text-ivory">
    <Leaf size={14} strokeWidth={1.5} />Sem carne
  </span>
)

export default function DishCard({ dish, onOpen, className = '' }: any) {
  return (
    <button onClick={() => onOpen(dish)} className={`tap flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line/70 bg-ivory text-left shadow-sm ${className}`}>
      <div className="relative w-full">
        <Img src={dish.img} alt={dish.name} className="aspect-[4/3] w-full" />
        {dish.tags.includes('semcarne') && <span className="absolute left-3 top-3"><SemCarne /></span>}
        {dish.country && <span className="absolute right-3 top-3"><Flag code={dish.country} /></span>}
        <span className="absolute bottom-3 right-3 rounded-full bg-terra px-3 py-1.5 font-serif text-lg font-semibold leading-none text-white">{brl(dish.price)}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="h3 line-clamp-2 min-h-[3.25rem]">{dish.name}</h3>
        <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-moss">{dish.desc}</p>
      </div>
    </button>
  )
}
