import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../libs/config'
import type { WorkoutRoutine, DailyLogStatus, DayPlan } from '../libs/types'
import { usePlan } from '../context/PlanContext'
import { IconDumbbell, IconFork, IconArrowRight, IconX } from '../components/icons'

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
type Day = typeof DAYS[number]

const STATUS_CONFIG: Record<DailyLogStatus, { label: string; bar: string; dot: string }> = {
  done:    { label: 'Done',    bar: 'bg-emerald-400', dot: 'bg-emerald-400' },
  missed:  { label: 'Missed',  bar: 'bg-red-400',     dot: 'bg-red-400'    },
  unable:  { label: 'Unable',  bar: 'bg-amber-400',   dot: 'bg-amber-400'  },
  pending: { label: 'Pending', bar: 'bg-white/10',    dot: 'bg-white/20'   },
}

function TodaysFocusCard({ plan, doneCount, total }: { plan: DayPlan | undefined; doneCount: number; total: number }) {
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0

  if (!plan) {
    return (
      <div className="surface-card p-6 flex flex-col items-start justify-center gap-3 lg:col-span-2 min-h-55">
        <span className="pill pill-muted">TODAY'S FOCUS</span>
        <p className="text-white text-lg font-semibold">No plan generated yet</p>
        <p className="text-neutral-400 text-sm">Head to Workouts to generate your personalised weekly routine.</p>
        <Link to="/generate" className="btn-accent px-5 py-2.5 text-sm mt-2 inline-flex items-center gap-2">
          Generate Plan <IconArrowRight size={16} />
        </Link>
      </div>
    )
  }

  const isRest = plan.workoutType?.toLowerCase() === 'rest'

  return (
    <div className="surface-card p-6 flex flex-col gap-5 lg:col-span-2">
      <div className="flex items-start justify-between">
        <div>
          <span className="pill pill-accent mb-3">TODAY'S FOCUS</span>
          <h2 className="text-2xl font-bold text-white capitalize">{plan.focus || plan.day}</h2>
        </div>
        {plan.duration ? (
          <div className="text-right shrink-0">
            <p className="text-3xl font-extrabold text-emerald-400">{plan.duration}</p>
            <p className="text-xs text-neutral-500">minutes</p>
          </div>
        ) : null}
      </div>

      <div>
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-neutral-400">Weekly Progress</span>
          <span className="text-white font-semibold">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`pill ${isRest ? 'pill-muted' : 'pill-accent'} capitalize`}>{plan.workoutType || 'Workout'}</span>
        {plan.exercises?.length > 0 && (
          <span className="pill pill-muted">{plan.exercises.length} exercises</span>
        )}
      </div>
    </div>
  )
}

function WeeklyPerformanceCard({ dailyLogs, onViewHistory }: { dailyLogs: Record<Day, DailyLogStatus>; onViewHistory: () => void }) {
  const counts = DAYS.reduce<Record<DailyLogStatus, number>>(
    (acc, day) => { acc[dailyLogs[day]]++; return acc },
    { done: 0, missed: 0, unable: 0, pending: 0 }
  )

  return (
    <div className="surface-card p-6 flex flex-col gap-5">
      <div>
        <p className="text-white font-semibold">Weekly Performance</p>
        <p className="text-neutral-400 text-sm mt-1">
          {counts.done} of {DAYS.length} days completed this week.
        </p>
      </div>

      <div className="flex items-end gap-1.5 h-16">
        {DAYS.map(day => {
          const status = dailyLogs[day]
          const height = status === 'pending' ? '25%' : '100%'
          return (
            <div key={day} className="flex-1 h-full flex items-end">
              <div className={`w-full rounded-md ${STATUS_CONFIG[status].bar}`} style={{ height }} />
            </div>
          )
        })}
      </div>

      <button
        onClick={onViewHistory}
        className="btn-outline text-sm py-2.5 inline-flex items-center justify-center gap-2"
      >
        View Full History <IconArrowRight size={16} />
      </button>
    </div>
  )
}

