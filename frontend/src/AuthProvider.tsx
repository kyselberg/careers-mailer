import { AuthContext } from '@/auth'
import React, { useEffect, useState } from 'react'
import type { User } from './auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Restore auth state on app load
  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      // Validate token with your API
      fetch('/api/auth/validate-token', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((userData) => {
          if (userData.valid) {
            setUser(userData.user)
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem('auth-token')
          }
        })
        .catch(() => {
          localStorage.removeItem('auth-token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  const login = async (email: string, password: string) => {
    // Replace with your authentication logic
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const userData = await response.json()
      setUser(userData)
      setIsAuthenticated(true)
      // Store token for persistence
      localStorage.setItem('auth-token', userData.access_token)
    } else {
      throw new Error('Authentication failed')
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('auth-token')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
