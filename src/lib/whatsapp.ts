import { INFO } from '../data/info'
export const brl = (n: number) => n ? n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Sob consulta'
export const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
export function buildMessage(r: any) {
  const [y, m, d] = r.date.split('-')
  return [
    'Olá, equipe do Terrário Restaurante! Gostaria de solicitar uma reserva:', '',
    `• Nome: ${r.name.trim().replace(/\s+/g, ' ')}`,
    `• Data: ${d}/${m}/${y}`,
    `• Horário: ${r.time}`,
    `• Pessoas: ${r.people === 8 ? '8 ou mais' : r.people} convidados`,
    `• Ambiente Preferido: ${r.space}`,
    `• Ocasião: ${r.occasion}`,
    `• Necessidades Especiais: ${r.needs.length ? r.needs.join(' / ') : 'Nenhuma'}`,
    `• Observações: ${r.notes.trim() || '—'}`,
  ].join('\n')
}
export const waLink = (text: string) => `https://wa.me/${INFO.whatsapp}?text=${encodeURIComponent(text)}`
