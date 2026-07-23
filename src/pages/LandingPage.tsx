import { Link } from 'react-router-dom'
import { IconArrowRight, IconSparkles, IconCalendar, IconTrendingUp, IconCheck } from '../components/icons'

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function CircularProgress({ percent }: { percent: number }) {
  const size = 96
  const stroke = 8
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="#34d399" strokeWidth={stroke} fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
      />
      <text
        x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        transform={`rotate(90 ${size / 2} ${size / 2})`}
        className="fill-white font-bold" style={{ fontSize: 20 }}
      >
        {percent}%
      </text>
    </svg>
  )
}

const FEATURES = [
  { emoji: '🤖', title: 'AI-Powered Plans', desc: 'Our AI analyzes your goals and schedule to craft a routine that adapts to your progress.' },
  { emoji: '📈', title: 'Track Progress', desc: 'Watch yourself grow with clear weekly progress tracking.' },
]

const STEPS = [
  { step: '01', title: 'Create Profile', desc: 'Input your stats, limitations, and specific training goals.' },
  { step: '02', title: 'AI Generates Routine', desc: 'Our AI processes your profile to generate your unique weekly strategy.' },
  { step: '03', title: 'Crush Your Goals', desc: 'Follow your interactive daily guide, log your results, and watch the transformation.' },
]

function LandingPage() {
  return (
    <div className="flex flex-col bg-neutral-950">

      {/* Hero */}
      <section className="px-6 md:px-12 pt-20 pb-28 max-w-3xl">
        <span className="pill pill-accent mb-6">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          AI-POWERED PERFORMANCE
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Your Personal <span className="text-emerald-400">AI Fitness</span> Coach
        </h1>
        <p className="text-neutral-400 text-lg mb-10 max-w-xl">
          Tell us about yourself and we'll generate a personalized weekly workout routine built around your goals, fitness level, and lifestyle.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/login" className="btn-accent px-7 py-3.5 text-base inline-flex items-center gap-2">
            Get Your Plan <IconArrowRight size={18} />
          </Link>
          <a href="#why" className="btn-outline px-7 py-3.5 text-base">
            View Demo
          </a>
        </div>
      </section>

      {/* Why Weekly Fit */}
      <section id="why" className="px-6 md:px-12 py-20 border-t border-white/10">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">Why Weekly Fit?</h2>
          <p className="text-neutral-400">Experience the intersection of advanced technology and human performance optimization.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="surface-card surface-card-hover p-8">
            <div className="w-11 h-11 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-6 text-emerald-400">
              <IconSparkles size={22} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{FEATURES[0].title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">{FEATURES[0].desc}</p>
          </div>

          <div className="surface-card surface-card-hover p-8">
            <div className="w-11 h-11 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-4 text-emerald-400">
              <IconCalendar size={22} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Weekly Routines</h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-5">Fresh 7-day plans generated every week to keep your body guessing and your motivation peaking.</p>
            <div className="grid grid-cols-7 gap-2">
              {DAY_LETTERS.map((d, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold ${
                    i === 3 ? 'bg-emerald-400 text-neutral-950' : 'bg-white/5 text-neutral-500'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card surface-card-hover p-8 flex items-center gap-6">
            <CircularProgress percent={75} />
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Track Progress</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Watch yourself grow week over week with a clear log of what's done, missed, or skipped.</p>
            </div>
          </div>

          <div className="surface-card surface-card-hover p-8 flex flex-col justify-center">
            <div className="w-11 h-11 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-4 text-emerald-400">
              <IconTrendingUp size={22} />
            </div>
            <h3 className="text-xl font-bold text-emerald-400 mb-2">Elite Level Performance</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">Every rep, every set, planned around your body and your goals — not a generic template.</p>
          </div>
        </div>
      </section>

      {/* Precision Workflow */}
      <section className="px-6 md:px-12 py-20 border-t border-white/10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-3">Precision Workflow</h2>
          <p className="text-neutral-400">Three steps to a completely optimized fitness lifecycle.</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          <div className="hidden md:block absolute top-6 left-[16.5%] right-[16.5%] h-px bg-white/10" />
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col items-center text-center gap-4 relative">
              <div className="w-12 h-12 rounded-full bg-neutral-950 border border-emerald-400/30 text-emerald-400 font-bold flex items-center justify-center relative z-10">
                {step}
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-neutral-400 text-sm max-w-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-20 border-t border-white/10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to transform your fitness?</h2>
        <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">Join thousands already training smarter with Weekly Fit. Start your precision journey today.</p>
        <div className="flex flex-col items-center gap-3">
          <Link to="/login" className="btn-accent px-8 py-4 text-base">Start for Free</Link>
          <span className="text-neutral-500 text-sm inline-flex items-center gap-1.5">
            <IconCheck size={14} className="text-emerald-400" /> No credit card required.
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-14 border-t border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="text-white font-bold mb-2">Weekly Fit</p>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
              Precision training for the modern human. AI-driven routines for elite performance.
            </p>
          </div>
          <div>
            <p className="text-emerald-400 font-semibold text-sm mb-3">Platform</p>
            <ul className="flex flex-col gap-2 text-sm text-neutral-400">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/generate" className="hover:text-white transition-colors">Workouts</Link></li>
              <li><Link to="/subscribe" className="hover:text-white transition-colors">Subscription</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-emerald-400 font-semibold text-sm mb-3">Company</p>
            <ul className="flex flex-col gap-2 text-sm text-neutral-500">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <p className="max-w-5xl mx-auto mt-10 pt-6 border-t border-white/5 text-neutral-600 text-xs">
          © {new Date().getFullYear()} Weekly Fit AI. Precision performance for elite athletes.
        </p>
      </footer>

    </div>
  )
}

export default LandingPage
