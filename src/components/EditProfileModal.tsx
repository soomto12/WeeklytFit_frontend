import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workoutFormSchema, type WorkoutFormData } from '../libs/types'
import { API_BASE_URL } from '../libs/config'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const inputClass = 'border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 w-full'
const labelClass = 'text-sm font-medium text-gray-700'
const errorClass = 'text-red-500 text-xs mt-0.5'

type Props = {
  profile: WorkoutFormData
  onClose: () => void
  onSave: (data: WorkoutFormData) => void
}

function EditProfileModal({ profile, onClose, onSave }: Props) {
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: profile,
  })

  const selectedDays = watch('restdays') ?? []

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setValue('restdays', selectedDays.filter(d => d !== day))
    } else {
      setValue('restdays', [...selectedDays, day])
    }
  }

  const onSubmit: SubmitHandler<WorkoutFormData> = async (data) => {
    setError(null)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_BASE_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      const resData = await res.json()
      if (!res.ok) {
        setError(resData.message ?? 'Something went wrong.')
        return
      }
      onSave(resData.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Goal <span className="text-red-500">*</span></label>
            <input {...register('goal')} type="text" placeholder="e.g. Lose weight, build muscle…" className={inputClass} />
            {errors.goal && <span className={errorClass}>{errors.goal.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Age <span className="text-red-500">*</span></label>
            <input {...register('age')} type="number" placeholder="e.g. 25" className={inputClass} />
            {errors.age && <span className={errorClass}>{errors.age.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Weight (kg)</label>
              <input {...register('weight')} type="number" placeholder="e.g. 70" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Height (cm)</label>
              <input {...register('height')} type="number" placeholder="e.g. 175" className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Daily Hours Available</label>
            <input {...register('dailyHours')} type="number" placeholder="e.g. 1.5" className={inputClass} />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Workout Location <span className="text-red-500">*</span></label>
            <div className="flex gap-3">
              {(['gym', 'homeWorkOut', 'both'] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input {...register('location')} type="radio" value={opt} className="accent-green-600" />
                  <span className="text-sm text-gray-700">
                    {opt === 'homeWorkOut' ? 'Home' : opt === 'both' ? 'Both' : 'Gym'}
                  </span>
                </label>
              ))}
            </div>
            {errors.location && <span className={errorClass}>{errors.location.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Difficulty Level <span className="text-red-500">*</span></label>
            <div className="flex gap-3">
              {(['beginner', 'intermidiate', 'expert'] as const).map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input {...register('difficultLevel')} type="radio" value={level} className="accent-green-600" />
                  <span className="text-sm text-gray-700 capitalize">{level}</span>
                </label>
              ))}
            </div>
            {errors.difficultLevel && <span className={errorClass}>{errors.difficultLevel.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Rest Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    selectedDays.includes(day)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-green-500'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Health Issues / Injuries</label>
            <textarea
              {...register('healthIssues')}
              rows={3}
              placeholder="e.g. bad knees, lower back pain…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default EditProfileModal
