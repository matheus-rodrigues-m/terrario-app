export const SPACES = [
  { id: 'salao', name: 'Salão Principal', note: 'Esteiras de bambu e pendentes de palha', img: '/img/familiar.png' },
  { id: 'lounge', name: 'Lounge Noturno', note: 'Sofás, madeira e luz âmbar', img: '/img/lounge.png' },
  { id: 'jardim', name: 'Jardim', note: 'Vegetação exuberante ao redor da mesa', img: '/img/dia-dos-pais.png' },
  { id: 'adega', name: 'Adega e Champanhes', note: 'Cavas, vinhos e brindes', img: '/img/champanhes.png' },
]
export const BADGES = [
  { key: 'kids', label: 'Área Kids' },
  { key: 'acc', label: 'Acessibilidade Universal' },
  { key: 'priv', label: 'Salão Privativo' },
  { key: 'wine', label: 'Adega de Vinhos' },
]
// Depoimentos REAIS de clientes (com autorização). A seção "Quem já esteve aqui" só aparece se houver itens.
// Modelo: { name: 'Maria S.', text: 'Texto do depoimento.', occasion: 'Aniversário' },
export const REVIEWS: { name: string; text: string; occasion: string }[] = []
