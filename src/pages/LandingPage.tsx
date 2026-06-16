import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-center gap-12 px-8 py-24">
        <div className="max-w-lg text-left">
          <h1 className="text-5xl font-bold text-green-600 leading-tight mb-4">
            Your Personal AI Fitness Coach
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Tell us about yourself and we'll generate a personalized weekly workout routine built around your goals, fitness level, and lifestyle.
          </p>
          <Link
            to="/login"
            className="bg-green-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-green-700 transition-colors text-lg"
          >
            Get Your Plan 💪
          </Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop"
          alt="Person working out"
          className="w-full max-w-sm rounded-2xl shadow-xl object-cover"
        />
      </section>

      {/* Features */}
      <section className="bg-green-50 py-20 px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Weekly Fit?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { emoji: '🤖', title: 'AI-Powered', desc: 'Our AI builds a unique plan tailored to your body, goals, and schedule.' },
            { emoji: '📅', title: 'Weekly Routines', desc: 'Get a fresh, structured 7-day workout plan every week — no guesswork.' },
            { emoji: '📈', title: 'Track Progress', desc: 'Stay consistent and watch yourself grow stronger week after week.' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl shadow p-6 text-center">
              <div className="text-5xl mb-4">{emoji}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
          {[
            { step: '1', text: 'Create your profile — age, weight, fitness level & goals.' },
            { step: '2', text: 'Our AI generates your personalized weekly routine.' },
            { step: '3', text: 'Follow your plan, crush your goals, repeat.' },
          ].map(({ step, text }) => (
            <div key={step} className="flex flex-col items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-full bg-green-600 text-white text-2xl font-bold flex items-center justify-center">
                {step}
              </div>
              <p className="text-gray-500 text-base max-w-xs">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600 py-16 text-center px-8">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your fitness?</h2>
        <p className="text-green-100 mb-8 text-lg">Join thousands already training smarter with Weekly Fit.</p>
        <Link
          to="/login"
          className="bg-white text-green-600 font-semibold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors text-lg"
        >
          Start for Free
        </Link>
      </section>

    </div>
  )
}

export default LandingPage
