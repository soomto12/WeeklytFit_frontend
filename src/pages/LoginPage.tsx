import AuthForm from '../components/AuthForm'

function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="surface-card p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-1 text-center">Welcome</h2>
        <p className="text-neutral-400 text-sm text-center mb-6">Sign in to your Weekly Fit account.</p>
        <AuthForm />
      </div>
    </div>
  )
}

export default LoginPage
