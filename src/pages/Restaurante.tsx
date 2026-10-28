import { Link } from 'react-router-dom'
import { Baby, Accessibility, Users, Check, Sparkles } from 'lucide-react'
import { Img, Carousel } from '../components/ui'
import Badges from '../components/Badges'
import { SPACES } from '../data/spaces'
import { waLink } from '../lib/whatsapp'

const Item = ({ children }: any) => <li className="flex gap-3 text-[15px]"><Check size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-amber" />{children}</li>

export default function Restaurante() {
  return (
    <div className="space-y-10 pb-10 pt-5">
      <header className="px-4">
        <span className="font-script text-2xl text-terra">Feito à mão</span>
        <h1 className="h1">O espaço</h1>
        <p className="mt-3 text-[15px] leading-relaxed">Madeira natural, tramas de palha, bambus e plantas por toda parte. O Terrário foi pensado como um jardim coberto: a luz é baixa e dourada, o barulho da cidade fica do lado de fora e a mesa é o centro da noite.</p>
      </header>

      <Carousel>
        {SPACES.map((s) => (
          <figure key={s.id} className="w-[88%] shrink-0 snap-center overflow-hidden rounded-3xl">
            <Img src={s.img} alt={s.name} className="aspect-[4/5]" pos="top" />
            <figcaption className="bg-ivory p-3"><p className="h3">{s.name}</p><p className="text-sm text-moss">{s.note}</p></figcaption>
          </figure>
        ))}
      </Carousel>

      <section className="mx-4 rounded-3xl bg-forest p-5 text-ivory">
        <h2 className="h2 text-ivory">Conforto para toda a família</h2>
        <div className="mt-4 space-y-5">
          <div>
            <p className="flex items-center gap-2 font-semibold"><Baby size={22} strokeWidth={1.5} className="text-amber" />Área Kids com monitores</p>
            <ul className="mt-2 space-y-2"><Item>Espaço seguro para brincar, com monitores presentes.</Item><Item>Cadeirão e cardápio infantil.</Item></ul>
          </div>
          <div>
            <p className="flex items-center gap-2 font-semibold"><Accessibility size={22} strokeWidth={1.5} className="text-amber" />Acessibilidade para todos</p>
            <ul className="mt-2 space-y-2"><Item>100% acessível para cadeirantes.</Item><Item>Circulação ampla para carrinhos de bebê.</Item></ul>
          </div>
        </div>
        <Link to="/reservas" className="btn tap mt-5 w-full bg-ivory text-forest">Reservar com cadeirão ou acessibilidade</Link>
      </section>

      <section className="mx-4 overflow-hidden rounded-3xl border border-line bg-ivory">
        <Img src="/img/dia-dos-pais.png" alt="Mesa posta no salão privativo" className="aspect-[16/10]" pos="center 70%" />
        <div className="p-5">
          <h2 className="h2 flex items-center gap-2"><Sparkles size={24} strokeWidth={1.5} className="text-terra" />Salão privativo</h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-moss"><Users size={18} strokeWidth={1.5} />Capacidade sob consulta</p>
          <p className="mt-3 text-[15px] leading-relaxed">Reuniões de negócios, confraternizações e aniversários em família, com cardápio e atendimento exclusivos.</p>
          <a href={waLink('Olá, equipe do Terrário! Gostaria de uma proposta para o salão privativo.')} target="_blank" rel="noreferrer" className="btn btn-terra tap mt-4 w-full">Solicitar proposta</a>
        </div>
      </section>
      <section><Badges /></section>
    </div>
  )
}
