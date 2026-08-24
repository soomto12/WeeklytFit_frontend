import type { DayPlan } from '../../libs/types'
import { IconFork } from '../icons'

export function MealsCard({ meals }: { meals: DayPlan['meals'] }) {
  const rows = [
    { label: 'Breakfast', value: meals.breakfast },
    { label: 'Lunch', value: meals.lunch },
    { label: 'Dinner', value: meals.dinner },
  ]

  return (
    <div className="surface-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <IconFork size={16} className="text-emerald-400" />
        <p className="text-white font-semibold">Daily Meals</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {rows.map(({ label, value }) => (
          <div key={label} className="bg-white/3 border border-white/10 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1.5">{label}</p>
            <p className="text-sm text-neutral-300 leading-relaxed">{value || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
