import { useRef } from 'react'
import type { WorkoutFormData } from '../libs/types'
import { useUser } from '../context/UserContext'
import { usePlan } from '../context/PlanContext'
import { API_BASE_URL } from '../libs/config'
import { IconFlag, IconTrendingUp, IconClock, IconMapPin, IconDumbbell, IconBed } from './icons'

const locationLabel: Record<WorkoutFormData['location'], string> = {
  gym: 'Gym',
  homeWorkOut: 'Home',
  both: 'Gym & Home',
}

const WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

function StatCard({ icon, label, value, unit }: { icon?: React.ReactNode; label: string; value: string; unit?: string }) {
  return (
    <div className="bg-white/3 border border-white/10 rounded-xl px-5 py-4">
      {icon && <div className="text-emerald-400 mb-2">{icon}</div>}
      <p className="text-xs text-neutral-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">
        {value} {unit && <span className="text-sm font-medium text-neutral-500">{unit}</span>}
      </p>
    </div>
  )
}

function ProfileCard({ profile, onEdit }: { profile: WorkoutFormData; onEdit: () => void }) {
  const { user, setUser, token } = useUser()
  const { aiResult } = usePlan()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch(`${API_BASE_URL}/users/addImage`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const resData = await res.json()
      if (!res.ok) return
      setUser(resData.data)
    } catch (err) {
      console.error(err)
    }
  }

  const todayKey = WEEK[(new Date().getDay() + 6) % 7]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Athlete Profile</h1>
          <p className="text-sm text-neutral-500 mt-1">Data-driven performance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Avatar card */}
        <div className="lg:col-span-1 surface-card p-6 flex flex-col items-center text-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative group shrink-0 rounded-full focus:outline-none"
            title="Change photo"
          >
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-emerald-400 flex items-center justify-center">
                <span className="text-neutral-950 font-bold text-3xl uppercase">
                  {user?.name?.charAt(0) ?? '?'}
                </span>
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

          <div>
            <p className="text-lg font-bold text-white">{user?.name}</p>
            <p className="text-sm text-neutral-500">{user?.email}</p>
          </div>

          <button onClick={onEdit} className="btn-outline w-full py-2.5 text-sm mt-2">
            Edit Profile
          </button>
        </div>

        {/* Main stats */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2 bg-white/3 border border-white/10 rounded-xl px-5 py-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <IconFlag size={16} />
                <span className="text-xs font-semibold uppercase tracking-wide">Primary Goal</span>
              </div>
              <p className="text-xl font-bold text-white mb-3">{profile.goal}</p>
              <div className="flex flex-wrap gap-2">
                <span className="pill pill-accent capitalize">{profile.difficultLevel}</span>
                <span className="pill pill-muted">{locationLabel[profile.location]}</span>
              </div>
            </div>
            <StatCard icon={<IconTrendingUp size={16} />} label="Level" value={profile.difficultLevel.charAt(0).toUpperCase() + profile.difficultLevel.slice(1)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard label="Age" value={`${profile.age}`} unit="yrs" />
            {profile.weight ? <StatCard label="Current Weight" value={`${profile.weight}`} unit="kg" /> : <StatCard label="Current Weight" value="—" />}
            {profile.height ? <StatCard label="Height" value={`${profile.height}`} unit="cm" /> : <StatCard label="Height" value="—" />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <StatCard icon={<IconClock size={16} />} label="Daily Training" value={profile.dailyHours ? profile.dailyHours : '—'} unit={profile.dailyHours ? 'h' : undefined} />
            <div className="bg-white/3 border border-white/10 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <IconMapPin size={16} />
                  <span className="text-xs text-neutral-500 font-normal normal-case tracking-normal">Primary Training Ground</span>
                </div>
                <p className="text-xl font-bold text-white flex items-center gap-2">
                  <IconDumbbell size={18} className="text-emerald-400" />
                  {locationLabel[profile.location]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly routine strip */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3">Precision Weekly Routine</h2>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {WEEK.map((day) => {
            const dayPlan = aiResult?.weeklyPlans?.[day]
            const isRest = dayPlan
              ? dayPlan.workoutType?.toLowerCase() === 'rest'
              : profile.restdays?.some(d => d.toLowerCase() === day)
            const label = dayPlan ? (isRest ? 'Rest' : dayPlan.focus) : (isRest ? 'Rest' : 'Training')
            const isToday = day === todayKey

            return (
              <div
                key={day}
                className={`rounded-xl px-2 py-4 flex flex-col items-center gap-2 border ${
                  isToday ? 'bg-emerald-400 border-emerald-400' : 'bg-white/3 border-white/10'
                }`}
              >
                <span className={`text-xs font-semibold uppercase ${isToday ? 'text-neutral-950/70' : 'text-neutral-500'}`}>
                  {day.slice(0, 3)}
                </span>
                <span className={isToday ? 'text-neutral-950' : (isRest ? 'text-neutral-600' : 'text-emerald-400')}>
                  {isRest ? <IconBed size={18} /> : <IconDumbbell size={18} />}
                </span>
                <span className={`text-xs font-semibold text-center truncate w-full ${isToday ? 'text-neutral-950' : 'text-neutral-300'}`}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
        {!aiResult && (
          <p className="text-neutral-500 text-xs mt-2">Showing rest days from your profile — generate a plan to see your full weekly focus.</p>
        )}
      </div>

      {profile.healthIssues && (
        <div className="surface-card px-5 py-4">
          <p className="text-xs font-medium text-neutral-500 mb-1">Health Notes</p>
          <p className="text-sm text-neutral-300">{profile.healthIssues}</p>
        </div>
      )}
    </div>
  )
}

export default ProfileCard
