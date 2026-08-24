import { useState, useEffect } from 'react'
import type { DailyLogStatus, Day } from '../libs/types'
import { usePlan } from '../context/PlanContext'
import { API_BASE_URL } from '../libs/config'
import { DayTabs } from '../components/generate/DayTabs'
import { GenerateCard } from '../components/generate/GenerateCard'
import { EmptyDayState } from '../components/generate/EmptyDayState'
import { ExercisesCard } from '../components/generate/ExercisesCard'
import { MealsCard } from '../components/generate/MealsCard'
import { DailyLogPanel } from '../components/generate/DailyLogPanel'

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

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

  const logDay = async (status: DailyLogStatus) => {
    setDailyLogs(prev => ({ ...prev, [selectedDay]: status }))
    setSubmitting(true)
    try {
      await fetch(`${API_BASE_URL}/dailyLogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ aiResultId: aiResult?.id, day: selectedDay, status }),
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
                  onLog={logDay}
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
