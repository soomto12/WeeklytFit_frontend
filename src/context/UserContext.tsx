import { createContext, useContext, useEffect, useState, type ReactNode, } from 'react'
import { API_BASE_URL } from '../libs/config'
import { useNavigate } from 'react-router-dom'

type User = {
  id: string
  name: string
  email: string
  image?: string
}

type UserContextType = {
  user: User | null
  setUser: (user: User | null) => void
  token: string | null
  setToken: (token: string | null) => void
  logout: () => void
  error : string | null
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )
   const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const getUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const resData = await res.json()
        if (!res.ok) {
          setToken(null)
          localStorage.removeItem('token')
          setError(resData.message ?? 'Failed to fetch user.')
          return
        }
        console.log(resData.message)
        setUser(resData.user)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error.')
      }
    }

    getUser()
  }, [token])

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    navigate('/')
  }





  
  


  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, logout, error }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used inside <UserProvider>')
  }
  return context
}
