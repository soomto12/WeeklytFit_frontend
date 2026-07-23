import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import type { DayPlan, DailyLogStatus, Day } from '../libs/types'
import { usePlan } from '../context/PlanContext'
import { API_BASE_URL } from '../libs/config'
import { IconArrowRight, IconInfo, IconDumbbell, IconZap, IconClock, IconFork, IconCalendar } from '../components/icons'

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

const LOG_OPTIONS: { value: DailyLogStatus; label: string; color: string; active: string }[] = [
  { value: 'done',   label: 'Done',   color: 'border-white/10 text-neutral-300 hover:bg-white/5', active: 'bg-emerald-400 border-emerald-400 text-neutral-950' },
  { value: 'unable', label: 'Unable', color: 'border-white/10 text-neutral-300 hover:bg-white/5', active: 'bg-amber-400 border-amber-400 text-neutral-950' },
  { value: 'missed', label: 'Missed', color: 'border-white/10 text-neutral-300 hover:bg-white/5', active: 'bg-red-400 border-red-400 text-neutral-950' },
]

function DayTabs({ selectedDay, onSelect }: { selectedDay: Day; onSelect: (d: Day) => void }) {
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

function InfoAlert({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 border-l-2 border-emerald-400 bg-white/3 rounded-r-xl px-5 py-4">
      <IconInfo size={18} className="text-emerald-400 shrink-0 mt-0.5" />
      <p className="text-sm text-neutral-300">{children}</p>
    </div>
  )
}

function GenerateCard({ hasProfile, loading, hasPlan, onGenerate }: {
  hasProfile: boolean | null
  loading: boolean
  hasPlan: boolean
  onGenerate: () => void
}) {
  return (
    <div className="surface-card p-8 md:p-10 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Generate with AI</h1>
        <p className="text-neutral-400">Your personalised weekly plan will appear below.</p>
      </div>

      {hasProfile === false ? (
        <div className="flex flex-col gap-4 items-start">
          <InfoAlert>
            You haven't created a profile yet. Create one first so we can generate a workout routine tailored to you.
          </InfoAlert>
          <Link to="/profile" className="btn-accent px-6 py-3 inline-flex items-center gap-2">
            Create profile <IconArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <button
          onClick={onGenerate}
          disabled={loading || hasProfile === null}
          className="btn-accent px-6 py-3 self-start"
        >
          {loading ? 'Generating…' : hasPlan ? 'Regenerate routine' : 'Generate Plan'}
        </button>
      )}
    </div>
  )
}

function EmptyDayState() {
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

function ExercisesCard({ plan }: { plan: DayPlan }) {
  return (
    <div className="surface-card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white font-semibold">Exercises</p>
        <span className="text-xs text-neutral-500 uppercase tracking-wide">{plan.exercises.length} total movements</span>
      </div>
      <div className="flex flex-col">
        {plan.exercises.map((ex, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-3.5 border-b border-white/5 last:border-0">
            <p className="text-sm font-bold text-white uppercase tracking-wide">{ex.name}</p>
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

function MealsCard({ meals }: { meals: DayPlan['meals'] }) {
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

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

function DailyLogPanel({ plan, status, onStatus, onSubmit, submitting }: {
  plan: DayPlan
  status: DailyLogStatus
  onStatus: (s: DailyLogStatus) => void
  onSubmit: () => void
  submitting: boolean
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="surface-card p-5">
        <p className="text-white font-semibold mb-3">Daily log</p>
        <div className="flex gap-2 flex-wrap mb-3">
          {LOG_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onStatus(opt.value)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                status === opt.value ? opt.active : opt.color
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button onClick={onSubmit} disabled={submitting} className="btn-accent w-full text-sm py-2.5">
          {submitting ? 'Saving…' : 'Save log'}
        </button>

        <div className="mt-4 pt-1">
          <StatRow icon={<IconDumbbell size={14} />} label="Focus" value={plan.focus || '—'} />
          <StatRow icon={<IconZap size={14} />} label="Workout type" value={plan.workoutType || '—'} />
          <StatRow icon={<IconClock size={14} />} label="Duration" value={plan.duration ? `${plan.duration} min` : '—'} />
        </div>

        {plan.warmup?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-2">Warm-up</p>
            <ul className="flex flex-col gap-1.5">
              {plan.warmup.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {plan.motivation && (
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-2xl px-5 py-4">
          <p className="text-xs text-neutral-950/70 font-semibold mb-1">Motivation</p>
          <p className="text-sm text-neutral-950 font-medium">{plan.motivation}</p>
        </div>
      )}
    </div>
  )
}

function GeneratePage() {
  const { aiResult, setAiResult, dailyLogs, setDailyLogs, fetching } = usePlan()
  const [selectedDay, setSelectedDay] = useState<Day>(DAYS[new Date().getDay()])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setHasProfile(res.ok)
      } catch (error) {
        console.error(error)
        setHasProfile(false)
      }
    }
    checkProfile()
  }, [token])

  const submitLog = async () => {
    setSubmitting(true)
    try {
      await fetch(`${API_BASE_URL}/dailyLogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ aiResultId: aiResult?.id, day: selectedDay, status: dailyLogs[selectedDay] }),
      })
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const generateWeeklyContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/aiResult/generate`, {
        method: aiResult ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        console.log(data.message ?? 'Request failed')
        return
      }

      setAiResult({ id: data.data.id, weeklyPlans: data.data.dailyPlans })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const plan = aiResult?.weeklyPlans?.[selectedDay]

  return (
    <div className="flex flex-col">
      <DayTabs selectedDay={selectedDay} onSelect={setSelectedDay} />

      <div className="px-6 py-8">
        {fetching ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <div className="w-8 h-8 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
            <p className="text-neutral-500 text-sm">Loading your plan…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <GenerateCard
                hasProfile={hasProfile}
                loading={loading}
                hasPlan={!!aiResult}
                onGenerate={generateWeeklyContent}
              />
              {plan && (
                <>
                  <ExercisesCard plan={plan} />
                  <MealsCard meals={plan.meals} />
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              {plan ? (
                <DailyLogPanel
                  plan={plan}
                  status={dailyLogs[selectedDay]}
                  onStatus={(s) => setDailyLogs(prev => ({ ...prev, [selectedDay]: s }))}
                  onSubmit={submitLog}
                  submitting={submitting}
                />
              ) : (
                <EmptyDayState />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GeneratePage
