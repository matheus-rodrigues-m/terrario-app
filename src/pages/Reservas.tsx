
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, X, Check, Send, Clock } from 'lucide-react'
import { SUGGESTED_TIMES } from '../data/info'
import { SPACES as AMBIENTES } from '../data/spaces'
import { buildMessage, maskPhone, waLink } from '../lib/whatsapp'

const OCC = ['Romântico', 'Família com crianças', 'Aniversário', 'Corporativo', 'Amigos']
const NEEDS = [{ k: 'kids', label: 'Cadeira infantil' }, { k: 'acc', label: 'Acessibilidade para mobilidade reduzida' }]
const SPACES = [...AMBIENTES.map((s) => s.name), 'Salão Privativo']
const clean = (s: string) => s.trim().replace(/\s+/g, ' ')

const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10) }
const dayOf = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).getDay() }
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
const fmtH = (t: string) => { const [h, m] = t.split(':'); return m === '00' ? `${+h}h` : `${+h}h${m}` }

// A madrugada pertence ao dia em que o restaurante abriu.
const BUSINESS_HOURS: Record<number, [string, string] | null> = {
  0: ['11:30', '16:00'], 1: null, 2: ['17:30', '00:00'],
  3: ['17:30', '00:00'], 4: ['17:30', '00:00'],
  5: ['17:30', '00:30'], 6: ['12:00', '00:30'],
}

const windowsFor = (date: string): [string, string][] => {
  if (!date) return []
  const hours = BUSINESS_HOURS[dayOf(date)]
  if (!hours) return []
  const [start, end] = hours
  return toMin(end) < toMin(start)
    ? [[start, '23:59'], ['00:00', end]]
    : [[start, end]]
}

const windowsText = (date: string) => {
  const hours = BUSINESS_HOURS[dayOf(date)]
  return hours ? `das ${fmtH(hours[0])} às ${fmtH(hours[1])}` : ''
}

const inWindow = (date: string, t: string) =>
  windowsFor(date).some(([a, b]) => toMin(t) >= toMin(a) && toMin(t) <= toMin(b))

const reservationDateTime = (date: string, time: string) => {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const hours = BUSINESS_HOURS[dayOf(date)]
  const nextDay = !!hours && toMin(hours[1]) < toMin(hours[0]) && toMin(time) <= toMin(hours[1])
  return new Date(year, month - 1, day + (nextDay ? 1 : 0), hour, minute)
}

const isPast = (date: string, time: string) =>
  reservationDateTime(date, time).getTime() <= Date.now()

const dateError = (date: string) => {
  if (!date) return 'Escolha a data.'
  if (date < today()) return 'Escolha uma data a partir de hoje.'
  if (!windowsFor(date).length) return 'Não abrimos nesse dia. Escolha outra data.'
  if (windowsFor(date).every(([, end]) => isPast(date, end)))
    return 'Não há mais horários disponíveis nesse dia.'
  return ''
}

const timeError = (date: string, t: string) => {
  if (!t) return 'Selecione a hora e os minutos.'
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(t)) return 'Selecione um horário válido.'
  if (!inWindow(date, t)) return `Nesse dia aceitamos reservas ${windowsText(date)}.`
  if (isPast(date, t)) return 'Esse horário já passou.'
  return ''
}

const suggestionsFor = (date: string) => {
  if (!date) return SUGGESTED_TIMES.slice(0, 3).sort()
  if (dateError(date)) return []
  return SUGGESTED_TIMES.filter((t) => inWindow(date, t) && !isPast(date, t)).slice(0, 3).sort()
}

const validPhone = (d: string) =>
  /^[1-9]{2}[2-9]\d{7}$/.test(d) || /^[1-9]{2}9\d{8}$/.test(d)

