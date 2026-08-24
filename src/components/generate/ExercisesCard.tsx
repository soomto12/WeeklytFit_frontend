import type { DayPlan } from '../../libs/types'
import { IconYoutube } from '../icons'

export function ExercisesCard({ plan }: { plan: DayPlan }) {
  return (
    <div className="surface-card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white font-semibold">Exercises</p>
        <span className="text-xs text-neutral-500 uppercase tracking-wide">{plan.exercises.length} total movements</span>
      </div>
      <div className="flex flex-col">
        {plan.exercises.map((ex, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-3.5 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-white uppercase tracking-wide">{ex.name}</p>
              {ex.youtubeUrl && (
                <a
                  href={ex.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-emerald-400 transition-colors shrink-0"
                  title={`Watch ${ex.name} tutorial on YouTube`}
                >
                  <IconYoutube size={16} />
                </a>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm text-neutral-300">{ex.sets} sets × {ex.reps} reps</p>
              <p className="text-xs text-emerald-400">{ex.rest}s rest</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
