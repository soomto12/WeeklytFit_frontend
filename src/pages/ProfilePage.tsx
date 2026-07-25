import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workoutFormSchema, type WorkoutFormData } from '../libs/types'
import { API_BASE_URL } from '../libs/config'
import { useState, useEffect } from 'react'
import ProfileCard from '../components/ProfileCard'
import EditProfileModal from '../components/EditProfileModal'
import Spinner from '../components/Spinner'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const inputClass = 'field-input'
const labelClass = 'field-label'
const errorClass = 'field-error'

function ProfilePage() {
  const [profile, setProfile] = useState<WorkoutFormData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await fetch(`${API_BASE_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const resData = await res.json()
        if (!res.ok) {
          setError(resData.message ?? 'Failed to load profile.')
          return
        }
        setProfile(resData.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: { restDays: [] },
  })

  const selectedDays = watch('restDays') ?? []

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setValue('restDays', selectedDays.filter(d => d !== day))
    } else {
      setValue('restDays', [...selectedDays, day])
    }
  }

  const onSubmit: SubmitHandler<WorkoutFormData> = async (data) => {
    setError(null)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_BASE_URL}/profile/post`, {
        method: 'POST',
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

      setProfile(resData.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error.')
    }


  }

  function editProfile() {
    setIsEdit(true)
  }
  
 

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <Spinner size={36} />
        <p className="text-sm text-neutral-500">Loading your profile…</p>
      </div>
    )
  }

  if (profile) {
    return (
      <div className="px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {isEdit && (
            <EditProfileModal
              profile={profile}
              onClose={() => setIsEdit(false)}
              onSave={(updated) => { setProfile(updated); setIsEdit(false) }}
            />
          )}
          <ProfileCard profile={profile} onEdit={editProfile} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex overflow-hidden">

      {/* -- Left form panel -- */}
      <div className="flex-1 overflow-y-auto bg-neutral-950 py-10 px-6">
        <div className="max-w-lg mx-auto surface-card p-8">
          <>
              <h1 className="text-2xl font-bold text-white mb-1">Build Your Workout Plan</h1>
              <p className="text-sm text-neutral-400 mb-8">Fill in your details to generate a personalised plan.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

            {/* Goal */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Goal <span className="text-red-500">*</span></label>
              <input
                {...register('goal')}
                type="text"
                placeholder="e.g. Lose weight, build muscle…"
                className={inputClass}
              />
              {errors.goal && <span className={errorClass}>{errors.goal.message}</span>}
            </div>

            {/* Age */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Age <span className="text-red-500">*</span></label>
              <input
                {...register('age')}
                type="number"
                placeholder="e.g. 25"
                className={inputClass}
              />
              {errors.age && <span className={errorClass}>{errors.age.message}</span>}
            </div>

            {/* Weight & Height */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Weight (kg)</label>
                <input
                  {...register('weight')}
                  type="number"
                  placeholder="e.g. 70"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Height (cm)</label>
                <input
                  {...register('height')}
                  type="number"
                  placeholder="e.g. 175"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Daily Hours */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Daily Hours Available</label>
              <input
                {...register('dailyHours')}
                type="number"
                placeholder="e.g. 1.5"
                className={inputClass}
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Workout Location <span className="text-red-500">*</span></label>
              <div className="flex gap-3">
                {(['gym', 'homeWorkOut', 'both'] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      {...register('location')}
                      type="radio"
                      value={opt}
                      className="accent-emerald-400"
                    />
                    <span className="text-sm text-neutral-300 capitalize">
                      {opt === 'homeWorkOut' ? 'Home' : opt === 'both' ? 'Both' : 'Gym'}
                    </span>
                  </label>
                ))}
              </div>
              {errors.location && <span className={errorClass}>{errors.location.message}</span>}
            </div>

            {/* Difficulty Level */}
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Difficulty Level <span className="text-red-500">*</span></label>
              <div className="flex gap-3">
                {(['beginner', 'intermidiate', 'expert'] as const).map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      {...register('difficultLevel')}
                      type="radio"
                      value={level}
                      className="accent-emerald-400"
                    />
                    <span className="text-sm text-neutral-300 capitalize">{level}</span>
                  </label>
                ))}
              </div>
              {errors.difficultLevel && <span className={errorClass}>{errors.difficultLevel.message}</span>}
            </div>

            {/* Rest Days */}
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
                        ? 'bg-emerald-400 text-neutral-950 border-emerald-400'
                        : 'bg-white/3 text-neutral-400 border-white/10 hover:border-emerald-400/50'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Health Issues */}
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Health Issues / Injuries</label>
              <textarea
                {...register('healthIssues')}
                rows={3}
                placeholder="e.g. bad knees, lower back pain…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {error &&
              <p className="text-red-400 text-sm text-center">{error}</p>
            }

            <button
              type="submit"
              className="btn-accent py-3 mt-2"
            >
            Create profile
            </button>
              </form>
            </>
        </div>
      </div>

      {/* -- Right decorative panel -- */}
      <div className="hidden lg:flex lg:w-[46%] bg-gradient-to-br from-gray-900 via-green-900 to-emerald-700 flex-col justify-between p-12 relative overflow-hidden shrink-0">

        {/* Ambient glow blobs */}
        <div className="absolute -top-36 -left-36 w-[420px] h-[420px] bg-green-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-36 -right-28 w-[380px] h-[380px] bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Neural-network background SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none" viewBox="0 0 500 700" fill="none" preserveAspectRatio="xMidYMid slice">
          <circle cx="75"  cy="110" r="7"  fill="white"/>
          <circle cx="210" cy="70"  r="5"  fill="white"/>
          <circle cx="360" cy="130" r="9"  fill="white"/>
          <circle cx="430" cy="290" r="6"  fill="white"/>
          <circle cx="310" cy="370" r="11" fill="white"/>
          <circle cx="145" cy="330" r="7"  fill="white"/>
          <circle cx="55"  cy="410" r="5"  fill="white"/>
          <circle cx="450" cy="470" r="8"  fill="white"/>
          <circle cx="255" cy="510" r="6"  fill="white"/>
          <circle cx="105" cy="570" r="7"  fill="white"/>
          <circle cx="390" cy="590" r="5"  fill="white"/>
          <circle cx="200" cy="640" r="9"  fill="white"/>
          <line x1="75"  y1="110" x2="210" y2="70"  stroke="white" strokeWidth="1"/>
          <line x1="210" y1="70"  x2="360" y2="130" stroke="white" strokeWidth="1"/>
          <line x1="360" y1="130" x2="430" y2="290" stroke="white" strokeWidth="1"/>
          <line x1="75"  y1="110" x2="145" y2="330" stroke="white" strokeWidth="1"/>
          <line x1="145" y1="330" x2="310" y2="370" stroke="white" strokeWidth="1"/>
          <line x1="310" y1="370" x2="430" y2="290" stroke="white" strokeWidth="1"/>
          <line x1="55"  y1="410" x2="145" y2="330" stroke="white" strokeWidth="1"/>
          <line x1="310" y1="370" x2="255" y2="510" stroke="white" strokeWidth="1"/>
          <line x1="450" y1="470" x2="255" y2="510" stroke="white" strokeWidth="1"/>
          <line x1="105" y1="570" x2="255" y2="510" stroke="white" strokeWidth="1"/>
          <line x1="390" y1="590" x2="255" y2="510" stroke="white" strokeWidth="1"/>
          <line x1="450" y1="470" x2="390" y2="590" stroke="white" strokeWidth="1"/>
          <line x1="105" y1="570" x2="200" y2="640" stroke="white" strokeWidth="1"/>
          <line x1="390" y1="590" x2="200" y2="640" stroke="white" strokeWidth="1"/>
          <line x1="360" y1="130" x2="310" y2="370" stroke="white" strokeWidth="1"/>
          <line x1="210" y1="70"  x2="145" y2="330" stroke="white" strokeWidth="1"/>
        </svg>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-green-500/30 p-2.5 rounded-xl backdrop-blur-sm">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="1"  y="9"  width="3"  height="6" rx="1.5" fill="white"/>
              <rect x="4"  y="7"  width="2"  height="10" rx="1" fill="white"/>
              <rect x="6"  y="11" width="12" height="2" rx="1"  fill="white"/>
              <rect x="18" y="7"  width="2"  height="10" rx="1" fill="white"/>
              <rect x="20" y="9"  width="3"  height="6" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span className="text-white text-xl font-bold tracking-wide">WeeklyFit</span>
        </div>

        {/* Headline + features */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/>
            AI-Powered Fitness
          </div>

          <h2 className="text-[2.6rem] font-extrabold text-white leading-tight mb-4">
            Train Smarter.<br/>
            <span className="bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">
              Live Stronger.
            </span>
          </h2>

          <p className="text-green-100/75 text-sm leading-relaxed mb-10 max-w-[300px]">
            Personalised AI workout plans built around your body, your goals, and your lifestyle — no guesswork.
          </p>

          <div className="space-y-4">
            {([
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Smart Plans',
                desc: 'Tailored to your goals, schedule & fitness level',
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2"/>
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'AI Optimised',
                desc: 'Recommendations that evolve as you improve',
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Track Progress',
                desc: 'Stay consistent and hit milestones weekly',
              },
            ] as const).map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  {f.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{f.title}</p>
                  <p className="text-green-200/65 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-8">
          {([
            { value: '10k+', label: 'Active users' },
            { value: '500+', label: 'Plans generated' },
            { value: '98%', label: 'Satisfaction' },
          ] as const).map((s) => (
            <div key={s.label}>
              <p className="text-white font-extrabold text-xl">{s.value}</p>
              <p className="text-green-300/60 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default ProfilePage
