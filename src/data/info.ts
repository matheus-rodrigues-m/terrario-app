// ⚠ ANTES DE PUBLICAR: troque o WhatsApp e o endereço pelos dados REAIS do restaurante.
export const INFO = {
  whatsapp: '5538991858001', // país + DDD + número, só dígitos
  address: 'Endereço do Terrário — rua, número, cidade',
  hours: [
    ['Terça a sexta', '17:30h – 00:00h'],
    ['Sábado', '11:30h–00:00h'],
    ['Domingo', '11:30h–16:00h'],
  ],
}
// Turnos em que a reserva é permitida em cada dia da semana (0 = domingo … 6 = sábado).
// Mantenha coerente com INFO.hours. Segunda (1) fechada; domingo só almoço.
export const OPEN_SHIFTS: Record<number, string[]> = {
  0: ['Almoço'],
  1: [],
  2: ['Almoço', 'Jantar'],
  3: ['Almoço', 'Jantar'],
  4: ['Almoço', 'Jantar'],
  5: ['Almoço', 'Jantar'],
  6: ['Almoço', 'Jantar'],
}

// Primeiro e último horário em que aceitamos reserva em cada turno (o cliente pode digitar qualquer minuto dentro da janela).
export const SHIFT_WINDOW: Record<string, [string, string]> = {
  Almoço: ['12:00', '14:00'],
  Jantar: ['19:00', '21:00'],
}

// Sugestões de horário, em ordem de prioridade. Aparecem até 3, só as válidas para a data escolhida.
export const SUGGESTED_TIMES = ['13:00', '20:00', '19:30', '12:30', '20:30', '13:30', '19:00', '12:00', '21:00', '14:00']

export const IS_PLACEHOLDER = INFO.whatsapp === '5531999999999' || INFO.address.startsWith('Endereço do Terrário')
if (IS_PLACEHOLDER) console.warn('[Terrário] src/data/info.ts ainda tem WhatsApp/endereço de exemplo — atualize antes de publicar.')
 
