import { Link } from 'react-router-dom'
import { IconArrowRight } from '../icons'
import { InfoAlert } from './InfoAlert'

export function GenerateCard({ hasProfile, loading, hasPlan, onGenerate }: {
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
