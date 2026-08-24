import type { Day } from '../../libs/types'

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

export function DayTabs({ selectedDay, onSelect }: { selectedDay: Day; onSelect: (d: Day) => void }) {
  return (
    <div className="flex gap-1 px-6 overflow-x-auto border-b border-white/10">
      {DAYS.map((day) => (
        <button
          key={day}
          onClick={() => onSelect(day)}
          className={`px-4 py-3.5 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors ${
            selectedDay === day ? 'text-emerald-400 border-emerald-400' : 'text-neutral-500 border-transparent hover:text-white'
          }`}
        >
          {day.slice(0, 3)}
        </button>
      ))}
    </div>
  )
}
