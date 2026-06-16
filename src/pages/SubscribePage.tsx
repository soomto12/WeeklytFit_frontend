import { useState } from "react"

const plans = [
  {
    name: 'Weekly',
    price: '$5',
    period: '/ week',
    desc: 'Perfect for trying out Weekly Fit.',
    features: ['1 AI-generated plan', 'Basic tracking', 'Email support'],
    color: 'border-gray-200',
    btn: 'bg-gray-800',
    badge: null,
  },
  {
    name: 'Monthly',
    price: '$15',
    period: '/ month',
    desc: 'Our most popular plan for consistent progress.',
    features: ['Unlimited AI plans', 'Advanced tracking', 'Priority support', 'Progress analytics'],
    color: 'border-green-500',
    btn: 'bg-green-600',
    badge: 'Most Popular',
  },
  {
    name: 'Yearly',
    price: '$100',
    period: ' / year',
    desc: 'Best value for the long-term athlete.',
    features: ['Everything in Monthly', 'Custom workout notes', 'Early access to features', 'Dedicated support'],
    color: 'border-purple-500',
    btn: 'bg-purple-600',
    badge: 'Best Value',
  },
]

function SubscribePage() {
  const [serverError, setSeverError] = useState<null | string> (null)





  const handleSubscribe = async (tier: string) => {

  
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:3001/subscription/post', {
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
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Choose Your Plan</h1>
          <p className="text-gray-500 text-lg">Flexible pricing to fit your fitness journey.</p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mt-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Every plan includes a 3-week free trial — cancel anytime
          </div>
        </div>
     <h1>  {serverError } </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map(({ name, price, period, desc, features, color, btn, badge }) => (

          
            <div
              key={name}
              className={`bg-white rounded-2xl shadow p-8 flex flex-col border-2 ${color} relative`}
           
>
              {badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 ${btn} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                  {badge}
                </span>
              )}

              <h2 className="text-xl font-bold text-gray-800 mb-1">{name}</h2>
              <p className="text-gray-400 text-sm mb-4">{desc}</p>

              <div className="flex items-end gap-1 mb-6">
                <span className="text-5xl font-extrabold text-gray-800">{price}</span>
                <span className="text-gray-400 mb-2">{period}</span>
              </div>

              <ul className="flex flex-col gap-2 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-600 text-sm">
                    <span className="text-green-500 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(name.toLocaleLowerCase())}
                className={`${btn} text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity mt-auto`}
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
