import { useState } from 'react';
import type { DayPlan, DailyLogStatus, Day } from '../libs/types'
import { usePlan } from '../context/PlanContext'
import { API_BASE_URL } from '../libs/config'

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

const LOG_OPTIONS: { value: DailyLogStatus; label: string; color: string; active: string }[] = [
  { value: 'done',   label: 'Done',   color: 'border-green-300 text-green-700 hover:bg-green-50', active: 'bg-green-600 border-green-600 text-white' },
  { value: 'unable', label: 'Unable', color: 'border-amber-300 text-amber-700 hover:bg-amber-50', active: 'bg-amber-500 border-amber-500 text-white' },
  { value: 'missed', label: 'Missed', color: 'border-red-300 text-red-700 hover:bg-red-50',       active: 'bg-red-500 border-red-500 text-white' },
]


function MealRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500 capitalize">{label}</span>
      <span className="text-xs font-medium text-gray-700 max-w-[60%] text-right">{value || '—'}</span>
    </div>
  )
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-col gap-0.5">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value || '—'}</span>
    </div>
  )
}

function DayCard({ day, label, status, onStatus, onSubmit, submitting }: {
  day: DayPlan
  label: string
  status: DailyLogStatus
  onStatus: (s: DailyLogStatus) => void
  onSubmit: () => void
  submitting: boolean
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 capitalize">{label}</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
        <p className="text-xs font-medium text-gray-500 mb-2">Daily log</p>
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
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="w-full bg-green-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving…' : 'Save log'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatChip label="Focus" value={day.focus} />
        <StatChip label="Workout type" value={day.workoutType} />
        <StatChip label="Duration" value={day.duration ? `${day.duration} min` : ''} />
      </div>

      <div className="bg-green-50 rounded-xl px-4 py-3">
        <p className="text-xs text-green-600 font-medium mb-1">Warm-up</p>
        <ul className="text-sm text-gray-700 list-disc list-inside space-y-0.5">
          {day.warmup.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>

      {day.exercises.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Exercises</p>
          <div className="flex flex-col gap-2">
            {day.exercises.map((ex, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-700 font-medium">{ex.name}</span>
                <span className="text-xs text-gray-500">{ex.sets} sets × {ex.reps} reps · {ex.rest}s rest</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
        <p className="text-xs font-medium text-gray-500 mb-2">Meals</p>
        <MealRow label="Breakfast" value={day.meals.breakfast} />
        <MealRow label="Lunch" value={day.meals.lunch} />
        <MealRow label="Dinner" value={day.meals.dinner} />
      </div>

      {day.motivation && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl px-4 py-3">
          <p className="text-xs text-green-100 font-medium mb-1">Motivation</p>
          <p className="text-sm text-white">{day.motivation}</p>
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

  const token = localStorage.getItem('token')

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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden">

      {/* ── Left panel ── */}
      <div className="bg-gray-50 py-10 px-6 flex flex-col items-center justify-center gap-6 lg:flex-1 lg:overflow-y-auto">
        <div className="text-center max-w-sm">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Generate with AI</h1>
          <p className="text-sm text-gray-500">Your personalised weekly plan will appear below.</p>
        </div>

        <button
          onClick={generateWeeklyContent}
          disabled={loading}
          className="bg-green-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? 'Generating…'
            : aiResult
            ? 'Regenerate routine'
            : 'Generate Plan'}
        </button>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-col bg-white border-t border-gray-200 lg:border-t-0 lg:border-l lg:w-[50%] lg:shrink-0 lg:overflow-hidden">

        {/* Day tabs */}
        <div className="flex border-b border-gray-200 px-4 pt-4 gap-1 overflow-x-auto">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg capitalize whitespace-nowrap transition-colors ${
                selectedDay === day ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Day content */}
        <div className="px-6 py-6 lg:flex-1 lg:overflow-y-auto">
          {fetching ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
              <div className="w-8 h-8 rounded-full border-4 border-green-600 border-t-transparent animate-spin" />
              <p className="text-gray-400 text-sm">Loading your plan…</p>
            </div>
          ) : aiResult?.weeklyPlans?.[selectedDay] ? (
            <DayCard
              day={aiResult.weeklyPlans[selectedDay]}
              label={selectedDay}
              status={dailyLogs[selectedDay]}
              onStatus={(s) => setDailyLogs(prev => ({ ...prev, [selectedDay]: s }))}
              onSubmit={submitLog}
              submitting={submitting}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
              <p className="text-gray-400 text-sm">No plan yet. Hit <span className="font-semibold text-green-600">Generate Plan</span> to get started.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default GeneratePage
