import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AppShell from './components/AppShell'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import { UserProvider } from './context/UserContext'
import { PlanProvider } from './context/PlanContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import GeneratePage from './pages/GeneratePage'
import DashboardPage from './pages/DashboardPage'
import SubscribePage from './pages/SubscribePage'
import ProfilePage from './pages/ProfilePage'
import './App.css'


function App() {
  return (
    <BrowserRouter>
      <UserProvider>
      <PlanProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
      </PlanProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
