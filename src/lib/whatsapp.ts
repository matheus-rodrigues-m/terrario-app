import { INFO } from '../data/info'
export const brl = (n: number) => n ? n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Sob consulta'
export const maskPhone = (v: string) => {
  let d = v.replace(/\D/g, '')
  // preenchimento automático costuma vir como "+55 31 99999-9999" ou "5531999999999"
  if (d.length > 11 && d.startsWith('55') && !v.includes('(')) d = d.slice(2)
  d = d.slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
const guests = (n: number) => n === 8 ? '8 ou mais convidados' : n === 1 ? '1 convidado' : `${n} convidados`
export function buildMessage(r: any) {
  const [y, m, d] = r.date.split('-')
  return [
    'Olá, equipe do Terrário Restaurante! Gostaria de solicitar uma reserva:', '',
    `• Nome: ${r.name.trim().replace(/\s+/g, ' ')}`,
    `• Telefone: ${r.phone}`,
    `• Data: ${d}/${m}/${y}`,
    `• Horário: ${r.time}`,
    `• Pessoas: ${guests(r.people)}`,
    `• Ambiente Preferido: ${r.space}`,
    `• Ocasião: ${r.occasion}`,
    `• Necessidades Especiais: ${r.needs.length ? r.needs.join(' / ') : 'Nenhuma'}`,
    `• Observações: ${r.notes.trim() || '—'}`,
  ].join('\n')
}
export const waLink = (text: string) => `https://wa.me/${INFO.whatsapp}?text=${encodeURIComponent(text)}`
