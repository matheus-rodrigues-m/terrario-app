import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, X, Check, Send } from 'lucide-react'
import { TIMES } from '../data/info'
import { buildMessage, maskPhone, waLink } from '../lib/whatsapp'

const OCC = [
  ['Romântico', 'Romântico'], ['Família com Crianças', 'Família'], ['Aniversário', 'Aniversário'], ['Corporativo', 'Negócios'],
]
const SPACES = ['Salão Principal', 'Jardim', 'Espaço Privativo']
const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10) }

export default function Reservas() {
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [r, setR] = useState<any>({ people: 2, date: '', shift: '', time: '', occasion: '', space: 'Salão Principal', kids: false, acc: false, name: '', phone: '', notes: '' })
  const [touched, setTouched] = useState(false)
  const set = (k: string, v: any) => setR((p: any) => ({ ...p, [k]: v }))
  const digits = r.phone.replace(/\D/g, '')
  const errors: any = {
    0: !r.date ? 'Escolha a data.' : !r.time ? 'Escolha o turno e o horário.' : '',
    1: !r.occasion ? 'Escolha a ocasião.' : '',
    2: r.name.trim().length < 2 ? 'Informe seu nome.' : digits.length < 10 ? 'Informe o telefone com DDD.' : '',
  }
  const err = errors[step]

  const next = () => {
    if (err) return setTouched(true)
    setTouched(false)
    if (step < 2) return setStep(step + 1)
    const msg = buildMessage({ ...r, needs: [r.kids && 'Cadeirão Infantil', r.acc && 'Acessibilidade'].filter(Boolean) })
    window.open(waLink(msg), '_blank', 'noopener')
  }
  const back = () => { setTouched(false); step ? setStep(step - 1) : nav(-1) }
  const title = ['Sua mesa', 'Sua experiência', 'Confirmação'][step]

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button onClick={back} aria-label="Voltar" className="tap flex h-12 w-12 items-center justify-center"><ArrowLeft size={24} strokeWidth={1.5} /></button>
        <p className="text-sm font-medium text-moss">Passo {step + 1} de 3</p>
        <button onClick={() => nav('/')} aria-label="Fechar reserva" className="tap flex h-12 w-12 items-center justify-center"><X size={24} strokeWidth={1.5} /></button>
      </header>
      <div className="mx-4 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-terra transition-all duration-200" style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>

      <div className="flex-1 space-y-6 px-4 pb-6 pt-6">
        <h1 className="h1">{title}</h1>

        {step === 0 && (<>
          <fieldset><legend className="mb-2 font-semibold">Quantas pessoas?</legend>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button key={n} aria-pressed={r.people === n} onClick={() => set('people', n)} className="chip tap font-serif text-xl">{n === 8 ? '8+' : n}</button>
              ))}
            </div></fieldset>
          <div><label htmlFor="date" className="mb-2 block font-semibold">Data</label>
            <input id="date" type="date" min={today()} value={r.date} onChange={(e) => set('date', e.target.value)}
              className="h-12 w-full rounded-2xl border border-line bg-ivory px-4 text-base" /></div>
          <fieldset><legend className="mb-2 font-semibold">Turno</legend>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(TIMES).map((s) => (
                <button key={s} aria-pressed={r.shift === s} onClick={() => setR((p: any) => ({ ...p, shift: s, time: '' }))} className="chip tap">{s}</button>
              ))}
            </div>
            {r.shift && (<div className="mt-3 flex flex-wrap gap-2" aria-label="Horário">
              {TIMES[r.shift].map((t) => <button key={t} aria-pressed={r.time === t} onClick={() => set('time', t)} className="chip tap min-w-[72px]">{t}</button>)}
            </div>)}
          </fieldset>
        </>)}

        {step === 1 && (<>
          <fieldset><legend className="mb-2 font-semibold">Qual a ocasião?</legend>
            <div className="grid grid-cols-2 gap-2">
              {OCC.map(([label, val]) => <button key={val} aria-pressed={r.occasion === val} onClick={() => set('occasion', val)} className="chip tap h-14 whitespace-normal leading-tight">{label}</button>)}
            </div></fieldset>
          <fieldset><legend className="mb-2 font-semibold">Onde prefere sentar?</legend>
            <div className="flex flex-wrap gap-2">
              {SPACES.map((s) => <button key={s} aria-pressed={r.space === s} onClick={() => set('space', s)} className="chip tap">{s}</button>)}
            </div></fieldset>
          <fieldset><legend className="mb-2 font-semibold">Precisa de algo?</legend>
            <div className="space-y-2">
              {[['kids', 'Cadeira infantil'], ['acc', 'Acessibilidade para mobilidade reduzida']].map(([k, label]) => (
                <label key={k} className="tap flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border border-line bg-ivory px-4">
                  <input type="checkbox" checked={r[k]} onChange={(e) => set(k, e.target.checked)} className="peer sr-only" />
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 ${r[k] ? 'border-forest bg-forest text-ivory' : 'border-moss'}`}>{r[k] && <Check size={18} strokeWidth={2} />}</span>
                  <span className="text-[15px]">{label}</span>
                </label>
              ))}
            </div></fieldset>
        </>)}

        {step === 2 && (<>
          <div><label htmlFor="name" className="mb-2 block font-semibold">Nome</label>
            <input id="name" type="text" inputMode="text" autoComplete="name" value={r.name} onChange={(e) => set('name', e.target.value)} onBlur={() => set('name', r.name.trim().replace(/\s+/g, ' '))}
              className="h-12 w-full rounded-2xl border border-line bg-ivory px-4 text-base" placeholder="Como devemos te chamar?" /></div>
          <div><label htmlFor="tel" className="mb-2 block font-semibold">WhatsApp</label>
            <input id="tel" type="tel" inputMode="tel" autoComplete="tel" value={r.phone} onChange={(e) => set('phone', maskPhone(e.target.value))}
              className="h-12 w-full rounded-2xl border border-line bg-ivory px-4 text-base" placeholder="(31) 99999-9999" /></div>
          <div><label htmlFor="notes" className="mb-2 block font-semibold">Observações <span className="font-normal text-moss">(opcional)</span></label>
            <textarea id="notes" rows={3} value={r.notes} onChange={(e) => set('notes', e.target.value)} className="w-full rounded-2xl border border-line bg-ivory p-4 text-base" /></div>
          <p className="rounded-2xl bg-muted/60 p-3 text-sm text-moss">Ao tocar no botão, abrimos o WhatsApp com a mensagem pronta. A reserva é confirmada pela equipe.</p>
        </>)}
      </div>

      <div className="sticky bottom-0 border-t border-line/70 bg-sand/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
        {touched && err && <p role="alert" className="mb-2 text-center text-sm font-medium text-[#B42323]">{err}</p>}
        <button onClick={next} className="btn btn-primary tap w-full">
          {step < 2 ? 'Continuar' : (<><Send size={20} strokeWidth={1.5} />Concluir reserva no WhatsApp</>)}
        </button>
      </div>
    </div>
  )
}