export default function Reservas() {
  const nav = useNavigate()
  const { key } = useLocation()
  const [step, setStep] = useState(0)
  const [r, setR] = useState<any>({
    people: 2, date: '', time: '', occ: '', occOther: '',
    space: SPACES[0], kids: false, acc: false,
    needsOther: '', name: '', phone: '', notes: ''
  })

  const [touched, setTouched] = useState(false)
  const [timeOpen, setTimeOpen] = useState(false)
  const [pickerHour, setPickerHour] = useState('')
  const set = (k: string, v: any) => setR((p: any) => ({ ...p, [k]: v }))
  const digits = r.phone.replace(/\D/g, '')
  const dErr = r.date ? dateError(r.date) : ''
  const tErr = r.date && !dErr && r.time.length === 5 ? timeError(r.date, r.time) : ''

  const calcErrors = (): any => ({
    0: dateError(r.date) || timeError(r.date, r.time),
    1: !(clean(r.occOther) || r.occ) ? 'Escolha ou digite a ocasião.' : '',
    2: r.name.trim().length < 2 ? 'Informe seu nome.' : !validPhone(digits) ? 'Informe o telefone com DDD.' : '',
  })

  const err = calcErrors()[step]

  const next = () => {
    const fresh = calcErrors()
    if (fresh[step]) return setTouched(true)

    if (step === 2 && fresh[0]) {
      setStep(0)
      return setTouched(true)
    }

    setTouched(false)
    if (step < 2) return setStep(step + 1)

    const other = clean(r.needsOther)
    const msg = buildMessage({
      ...r,
      occasion: clean(r.occOther) || r.occ,
      needs: [...NEEDS.filter((n) => r[n.k]).map((n) => n.label), other && `Outro: ${other}`].filter(Boolean),
    })
    window.open(waLink(msg), '_blank', 'noopener')
  }

  const back = () => {
    setTouched(false)
    step ? setStep(step - 1) : key === 'default' ? nav('/') : nav(-1)
  }

  const title = ['Sua mesa', 'Sua experiência', 'Confirmação'][step]
  const suggestions = suggestionsFor(r.date)

  const availableTimes = !r.date || dErr ? [] : windowsFor(r.date).flatMap(([start, end]) => {
    const times: string[] = []
    for (let minute = toMin(start); minute <= toMin(end); minute++) {
      const t = `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`
      if (!isPast(r.date, t)) times.push(t)
    }
    return times
  })

  const hours = [...new Set(availableTimes.map((t) => t.slice(0, 2)))]
  const selectedHour = r.time ? r.time.slice(0, 2) : ''
  const activeHour = timeOpen ? pickerHour : selectedHour
  const minutes = [...new Set(availableTimes.filter((t) => t.startsWith(`${activeHour}:`)).map((t) => t.slice(3, 5)))]

  const openPicker = () => {
    if (!hours.length) return
    setPickerHour(hours.includes(selectedHour) ? selectedHour : hours[0])
    setTimeOpen(true)
  }

  const chooseMinute = (minute: string) => {
    set('time', `${pickerHour}:${minute}`)
    setTimeOpen(false)
  }

  return (
    <div className="absolute inset-0 flex min-h-0 flex-col overflow-hidden bg-sand">
      <style>{`.reserva-time-list::-webkit-scrollbar { display: none; }`}</style>

      {/* Cabeçalho fixo */}
      <header className="shrink-0 flex items-center justify-between px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button onClick={back} aria-label="Voltar" className="tap flex h-12 w-12 items-center justify-center">
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <p className="text-sm font-medium text-moss">Passo {step + 1} de 3</p>
        <button onClick={() => nav('/')} aria-label="Fechar reserva" className="tap flex h-12 w-12 items-center justify-center">
          <X size={24} strokeWidth={1.5} />
        </button>
      </header>

      <div className="mx-4 h-1.5 shrink-0 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-terra transition-all duration-200" style={{ width: `${((step + 1) / 3) * 100}%` }} />
      </div>

      {/* Somente esta área pode rolar */}
      <div className="no-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 pb-4 pt-4 sm:space-y-6 sm:pb-6 sm:pt-6">
        <h1 className="h1">{title}</h1>

        {/* ETAPA 1 */}
        {step === 0 && (<>
          <fieldset>
            <legend className="mb-2 font-semibold">Quantas pessoas?</legend>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button key={n} aria-pressed={r.people === n} onClick={() => set('people', n)}
                  className="chip tap font-serif text-xl">{n === 8 ? '8+' : n}</button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="date" className="mb-2 block font-semibold">Data</label>
            <input id="date" type="date" min={today()} value={r.date}
              onChange={(e) => {
                setTimeOpen(false)
                setR((p: any) => ({ ...p, date: e.target.value, time: '' }))
              }}
              className="h-12 w-full rounded-2xl border border-line bg-ivory px-4 text-base" />
            {dErr && <p role="status" className="mt-2 text-sm font-medium text-[#B42323]">{dErr}</p>}
          </div>

          <div>
            <label htmlFor="time" className="mb-2 block font-semibold">Horário</label>

            {suggestions.length > 0 && (
              <div className="mb-2 flex gap-2">
                {suggestions.map((t) => (
                  <button key={t} aria-pressed={r.time === t} onClick={() => set('time', t)}
                    className="chip tap flex-1">{t}</button>
                ))}
              </div>
            )}

            <div className="relative">
              <button id="time" type="button" aria-label="Selecionar hora e minutos"
                aria-haspopup="dialog" aria-expanded={timeOpen}
                disabled={!hours.length}
                onClick={() => timeOpen ? setTimeOpen(false) : openPicker()}
                className="flex h-12 w-full items-center justify-between rounded-2xl border border-line bg-ivory px-4 text-base disabled:opacity-50">
                <span className={r.time ? 'font-medium' : 'text-moss'}>{r.time || '--:--'}</span>
                <Clock size={20} strokeWidth={1.7} aria-hidden="true" />
              </button>

              {timeOpen && (
                <div className="fixed inset-0 z-30 flex items-center justify-center">
                  <button type="button" aria-label="Fechar seleção de horário"
                    onClick={() => setTimeOpen(false)}
                    className="fixed inset-0 z-0 cursor-default bg-black/10" />

                  <div role="dialog" aria-label="Escolha a hora e os minutos"
                    className="relative z-10 w-44 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-line bg-ivory p-1 shadow-xl">

                    <div className="grid grid-cols-2 gap-1 border-b border-line pb-1 text-center text-xs font-semibold text-moss">
                      <span>Hora</span><span>Min</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1">
                      <div role="listbox" aria-label="Horas"
                        className="reserva-time-list max-h-[min(12rem,32dvh)] overflow-y-auto overscroll-contain"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {hours.map((h) => (
                          <button type="button" role="option" aria-selected={pickerHour === h}
                            key={h} onClick={() => setPickerHour(h)}
                            className={`block min-h-10 w-full rounded-md text-center text-sm ${pickerHour === h ? 'bg-forest font-semibold text-ivory' : 'hover:bg-muted'}`}>
                            {h}
                          </button>
                        ))}
                      </div>

                      <div role="listbox" aria-label="Minutos"
                        className="reserva-time-list max-h-[min(12rem,32dvh)] overflow-y-auto overscroll-contain"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {minutes.map((m) => (
                          <button type="button" role="option"
                            aria-selected={r.time === `${pickerHour}:${m}`}
                            key={m} onClick={() => chooseMinute(m)}
                            className={`block min-h-10 w-full rounded-md text-center text-sm ${r.time === `${pickerHour}:${m}` ? 'bg-forest font-semibold text-ivory' : 'hover:bg-muted'}`}>
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {tErr
              ? <p id="time-hint" role="status" className="mt-2 text-sm font-medium text-[#B42323]">{tErr}</p>
              : <p id="time-hint" className="mt-2 text-sm text-moss">
                  {r.date && !dErr ? `Reservas neste dia: ${windowsText(r.date)}.` : 'Escolha a data para ver os horários disponíveis.'}
                </p>}
          </div>
        </>)}

        {/* ETAPA 2 */}
        {step === 1 && (<>
          <fieldset>
            <legend className="mb-2 font-semibold">Qual a ocasião?</legend>
            <div className="grid grid-cols-2 gap-2">
              {OCC.map((o) => (
                <button key={o} aria-pressed={r.occ === o}
                  onClick={() => setR((p: any) => ({ ...p, occ: o, occOther: '' }))}
                  className="chip tap h-14 whitespace-normal leading-tight">{o}</button>
              ))}
              <input type="text" aria-label="Outra ocasião" maxLength={40}
                value={r.occOther} placeholder="Outra: digite aqui"
                onChange={(e) => setR((p: any) => ({ ...p, occOther: e.target.value, occ: '' }))}
                className={`tap h-14 w-full min-w-0 rounded-full border px-4 text-center text-sm font-medium ${clean(r.occOther)
                  ? 'border-forest bg-forest text-ivory placeholder:text-ivory/60'
                  : 'border-line bg-muted/60 text-ink placeholder:text-moss'}`} />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 font-semibold">Onde prefere sentar?</legend>
            <div className="flex flex-wrap gap-2">
              {SPACES.map((s) => (
                <button key={s} aria-pressed={r.space === s}
                  onClick={() => set('space', s)} className="chip tap">{s}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 font-semibold">Precisa de algo?</legend>
            <div className="space-y-2">
              {NEEDS.map(({ k, label }) => (
                <label key={k}
                  className="tap flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border border-line bg-ivory px-4">
                  <input type="checkbox" checked={r[k]}
                    onChange={(e) => set(k, e.target.checked)}
                    className="peer sr-only" />
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-terra peer-focus-visible:ring-offset-2 ${r[k]
                    ? 'border-forest bg-forest text-ivory' : 'border-moss'}`}>
                    {r[k] && <Check size={18} strokeWidth={2} />}
                  </span>
                  <span className="text-[15px]">{label}</span>
                </label>
              ))}

              <input type="text" aria-label="Outra necessidade" maxLength={120}
                value={r.needsOther}
                placeholder="Outro: digite (ex.: alergia, celíaco)"
                onChange={(e) => set('needsOther', e.target.value)}
                className="h-14 w-full rounded-2xl border border-line bg-ivory px-4 text-[15px] placeholder:text-moss" />
            </div>
          </fieldset>
        </>)}

        {/* ETAPA 3 */}
        {step === 2 && (<>
          <div>
            <label htmlFor="name" className="mb-2 block font-semibold">Nome</label>
            <input id="name" type="text" inputMode="text" autoComplete="name"
              value={r.name} onChange={(e) => set('name', e.target.value)}
              onBlur={() => set('name', clean(r.name))}
              className="h-12 w-full rounded-2xl border border-line bg-ivory px-4 text-base"
              placeholder="Como devemos te chamar?" />
          </div>

          <div>
            <label htmlFor="tel" className="mb-2 block font-semibold">WhatsApp</label>
            <input id="tel" type="tel" inputMode="tel" autoComplete="tel"
              value={r.phone} onChange={(e) => set('phone', maskPhone(e.target.value))}
              className="h-12 w-full rounded-2xl border border-line bg-ivory px-4 text-base"
              placeholder="(31) 99999-9999" />
          </div>

          <div>
            <label htmlFor="notes" className="mb-2 block font-semibold">
              Observações <span className="font-normal text-moss">(opcional)</span>
            </label>
            <textarea id="notes" rows={3} maxLength={300}
              value={r.notes} onChange={(e) => set('notes', e.target.value)}
              className="w-full rounded-2xl border border-line bg-ivory p-4 text-base" />
          </div>

          <p className="rounded-2xl bg-muted/60 p-3 text-sm text-moss">
            Ao tocar no botão, abrimos o WhatsApp com a mensagem pronta.
            A reserva é confirmada pela equipe.
          </p>
        </>)}
      </div>

      {/* Rodapé fixo: fora da área rolável */}
      <div className="relative z-10 shrink-0 border-t border-line/70 bg-sand/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
        {touched && err && (
          <p role="alert" className="mb-2 text-center text-sm font-medium text-[#B42323]">{err}</p>
        )}
        <button type="button" onClick={next} className="btn btn-primary tap w-full">
          {step < 2 ? 'Continuar' : (
            <><Send size={20} strokeWidth={1.5} />Concluir reserva no WhatsApp</>
          )}
        </button>
      </div>
    </div>
  )
}
