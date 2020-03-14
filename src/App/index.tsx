import React from 'react'
import { Routes } from './Routes'
import { AuthProvider } from 'config/auth'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}

export default App
