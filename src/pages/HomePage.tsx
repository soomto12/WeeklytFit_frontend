import { useNavigate } from 'react-router-dom'

const cards = [
  {
    emoji: '🤖',
    title: 'Generate with AI',
    desc: 'Let our AI build your personalized weekly workout routine based on your profile.',
    route: '/generate',
    btn: 'Generate My Plan',
    color: 'bg-green-600',
  },
  {
    emoji: '📊',
    title: 'Dashboard',
    desc: 'View your active plan, track your progress, and stay on top of your weekly goals.',
    route: '/dashboard',
    btn: 'Go to Dashboard',
    color: 'bg-blue-600',
  },
  {
    emoji: '⭐',
    title: 'Subscribe',
    desc: 'Unlock unlimited AI-generated plans, advanced tracking, and premium features.',
    route: '/subscribe',
    btn: 'View Plans',
    color: 'bg-purple-600',
  },
]

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-4xl mx-auto">

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Welcome back 💪</h1>
          <p className="text-gray-500 text-lg">What would you like to do today?</p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mt-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            3 weeks free trial — no credit card required
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ emoji, title, desc, route, btn, color }) => (
            <div key={title} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
              <div className="text-4xl">{emoji}</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{title}</h2>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
              <button
                onClick={() => navigate(route)}
                className={`${color} text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity mt-auto`}
              >
                {btn}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default HomePage
