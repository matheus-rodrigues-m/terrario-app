import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, X, Check, Send } from 'lucide-react'
import { OPEN_SHIFTS, TIMES } from '../data/info'
import { SPACES as AMBIENTES } from '../data/spaces'
import { buildMessage, maskPhone, waLink } from '../lib/whatsapp'

const OCC = ['Romântico', 'Família com crianças', 'Aniversário', 'Corporativo']
const SPACES = [...AMBIENTES.map((s) => s.name), 'Salão Privativo']

const pad = (n: number) => String(n).padStart(2, '0')
const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10) }
const nowHM = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}` }
const dayOf = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).getDay() }
// horários do turno ainda disponíveis (se a data é hoje, descarta os que já passaram)
const timesFor = (date: string, shift: string) => (TIMES[shift] ?? []).filter((t) => date !== today() || t > nowHM())
// turnos abertos naquele dia e que ainda têm horário
const shiftsFor = (date: string) => (OPEN_SHIFTS[dayOf(date)] ?? []).filter((s) => timesFor(date, s).length > 0)
const dateError = (date: string) => {
  if (!date) return 'Escolha a data.'
  if (date < today()) return 'Escolha uma data a partir de hoje.'
  if (!(OPEN_SHIFTS[dayOf(date)] ?? []).length) return 'Não abrimos nesse dia. Escolha outra data.'
  if (!shiftsFor(date).length) return 'Não há mais horários hoje. Escolha outra data.'
  return ''
}
// 10 dígitos (fixo) ou 11 (celular com 9), DDD válido (sem 0)
const validPhone = (d: string) => /^[1-9]{2}[2-9]\d{7}$/.test(d) || /^[1-9]{2}9\d{8}$/.test(d)

export default function Reservas() {
  const nav = useNavigate()
  const { key } = useLocation()
  const [step, setStep] = useState(0)
  const [r, setR] = useState<any>({ people: 2, date: '', shift: '', time: '', occasion: '', space: SPACES[0], kids: false, acc: false, name: '', phone: '', notes: '' })
  const [touched, setTouched] = useState(false)
  const set = (k: string, v: any) => setR((p: any) => ({ ...p, [k]: v }))
  // ao trocar a data, limpa turno/horário que deixaram de valer
  const setDate = (v: string) => setR((p: any) => {
    const ok = !!v && !dateError(v) && shiftsFor(v).includes(p.shift) && timesFor(v, p.shift).includes(p.time)
    return { ...p, date: v, ...(ok ? {} : { shift: '', time: '' }) }
  })
  const digits = r.phone.replace(/\D/g, '')
  const dErr = r.date ? dateError(r.date) : ''
  // calculado a cada chamada: no clique em "Concluir" a hora pode ter passado desde o último render
  const calcErrors = (): any => ({
    0: dateError(r.date) || (!r.time ? 'Escolha o turno e o horário.'
      : !(shiftsFor(r.date).includes(r.shift) && timesFor(r.date, r.shift).includes(r.time)) ? 'Esse horário não está mais disponível. Escolha outro.' : ''),
    1: !r.occasion ? 'Escolha a ocasião.' : '',
    2: r.name.trim().length < 2 ? 'Informe seu nome.' : !validPhone(digits) ? 'Informe o telefone com DDD.' : '',
  })
  const err = calcErrors()[step]

  const next = () => {
    const fresh = calcErrors()
    if (fresh[step]) return setTouched(true)
    // a hora pode ter passado enquanto a pessoa preenchia: revalida a data/horário no envio
    if (step === 2 && fresh[0]) { setStep(0); return setTouched(true) }
    setTouched(false)
    if (step < 2) return setStep(step + 1)
    const msg = buildMessage({ ...r, needs: [r.kids && 'Cadeirão Infantil', r.acc && 'Acessibilidade'].filter(Boolean) })
    window.open(waLink(msg), '_blank', 'noopener')
  }
  // sem histórico (abriu /reservas direto) volta para o início em vez de sair do site
  const back = () => { setTouched(false); step ? setStep(step - 1) : key === 'default' ? nav('/') : nav(-1) }
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
            <input id="date" type="date" min={today()} value={r.date} onChange={(e) => setDate(e.target.value)}
              className="h-12 w-full rounded-2xl border border-line bg-ivory px-4 text-base" />
            {dErr && <p role="status" className="mt-2 text-sm font-medium text-[#B42323]">{dErr}</p>}</div>
          <fieldset><legend className="mb-2 font-semibold">Turno</legend>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(TIMES).map((s) => (
                <button key={s} aria-pressed={r.shift === s} disabled={!!r.date && !shiftsFor(r.date).includes(s)}
                  onClick={() => setR((p: any) => ({ ...p, shift: s, time: '' }))} className="chip tap">{s}</button>
              ))}
            </div>
            {r.shift && (<div className="mt-3 flex flex-wrap gap-2" aria-label="Horário">
              {timesFor(r.date, r.shift).map((t) => <button key={t} aria-pressed={r.time === t} onClick={() => set('time', t)} className="chip tap min-w-[72px]">{t}</button>)}
            </div>)}
          </fieldset>
        </>)}

        {step === 1 && (<>
          <fieldset><legend className="mb-2 font-semibold">Qual a ocasião?</legend>
            <div className="grid grid-cols-2 gap-2">
              {OCC.map((o) => <button key={o} aria-pressed={r.occasion === o} onClick={() => set('occasion', o)} className="chip tap h-14 whitespace-normal leading-tight">{o}</button>)}
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
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-terra peer-focus-visible:ring-offset-2 ${r[k] ? 'border-forest bg-forest text-ivory' : 'border-moss'}`}>{r[k] && <Check size={18} strokeWidth={2} />}</span>
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
            <textarea id="notes" rows={3} maxLength={300} value={r.notes} onChange={(e) => set('notes', e.target.value)} className="w-full rounded-2xl border border-line bg-ivory p-4 text-base" /></div>
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
