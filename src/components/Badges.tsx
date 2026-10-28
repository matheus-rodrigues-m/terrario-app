import { Baby, Accessibility, Sparkles, Wine } from 'lucide-react'
import { BADGES } from '../data/spaces'
const ICONS: any = { kids: Baby, acc: Accessibility, priv: Sparkles, wine: Wine }
export default function Badges() {
  return (
    <ul className="grid grid-cols-2 gap-2 px-4">
      {BADGES.map((b) => {
        const Icon = ICONS[b.key]
        return (
          <li key={b.key} className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-line bg-white/80 px-3 py-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-terra"><Icon size={22} strokeWidth={1.5} /></span>
            <span className="text-sm font-medium leading-tight text-ink">{b.label}</span>
          </li>
        )
      })}
    </ul>
  )
}
