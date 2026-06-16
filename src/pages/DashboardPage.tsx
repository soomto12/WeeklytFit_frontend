import { useState, useEffect } from 'react'
import type { WorkoutRoutine, DailyLogStatus, DayPlan } from '../libs/types'
import { usePlan } from '../context/PlanContext'

const STATUS_CONFIG: Record<DailyLogStatus, { label: string; color: string; bar: string }> = {
  done:    { label: 'Done',    color: 'bg-green-500',  bar: 'bg-green-500'  },
  missed:  { label: 'Missed',  color: 'bg-red-400',    bar: 'bg-red-400'    },
  unable:  { label: 'Unable',  color: 'bg-amber-400',  bar: 'bg-amber-400'  },
  pending: { label: 'Pending', color: 'bg-gray-200',   bar: 'bg-gray-200'   },
}

function WeeklyProgressSummary() {
  const { dailyLogs } = usePlan()
  const total = DAYS.length

  const counts = DAYS.reduce<Record<DailyLogStatus, number>>(
    (acc, day) => { acc[dailyLogs[day]]++; return acc },
    { done: 0, missed: 0, unable: 0, pending: 0 }
  )

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">Weekly Progress</p>
          <p className="text-xs text-gray-400 mt-0.5">This week's workout log</p>
        </div>
        <span className="text-2xl font-bold text-green-600">{counts.done}<span className="text-sm font-medium text-gray-400">/{total}</span></span>
      </div>

      {/* Segmented progress bar */}
      <div className="flex rounded-full overflow-hidden h-3 gap-0.5">
        {DAYS.map(day => (
          <div
            key={day}
            className={`flex-1 ${STATUS_CONFIG[dailyLogs[day]].color} rounded-full`}
          />
        ))}
      </div>

      {/* Day dots */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map(day => {
          const status = dailyLogs[day]
          return (
            <div key={day} className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                status === 'done'    ? 'bg-green-100 text-green-700' :
                status === 'missed' ? 'bg-red-100 text-red-500'     :
                status === 'unable' ? 'bg-amber-100 text-amber-600' :
                                      'bg-gray-100 text-gray-400'
              }`}>
                {day.slice(0, 1).toUpperCase()}
              </div>
              <span className="text-[10px] text-gray-400 capitalize">{day.slice(0, 3)}</span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {(Object.keys(STATUS_CONFIG) as DailyLogStatus[]).map(s => (
          <div key={s} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${STATUS_CONFIG[s].color}`} />
            <span className="text-xs text-gray-500">{STATUS_CONFIG[s].label}: {counts[s]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
type Day = typeof DAYS[number]

function CurrentWeekSnapshot() {
  const { aiResult } = usePlan()
  const todayIndex = new Date().getDay()
  const todayKey = DAYS[todayIndex]
  const plan = aiResult?.weeklyPlans?.[todayKey]

  if (!plan) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 py-10">
        <p className="text-sm font-semibold text-gray-800">Today's Snapshot</p>
        <p className="text-xs text-gray-400">No plan generated yet. Head to the Generate page to create one.</p>
      </div>
    )
  }

  const isRest = plan.workoutType.toLowerCase() === 'rest'

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">Today's Snapshot</p>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">{plan.day} · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isRest ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
          {plan.workoutType}
        </span>
      </div>

      {/* Focus + Duration */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 rounded-xl px-3 py-2">
          <p className="text-xs text-gray-400">Focus</p>
          <p className="text-sm font-semibold text-gray-800">{plan.focus}</p>
        </div>
        <div className="bg-gray-50 rounded-xl px-3 py-2">
          <p className="text-xs text-gray-400">Duration</p>
          <p className="text-sm font-semibold text-gray-800">{plan.duration ? `${plan.duration} min` : 'Rest day'}</p>
        </div>
      </div>

      {/* Exercises */}
      {plan.exercises.length > 0 && (
        <div className="bg-green-50 rounded-xl px-4 py-3">
          <p className="text-xs text-green-700 font-medium mb-2">Exercises</p>
          <div className="flex flex-col gap-1.5">
            {plan.exercises.map((ex, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">{ex.name}</span>
                <span className="text-xs text-gray-400">{ex.sets} × {ex.reps}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meals */}
      <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
        <p className="text-xs font-medium text-gray-500 mb-2">Meals</p>
        {[
          { label: 'Breakfast', value: plan.meals.breakfast },
          { label: 'Lunch',     value: plan.meals.lunch },
          { label: 'Dinner',    value: plan.meals.dinner },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="text-xs font-medium text-gray-700 max-w-[60%] text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DayBadge({ day, plan }: { day: string; plan: DayPlan }) {
  const isRest = plan?.workoutType?.toLowerCase() === 'rest'
  return (
    <div className={`rounded-xl px-3 py-2 flex flex-col gap-0.5 ${isRest ? 'bg-gray-100' : 'bg-green-50'}`}>
      <span className="text-xs font-semibold text-gray-500 capitalize">{day.slice(0, 3)}</span>
      <span className={`text-xs font-medium truncate ${isRest ? 'text-gray-400' : 'text-green-700'}`}>
        {plan?.focus || '—'}
      </span>
    </div>
  )
}

function RoutineCard({ routine, onSelect }: { routine: WorkoutRoutine; onSelect: () => void }) {
  const date = new Date(routine.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 hover:border-green-400 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">Weekly Plan</p>
          <p className="text-xs text-gray-400 mt-0.5">Generated {date}</p>
        </div>
        <button
          onClick={onSelect}
          className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
        >
          View details →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS.map(day => (
          <DayBadge key={day} day={day} plan={routine.dailyPlans[day]} />
        ))}
      </div>
    </div>
  )
}

function RoutineModal({ routine, onClose }: { routine: WorkoutRoutine; onClose: () => void }) {
  const [selectedDay, setSelectedDay] = useState<Day>('monday')
  const plan = routine.dailyPlans[selectedDay]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800">
            {new Date(routine.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>

        <div className="flex gap-1 px-4 pt-3 overflow-x-auto">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
                selectedDay === day ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto px-5 py-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Focus', value: plan?.focus },
              { label: 'Type', value: plan?.workoutType },
              { label: 'Duration', value: plan?.duration ? `${plan.duration} min` : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value || '—'}</p>
              </div>
            ))}
          </div>

          {plan?.warmup?.length > 0 && (
            <div className="bg-green-50 rounded-xl px-4 py-3">
              <p className="text-xs text-green-600 font-medium mb-1">Warm-up</p>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-0.5">
                {plan.warmup.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          {plan?.exercises?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <p className="text-xs font-medium text-gray-500 mb-2">Exercises</p>
              {plan.exercises.map((ex, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-xs text-gray-700 font-medium">{ex.name}</span>
                  <span className="text-xs text-gray-500">{ex.sets} × {ex.reps} · {ex.rest}s</span>
                </div>
              ))}
            </div>
          )}

          {plan?.meals && (
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <p className="text-xs font-medium text-gray-500 mb-2">Meals</p>
              {[
                { label: 'Breakfast', value: plan.meals.breakfast },
                { label: 'Lunch', value: plan.meals.lunch },
                { label: 'Dinner', value: plan.meals.dinner },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-medium text-gray-700 max-w-[60%] text-right">{value || '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DashboardPage() {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<WorkoutRoutine | null>(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await fetch('http://localhost:3001/aiResult/results', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        setRoutines(data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchRoutines()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Track your progress and plans</p>
        </div>

        <CurrentWeekSnapshot />
        <WeeklyProgressSummary />

        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-3">Your Workout Routines</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-green-600 border-t-transparent animate-spin" />
          </div>
        ) : routines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
            <p className="text-gray-400 text-sm">No routines generated yet.</p>
            <p className="text-xs text-gray-300">Head to the Generate page to create your first plan.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {routines.map(routine => (
              <RoutineCard key={routine.id} routine={routine} onSelect={() => setSelected(routine)} />
            ))}
          </div>
        )}
      </div>

      {selected && <RoutineModal routine={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default DashboardPage
