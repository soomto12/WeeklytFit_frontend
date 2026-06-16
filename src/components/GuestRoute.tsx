import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function GuestRoute() {
  const { token } = useUser()

  if (token) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}

export default GuestRoute
