import { IconCalendar } from '../icons'

export function EmptyDayState() {
  return (
    <div className="surface-card flex flex-col items-center justify-center text-center gap-3 px-6 py-16">
      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500">
        <IconCalendar size={20} />
      </div>
      <p className="text-neutral-400 text-sm max-w-[220px]">
        No plan yet. Hit <span className="font-semibold text-emerald-400">Generate Plan</span> to get started.
      </p>
    </div>
  )
}
