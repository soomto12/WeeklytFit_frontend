import { useRef } from 'react'
import type { WorkoutFormData } from '../libs/types'
import { useUser } from '../context/UserContext'
import { API_BASE_URL } from '../libs/config'

const locationLabel: Record<WorkoutFormData['location'], string> = {
  gym: 'Gym',
  homeWorkOut: 'Home',
  both: 'Gym & Home',
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
    </div>
  )
}

function ProfileCard({ profile, onEdit }: { profile: WorkoutFormData; onEdit: () => void }) {
  const { user, setUser, token } = useUser()
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

  return (
    <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">

        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative group shrink-0 rounded-full focus:outline-none"
            title="Change photo"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg uppercase">
                  {user?.name?.charAt(0) ?? '?'}
                </span>
              </div>
            )}
            {/* hover overlay */}
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={onEdit}
          className="text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 hover:border-green-700 px-3 py-1 rounded-lg transition-colors"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Stat label="Goal" value={profile.goal} />
        <Stat label="Age" value={`${profile.age} yrs`} />
        {profile.weight && <Stat label="Weight" value={`${profile.weight} kg`} />}
        {profile.height && <Stat label="Height" value={`${profile.height} cm`} />}
        {profile.dailyHours && <Stat label="Daily Hours" value={`${profile.dailyHours} h`} />}
        <Stat label="Location" value={locationLabel[profile.location]} />
        <Stat
          label="Level"
          value={profile.difficultLevel.charAt(0).toUpperCase() + profile.difficultLevel.slice(1)}
        />
      </div>

      {profile.restdays && profile.restdays.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 mb-2">Rest Days</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.restdays.map((day) => (
              <span key={day} className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                {day}
              </span>
            ))}
          </div>
        </div>
      )}

      {profile.healthIssues && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Health Notes</p>
          <p className="text-sm text-gray-600">{profile.healthIssues}</p>
        </div>
      )}
    </div>
  )
}

export default ProfileCard
