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

export const workoutFormSchema = z.object({
  goal: z.string().min(1, 'Goal is required'),
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


export interface Exercise {
    name: string
    sets: number
    reps: string | number
    rest: number
    youtubeUrl?: string
}


export interface DayPlan {
    day: string
    focus: string
    workoutType: string
    duration: number
    warmup: string[]
    exercises: Exercise[]
    meals: {
        breakfast: string
        lunch: string
        dinner: string
    }
    motivation?: string
}

export type DailyLogStatus = 'done' | 'unable' | 'missed' | 'pending'

export const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
export type Day = typeof DAYS[number]

export interface WorkoutRoutine {
    id: number
    createdAt: string
    dailyPlans: AI_Result['weeklyPlans']
}

export interface AI_Result {
    id?: number
    userId?: number | string
    weeklyPlans: {
        sunday: DayPlan
        monday: DayPlan
        tuesday: DayPlan
        wednesday: DayPlan
        thursday: DayPlan
        friday: DayPlan
        saturday: DayPlan
    }
}