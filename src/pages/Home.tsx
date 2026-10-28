import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, MapPin, Clock, CalendarCheck } from 'lucide-react'
import Badges from '../components/Badges'
import { Img, Carousel, Sheet } from '../components/ui'
import { MENU, } from '../data/menu'
import { SPACES, REVIEWS } from '../data/spaces'
import { INFO } from '../data/info'
import { brl } from '../lib/whatsapp'
import DishSheet from '../components/DishSheet'
import DishCard from '../components/DishCard'

const SIGNATURE = ['massas-e-risot-35', 'massas-e-risot-40', 'porcoes-especi-23', 'refeicoes-fami-47', 'sobremesas-63', 'espumantes-163'].map((id) => MENU.find((m) => m.id === id)).filter(Boolean)

export default function Home() {
  const [dish, setDish] = useState<any>(null)
  return (
    <div className="pb-8">
      <section className="relative h-[560px] overflow-hidden bg-basalt text-ivory">
        <img src="/img/lounge.png" alt="Lounge do Terrário com pendentes de palha" className="absolute inset-0 h-full w-full object-cover object-top opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-basalt via-basalt/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span className="font-script text-2xl text-amber">Reserva recomendada</span>
          <h1 className="h1 mt-1 max-w-[18ch] text-ivory">Um jardim à mesa, feito para celebrar.</h1>
          <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-ivory/85">Alta gastronomia entre bambus, madeira e luz dourada. Para dois, para a família toda ou para o seu evento.</p>
          <Link to="/reservas" className="btn btn-terra tap mt-5 w-full"><CalendarCheck size={20} strokeWidth={1.5} />Reservar mesa</Link>
        </div>
      </section>

      <section className="mt-6"><Badges /></section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between px-4">
          <h2 className="h2">Destaques da casa</h2>
          <Link to="/cardapio" className="flex h-12 items-center text-sm font-semibold text-terra">Ver cardápio</Link>
        </div>
        <Carousel>
          {SIGNATURE.map((d: any) => (
            <div key={d.id} className="w-[72%] shrink-0 snap-start"><DishCard dish={d} onOpen={setDish} /></div>
          ))}
        </Carousel>
      </section>

      <section className="mt-10">
        <h2 className="h2 mb-1 px-4">Conheça os ambientes</h2>
        <p className="mb-4 px-4 text-[15px] text-moss">Deslize para ver onde a sua mesa pode ficar.</p>
        <Carousel>
          {SPACES.map((s) => (
            <figure key={s.id} className="relative w-[84%] shrink-0 snap-start overflow-hidden rounded-3xl">
              <Img src={s.img} alt={s.name} className="aspect-[3/4]" pos="top" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-basalt/90 to-transparent p-4 pt-16 text-ivory">
                <p className="h3 text-ivory">{s.name}</p>
                <p className="text-sm text-ivory/85">{s.note}</p>
              </figcaption>
            </figure>
          ))}
        </Carousel>
      </section>

      <section className="mt-10">
        <h2 className="h2 mb-4 px-4">Quem já esteve aqui</h2>
        <Carousel>
          {REVIEWS.map((r, i) => (
            <blockquote key={i} className="w-[84%] shrink-0 snap-start rounded-2xl border border-line/70 bg-ivory p-4">
              <div className="flex gap-0.5 text-amber" aria-label="5 estrelas">{[0,1,2,3,4].map((k) => <Star key={k} size={16} fill="currentColor" strokeWidth={0} />)}</div>
              <p className="mt-2 font-serif text-lg leading-snug">“{r.text}”</p>
              <footer className="mt-3 text-sm text-moss">{r.name} — {r.occasion}</footer>
            </blockquote>
          ))}
        </Carousel>
      </section>

      <footer className="mx-4 mt-10 rounded-3xl bg-basalt p-5 text-ivory">
        <img src="/img/logo-completa.png" alt="Terrário Restaurante" className="mx-auto h-24 w-auto rounded-xl" />
        <p className="mt-5 flex gap-3 text-sm"><MapPin size={20} strokeWidth={1.5} className="shrink-0 text-amber" />{INFO.address}</p>
        <div className="mt-4 flex gap-3 text-sm"><Clock size={20} strokeWidth={1.5} className="shrink-0 text-amber" />
          <dl className="space-y-1">{INFO.hours.map(([d, h]) => (<div key={d} className="flex gap-2"><dt className="w-28 text-ivory/70">{d}</dt><dd>{h}</dd></div>))}</dl>
        </div>
        <p className="mt-5 text-xs text-ivory/60">Atendimento presencial. Não fazemos delivery.</p>
      </footer>
      <DishSheet dish={dish} onClose={() => setDish(null)} />
    </div>
  )
}
