import { useState } from 'react'
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, loginSchema, SignUpData } from '../libs/types'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function AuthForm() {
  const [isLoginForm, setIsLoginForm] = useState(false)
  const navigate = useNavigate()
  const { setToken } = useUser()
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpData>({
    resolver: zodResolver(isLoginForm ? loginSchema : signUpSchema) as unknown as Resolver<SignUpData>,
  })

  const login = () => {
    setIsLoginForm((pre) => !pre)
  }

  const onSubmit: SubmitHandler<SignUpData> = async (data) => {

    setServerError('')
    setIsLoading(true)
    if (isLoginForm) {
      try {
        const res = await fetch("http://localhost:3001/users/login", {  // http://localhost:3001/users/login
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
        if (!res.ok) {
          const err = await res.json()
          setServerError(err.message || 'Login failed. Please try again.')
          return
        } 

          const { token } = await res.json()
          localStorage.setItem('token', token)
          setToken(token)
          navigate('/home')
      } catch (err) {
        console.error(err)
        setServerError('Something went wrong. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      try {
        const res = await fetch("http://localhost:3001/users/register", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
        if (!res.ok) {
          const err = await res.json()
          setServerError(err.message || 'Registration failed. Please try again.')
        } else {
          const { token } = await res.json()
          localStorage.setItem('token', token)
          setToken(token)
          navigate('/home')
        }
      } catch {
        setServerError('Something went wrong. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {!isLoginForm ? (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            {...register('name')}
            type="text"
            placeholder="Enter your name"
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
        </div>
      ) : null}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="Enter your email"
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          {...register('password')}
          type="password"
          placeholder="Enter your password"
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
      </div>

      {serverError && (
        <p className="text-red-500 text-sm text-center">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Loading...
          </>
        ) : 'Get Started'}
      </button>

      <p className="text-center text-sm text-gray-500">
        {isLoginForm ? "Don't have an account?" : 'Already have an account?'}{' '}
        <span
          className="text-green-600 font-medium cursor-pointer hover:underline"
          onClick={login}
        >
          {isLoginForm ? 'Sign up' : 'Log in'}
        </span>
      </p>
    </form>
  )
}

export default AuthForm
