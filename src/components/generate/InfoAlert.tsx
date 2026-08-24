import type { ReactNode } from 'react'
import { IconInfo } from '../icons'

export function InfoAlert({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 border-l-2 border-emerald-400 bg-white/3 rounded-r-xl px-5 py-4">
      <IconInfo size={18} className="text-emerald-400 shrink-0 mt-0.5" />
      <p className="text-sm text-neutral-300">{children}</p>
    </div>
  )
}
