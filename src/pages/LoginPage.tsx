import AuthForm from '../components/AuthForm'

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">Welcome 💪</h2>
        <AuthForm />
      </div>
    </div>
  )
}

export default LoginPage
