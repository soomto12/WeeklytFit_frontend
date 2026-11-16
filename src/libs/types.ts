import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
export const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type SignUpData = z.infer<typeof signUpSchema>
export type LoginData = z.infer<typeof loginSchema>

export const GOAL_PRESETS = [
  'Lose weight',
  'Build muscle',
  'Improve endurance',
  'Get stronger',
  'Stay fit & healthy',
  'Improve flexibility',
] as const

export const workoutFormSchema = z.object({
  goal: z.string().min(3, 'Goal must be at least 3 characters'),
  dailyHours: z.string().optional(),
  healthIssues: z.string().optional(),
  location: z.enum(['gym', 'homeWorkOut', 'both']),
  restDays: z.array(z.string()).optional(),
  difficultLevel: z.enum(['beginner', 'intermidiate', 'expert']),
  age: z.string().min(1, 'Age is required'),
  weight: z.string().optional(),
  height: z.string().optional(),
})

export type WorkoutFormData = z.infer<typeof workoutFormSchema>

// ---- Raw API shapes (POST/PUT /aiResult/generate, GET /aiResult/result(s)) ----

export interface ApiExercise {
  id: number
  aiResultId: number
  day: string
  name: string
  sets: number
  reps: string
  rest: number
  youtubeUrl?: string
  order: number
}

export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface ApiFood {
  id: number
  aiResultId: number
  day: string
  mealType: MealType
  name: string
}

export interface ApiAiResult {
  id: number
  userId?: number
  createdAt: string
  updatedAt?: string
  exercises: ApiExercise[]
  foods: ApiFood[]
}

// ---- UI shapes (grouped by day) ----

export type DailyLogStatus = 'done' | 'unable' | 'missed' | 'pending'

export const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
export type Day = typeof DAYS[number]

export type Exercise = ApiExercise

export interface DayPlan {
  day: Day
  isRest: boolean
  exercises: Exercise[]
  meals: Record<MealType, string>
}

export type WeeklyPlans = Record<Day, DayPlan>

export interface AI_Result {
  id: number
  createdAt: string
  weeklyPlans: WeeklyPlans
}

export type WorkoutRoutine = AI_Result

/** Groups the flat exercises/foods arrays from the API into a per-day plan. */
export function toAiResult(data: ApiAiResult): AI_Result {
  const weeklyPlans = {} as WeeklyPlans
  for (const day of DAYS) {
    const exercises = (data.exercises ?? [])
      .filter(e => e.day?.toLowerCase() === day)
      .sort((a, b) => a.order - b.order)
    const meals: Record<MealType, string> = { breakfast: '', lunch: '', dinner: '' }
    for (const f of data.foods ?? []) {
      if (f.day?.toLowerCase() === day && f.mealType in meals) meals[f.mealType] = f.name
    }
    weeklyPlans[day] = { day, isRest: exercises.length === 0, exercises, meals }
  }
  return { id: data.id, createdAt: data.createdAt, weeklyPlans }
}
