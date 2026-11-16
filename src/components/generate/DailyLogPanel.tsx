import type { DayPlan, DailyLogStatus } from '../../libs/types'
import { IconClock, IconDumbbell, IconZap } from '../icons'
import { StatRow } from './StatRow'

const LOG_OPTIONS: { value: DailyLogStatus; label: string; color: string; active: string }[] = [
  { value: 'done',   label: 'Done',   color: 'border-white/10 text-neutral-300 hover:bg-white/5', active: 'bg-emerald-400 border-emerald-400 text-neutral-950' },
  { value: 'unable', label: 'Unable', color: 'border-white/10 text-neutral-300 hover:bg-white/5', active: 'bg-amber-400 border-amber-400 text-neutral-950' },
  { value: 'missed', label: 'Missed', color: 'border-white/10 text-neutral-300 hover:bg-white/5', active: 'bg-red-400 border-red-400 text-neutral-950' },
]

export function DailyLogPanel({ plan, status, onLog, submitting }: {
  plan: DayPlan
  status: DailyLogStatus
  onLog: (s: DailyLogStatus) => void
  submitting: boolean
}) {
  const totalSets = plan.exercises.reduce((n, ex) => n + (ex.sets || 0), 0)

  return (
    <div className="flex flex-col gap-5">
      <div className="surface-card p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-semibold">Daily log</p>
          {submitting && <span className="text-xs text-neutral-500">Saving…</span>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {LOG_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onLog(opt.value)}
              disabled={submitting}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                status === opt.value ? opt.active : opt.color
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-4 pt-1">
          <StatRow icon={<IconZap size={14} />} label="Day type" value={plan.isRest ? 'Rest day' : 'Training'} />
          <StatRow icon={<IconDumbbell size={14} />} label="Exercises" value={String(plan.exercises.length)} />
          <StatRow icon={<IconClock size={14} />} label="Total sets" value={totalSets ? String(totalSets) : '—'} />
        </div>
      </div>
    </div>
  )
}
