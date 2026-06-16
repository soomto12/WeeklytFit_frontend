import { createContext, useContext, useState, useEffect, type ReactNode, type Dispatch, type SetStateAction } from 'react'
import type { AI_Result, DailyLogStatus, Day } from '../libs/types'

const DEFAULT_LOGS: Record<Day, DailyLogStatus> = {
  sunday: 'pending', monday: 'pending', tuesday: 'pending',
  wednesday: 'pending', thursday: 'pending', friday: 'pending', saturday: 'pending',
}

type PlanContextType = {
  aiResult: AI_Result | null
  setAiResult: (result: AI_Result | null) => void
  dailyLogs: Record<Day, DailyLogStatus>
  setDailyLogs: Dispatch<SetStateAction<Record<Day, DailyLogStatus>>>
  fetching: boolean
}

const PlanContext = createContext<PlanContextType | null>(null)

export function PlanProvider({ children }: { children: ReactNode }) {
  const [aiResult, setAiResult] = useState<AI_Result | null>(null)
  const [dailyLogs, setDailyLogs] = useState<Record<Day, DailyLogStatus>>(DEFAULT_LOGS)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    const fetchData = async () => {
      setFetching(true)
      try {
        const [planRes, logsRes] = await Promise.all([
          fetch('http://localhost:3001/aiResult/result', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:3001/dailyLogs',       { headers: { Authorization: `Bearer ${token}` } }),
        ])

        if (planRes.ok) {
          const planData = await planRes.json()
          setAiResult({ id: planData.data.id, weeklyPlans: planData.data.dailyPlans })
        }

        if (logsRes.ok) {
          const logsData = await logsRes.json()
          const log = logsData.data
          if (log) {
            const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'] as const
            const mapped = days.reduce<Record<Day, DailyLogStatus>>(
              (acc, day) => { acc[day] = log[day] ?? 'pending'; return acc },
              { ...DEFAULT_LOGS }
            )
            setDailyLogs(mapped)
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setFetching(false)
      }
    }

    fetchData()
  }, [])

  return (
    <PlanContext.Provider value={{ aiResult, setAiResult, dailyLogs, setDailyLogs, fetching }}>
      {children}
    </PlanContext.Provider>
  )
}

export function usePlan() {
  const context = useContext(PlanContext)
  if (!context) throw new Error('usePlan must be used inside <PlanProvider>')
  return context
}
