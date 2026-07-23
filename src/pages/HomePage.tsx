import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { IconDumbbell, IconGrid, IconStar, IconArrowRight } from '../components/icons'

const cards = [
  {
    icon: IconDumbbell,
    title: 'Generate with AI',
    desc: 'Let our AI build your personalized weekly workout routine based on your profile.',
    route: '/generate',
    btn: 'Generate My Plan',
  },
  {
    icon: IconGrid,
    title: 'Dashboard',
    desc: 'View your active plan, track your progress, and stay on top of your weekly goals.',
    route: '/dashboard',
    btn: 'Go to Dashboard',
  },
  {
    icon: IconStar,
    title: 'Subscribe',
    desc: 'Unlock unlimited AI-generated plans, advanced tracking, and premium features.',
    route: '/subscribe',
    btn: 'View Plans',
  },
]

function HomePage() {
  const navigate = useNavigate()
  const { user } = useUser()

  return (
    <div className="px-6 py-16">
      <div className="max-w-4xl mx-auto">

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p className="text-neutral-400 text-lg">What would you like to do today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ icon: Icon, title, desc, route, btn }) => (
            <div key={title} className="surface-card surface-card-hover p-6 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                <Icon size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">{title}</h2>
                <p className="text-neutral-400 text-sm">{desc}</p>
              </div>
              <button
                onClick={() => navigate(route)}
                className="btn-accent py-2.5 px-4 text-sm mt-auto inline-flex items-center justify-center gap-2"
              >
                {btn} <IconArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default HomePage
