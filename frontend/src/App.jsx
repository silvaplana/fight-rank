import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MainApp from './pages/MainApp'

function Screens() {
  const { currentUser, loading } = useApp()
  const [screen, setScreen] = useState('login') // 'login' | 'signup'

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Chargement…
        </p>
      </div>
    )
  }

  if (currentUser) return <MainApp />

  if (screen === 'signup') {
    return <SignupPage onDone={() => setScreen('login')} onCancel={() => setScreen('login')} />
  }

  return <LoginPage onGoToSignup={() => setScreen('signup')} />
}

export default function App() {
  return (
    <AppProvider>
      <div className="app-shell">
        <Screens />
      </div>
    </AppProvider>
  )
}