function ExercisesCard({ plan }: { plan: DayPlan | undefined }) {
  const exercises = plan?.exercises ?? []
  return (
    <div className="surface-card p-6 flex flex-col gap-1">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white font-semibold">Exercises</p>
        <span className="text-neutral-500 text-xs">{exercises.length} Total</span>
      </div>
      {exercises.length === 0 ? (
        <p className="text-neutral-500 text-sm py-6 text-center">No exercises for today.</p>
      ) : (
        <div className="flex flex-col">
          {exercises.map((ex, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                <IconDumbbell size={16} />
              </div>
              <p className="text-sm font-medium text-white flex-1 truncate">{ex.name}</p>
              <span className="text-xs text-neutral-400 shrink-0">{ex.sets} × {ex.reps}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MealsCard({ plan }: { plan: DayPlan | undefined }) {
  const meals = plan?.meals
  const rows = [
    { label: 'Breakfast', value: meals?.breakfast },
    { label: 'Lunch', value: meals?.lunch },
    { label: 'Dinner', value: meals?.dinner },
  ]

  return (
    <div className="surface-card p-6 flex flex-col gap-1">
      <p className="text-white font-semibold mb-3">Today's Meals</p>
      {!meals ? (
        <p className="text-neutral-500 text-sm py-6 text-center">No meal plan for today.</p>
      ) : (
        <div className="flex flex-col">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                <IconFork size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">{label}</p>
                <p className="text-sm text-neutral-300 truncate">{value || '—'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DayBadge({ day, plan }: { day: string; plan: DayPlan }) {
  const isRest = plan?.workoutType?.toLowerCase() === 'rest'
  return (
    <div className={`rounded-xl px-3 py-2 flex flex-col gap-0.5 border ${isRest ? 'bg-white/2 border-white/5' : 'bg-emerald-400/5 border-emerald-400/10'}`}>
      <span className="text-xs font-semibold text-neutral-500 capitalize">{day.slice(0, 3)}</span>
      <span className={`text-xs font-medium truncate ${isRest ? 'text-neutral-600' : 'text-emerald-400'}`}>
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
    <div className="surface-card surface-card-hover p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Weekly Plan</p>
          <p className="text-xs text-neutral-500 mt-0.5">Generated {date}</p>
        </div>
        <button
          onClick={onSelect}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-neutral-950 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <p className="text-sm font-semibold text-white">
            {new Date(routine.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <IconX size={18} />
          </button>
        </div>

        <div className="flex gap-1 px-4 pt-3 overflow-x-auto">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
                selectedDay === day ? 'bg-emerald-400 text-neutral-950' : 'text-neutral-400 hover:text-white'
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
              <div key={label} className="bg-white/3 border border-white/10 rounded-xl px-3 py-2">
                <p className="text-xs text-neutral-500">{label}</p>
                <p className="text-sm font-semibold text-white">{value || '—'}</p>
              </div>
            ))}
          </div>

          {plan?.warmup?.length > 0 && (
            <div className="bg-emerald-400/5 border border-emerald-400/10 rounded-xl px-4 py-3">
              <p className="text-xs text-emerald-400 font-medium mb-1">Warm-up</p>
              <ul className="text-sm text-neutral-300 list-disc list-inside space-y-0.5">
                {plan.warmup.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          {plan?.exercises?.length > 0 && (
            <div className="bg-white/3 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-xs font-medium text-neutral-500 mb-2">Exercises</p>
              {plan.exercises.map((ex, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-xs text-neutral-200 font-medium">{ex.name}</span>
                  <span className="text-xs text-neutral-500">{ex.sets} × {ex.reps} · {ex.rest}s</span>
                </div>
              ))}
            </div>
          )}

          {plan?.meals && (
            <div className="bg-white/3 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-xs font-medium text-neutral-500 mb-2">Meals</p>
              {[
                { label: 'Breakfast', value: plan.meals.breakfast },
                { label: 'Lunch', value: plan.meals.lunch },
                { label: 'Dinner', value: plan.meals.dinner },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-xs text-neutral-500">{label}</span>
                  <span className="text-xs font-medium text-neutral-200 max-w-[60%] text-right">{value || '—'}</span>
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
  const { aiResult, dailyLogs } = usePlan()
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<WorkoutRoutine | null>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/aiResult/results`, {
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

  const todayKey = DAYS[new Date().getDay()]
  const todayPlan = aiResult?.weeklyPlans?.[todayKey]
  const doneCount = DAYS.reduce((n, d) => n + (dailyLogs[d] === 'done' ? 1 : 0), 0)

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Track your progress and plans for maximum performance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <TodaysFocusCard plan={todayPlan} doneCount={doneCount} total={DAYS.length} />
          <WeeklyPerformanceCard dailyLogs={dailyLogs} onViewHistory={() => historyRef.current?.scrollIntoView({ behavior: 'smooth' })} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ExercisesCard plan={todayPlan} />
          <MealsCard plan={todayPlan} />
        </div>

        {!aiResult ? (
          <div className="surface-card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Ready to start training?</h3>
              <p className="text-neutral-400 text-sm max-w-md">Generate your first AI-powered weekly routine, tailored to your goals and schedule.</p>
            </div>
            <Link to="/generate" className="btn-accent px-6 py-3 text-sm inline-flex items-center gap-2 shrink-0">
              Generate Plan <IconArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="surface-card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Keep the momentum going</h3>
              <p className="text-neutral-400 text-sm max-w-md">Log today's workout or regenerate your routine to keep your training fresh.</p>
            </div>
            <Link to="/generate" className="btn-accent px-6 py-3 text-sm inline-flex items-center gap-2 shrink-0">
              Log Today's Workout <IconArrowRight size={16} />
            </Link>
          </div>
        )}

        <div ref={historyRef} className="pt-2">
          <h2 className="text-base font-semibold text-white mb-3">Your Workout Routines</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        ) : routines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
            <p className="text-neutral-500 text-sm">No routines generated yet.</p>
            <p className="text-xs text-neutral-600">Head to Workouts to create your first plan.</p>
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
