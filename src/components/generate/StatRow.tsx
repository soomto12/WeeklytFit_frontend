import type { ReactNode } from 'react'

export function StatRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-white flex items-center gap-1.5">
        {value}
        <span className="text-emerald-400">{icon}</span>
      </span>
    </div>
  )
}
