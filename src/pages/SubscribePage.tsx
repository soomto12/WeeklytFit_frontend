import { useState } from "react"
import { API_BASE_URL } from '../libs/config'
import { IconCheck } from '../components/icons'

const plans = [
  {
    name: 'Weekly',
    price: '$5',
    period: '/ week',
    desc: 'Perfect for trying out Weekly Fit.',
    features: ['1 AI-generated plan', 'Basic tracking', 'Email support'],
    highlight: false,
    badge: null,
  },
  {
    name: 'Monthly',
    price: '$15',
    period: '/ month',
    desc: 'Our most popular plan for consistent progress.',
    features: ['Unlimited AI plans', 'Advanced tracking', 'Priority support', 'Progress analytics'],
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Yearly',
    price: '$100',
    period: ' / year',
    desc: 'Best value for the long-term athlete.',
    features: ['Everything in Monthly', 'Custom workout notes', 'Early access to features', 'Dedicated support'],
    highlight: false,
    badge: 'Best Value',
  },
]

function SubscribePage() {
  const [serverError, setSeverError] = useState<null | string>(null)

  const handleSubscribe = async (tier: string) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_BASE_URL}/subscription/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier }),
      })
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setSeverError((data && data.message) || 'Subscription failed.')
        return
      }
      setSeverError(null)

      // Expecting the server to return a Stripe session URL (e.g. { url: 'https://checkout.stripe.com/..' })
      const sessionUrl = data?.url
      if (sessionUrl) {
        // Redirect the user to the Stripe checkout session
        window.location.assign(sessionUrl)
      } else {
        console.warn('No session URL returned from subscription endpoint.', data)
      }
    } catch {
      setSeverError('Something went wrong. Please try again')
    }
  }

  return (
    <div className="px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Choose Your Plan</h1>
          <p className="text-neutral-400 text-lg">Flexible pricing to fit your fitness journey.</p>
          <div className="pill pill-accent mt-4">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Every plan includes a 3-week free trial — cancel anytime
          </div>
        </div>

        {serverError && <p className="text-red-400 text-sm text-center mb-6">{serverError}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(({ name, price, period, desc, features, highlight, badge }) => (
            <div
              key={name}
              className={`rounded-2xl p-8 flex flex-col border relative ${
                highlight ? 'bg-emerald-400/5 border-emerald-400/40' : 'surface-card'
              }`}
            >
              {badge && (
                <span className="pill pill-accent absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  {badge}
                </span>
              )}

              <h2 className="text-xl font-bold text-white mb-1">{name}</h2>
              <p className="text-neutral-500 text-sm mb-4">{desc}</p>

              <div className="flex items-end gap-1 mb-6">
                <span className="text-5xl font-extrabold text-white">{price}</span>
                <span className="text-neutral-500 mb-2">{period}</span>
              </div>

              <ul className="flex flex-col gap-2 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-neutral-300 text-sm">
                    <IconCheck size={15} className="text-emerald-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(name.toLocaleLowerCase())}
                className={`py-3 rounded-xl mt-auto font-semibold transition-colors ${
                  highlight ? 'btn-accent' : 'btn-outline'
                }`}
              >
                Get {name} Plan
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default SubscribePage
